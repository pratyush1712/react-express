import datetime
import os
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from sklearn.preprocessing import StandardScaler
from dotenv import load_dotenv, find_dotenv
import concurrent.futures
from concurrent.futures import ThreadPoolExecutor

# load environment variables
load_dotenv(find_dotenv())

# configure spotify api with credentials from environment variables
client_id = os.environ.get("SPOTIFY_CLIENT_ID")
client_secret = os.environ.get("SPOTIFY_CLIENT_SECRET")
spotify = spotipy.Spotify(
    client_credentials_manager=SpotifyClientCredentials(client_id, client_secret)
)


def analyse_track_info(track, decade_features, top_artists):
    """
    Returns a dictionary with information about a track.
    """
    # get track artist
    track_artist = track["artists"][0]["name"]
    # get track year
    track_year = track["album"]["release_date"][:4]
    # add to top artists
    if track_artist in top_artists:
        top_artists[track_artist] += 1
    else:
        top_artists[track_artist] = 1
    # add to decade features
    decade = str(int(track_year) - int(track_year) % 10)
    decade_features[decade].append(track["name"])


def analyse_track_features(track_uri, average_features):
    """
    Returns a dictionary with the audio features for a track.
    """
    audio_features = spotify.audio_features(track_uri)
    audio_features = audio_features[0]
    # add to average features
    for feature in average_features:
        average_features[feature] += audio_features[feature]
    return audio_features


def get_tracks_analysis(tracks):
    """
    Returns a list of dictionaries with the audio analysis for a list of tracks.
    """
    # initialise list of dictionaries
    top_artists = {}
    average_features = {
        "acousticness": 0,
        "danceability": 0,
        "energy": 0,
        "instrumentalness": 0,
        "liveness": 0,
        "loudness": 0,
        "speechiness": 0,
        "tempo": 0,
        "valence": 0,
    }
    decade_features = {
        str(i): [] for i in range(1920, datetime.datetime.now().year + 1, 10)
    }

    with ThreadPoolExecutor(max_workers=3) as executor:
        futures = []
        for track in tracks:
            futures.append(
                executor.submit(analyse_track_info, track, decade_features, top_artists)
            )
            futures.append(
                executor.submit(analyse_track_features, track["uri"], average_features)
            )

    concurrent.futures.wait(futures)
    # round average features
    for feature in average_features:
        average_features[feature] = round(average_features[feature] / len(tracks), 2)
    # drop decade features with no tracks
    decade_features = {k: v for k, v in decade_features.items() if v}

    return {
        "top_artists": top_artists,
        "average_features": average_features,
        "decade_features": decade_features,
    }
