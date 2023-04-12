import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from pprint import pprint
import json
import time
import argparse
import numpy as np
import pandas as pd
import os
import pickle
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.model_selection import cross_val_score
import concurrent.futures
from dotenv import find_dotenv, load_dotenv

# load environment variables
load_dotenv(find_dotenv())

# configure spotify api with credentials from environment variables
client_id = os.environ.get("SPOTIFY_CLIENT_ID")
client_secret = os.environ.get("SPOTIFY_CLIENT_SECRET")
spotify = spotipy.Spotify(
    client_credentials_manager=SpotifyClientCredentials(client_id, client_secret)
)


def get_playlist_info(playlist):
    # initialize vars
    offset = 0
    tracks, uris, names, artists = [], [], [], []
    playlist = playlist["tracks"]
    # get all tracks in given playlist (max limit is 100 at a time --> use offset)
    while True:
        tracks += playlist["items"]
        if playlist["next"] is not None:
            playlist = spotify.next(playlist)
            offset += 100
        else:
            break

    # get track metadata
    for track in tracks:
        try:
            names.append(track["track"]["name"])
            artists.append(track["track"]["artists"][0]["name"])
            uris.append(track["track"]["uri"])
        except:
            pass

    return names, artists, uris


def get_features_for_track(df, track_uri):
    # access audio features for given track URI via spotipy
    try:
        audio_features = spotify.audio_features(track_uri)
        feature_subset = [
            audio_features[0][col]
            for col in df.columns
            if col not in ["name", "artist", "track_URI", "playlist"]
        ]
        return feature_subset
    except Exception as e:
        return None


def get_features_for_playlist(df, playlist):
    # get all track metadata from given playlist
    names, artists, uris = get_playlist_info(playlist)

    # create list of track_uris to pass to concurrent.futures ThreadPoolExecutor
    track_uris = [
        (name, artist, track_uri)
        for name, artist, track_uri in zip(names, artists, uris)
    ]

    # create ThreadPoolExecutor with max_workers=10
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        # submit each track_uri to executor and collect the Future objects
        futures = [
            executor.submit(get_features_for_track, df, track_uri)
            for _, _, track_uri in track_uris
        ]

        # iterate through each Future object, retrieve the result (or None), and save data into dataframe
        for future, (name, artist, track_uri) in zip(futures, track_uris):
            audio_features = future.result()
            if audio_features is not None:
                # compose a row of the dataframe by flattening the list of audio features
                row = [name, artist, track_uri, *audio_features, playlist["name"]]
                df.loc[len(df.index)] = row

    return df


# functions to loop through a list of playlist IDs
def get_all_songs(df, playlists):
    final_df = pd.DataFrame(
        columns=[
            "name",
            "artist",
            "track_URI",
            "acousticness",
            "danceability",
            "energy",
            "instrumentalness",
            "liveness",
            "loudness",
            "speechiness",
            "tempo",
            "valence",
            "playlist",
        ]
    )
    for playlist in playlists:
        if playlist.startswith("spotify:playlist:"):
            playlist = spotify.playlist(playlist)
        final_df = get_features_for_playlist(df, playlist)
        final_df = final_df.drop_duplicates()

    return final_df


def train():
    happy_playlist = [
        "spotify:playlist:37i9dQZF1DX3rxVfibe1L0",
        "spotify:playlist:37i9dQZF1DX6GwdWRQMQpq",
        "spotify:playlist:37i9dQZF1DX66m4icL86Ru",
        "spotify:playlist:0RH319xCjeU8VyTSqCF6M4",
        "spotify:playlist:37i9dQZF1DWZKuerrwoAGz",
    ]
    happy = pd.DataFrame(
        columns=[
            "name",
            "artist",
            "track_URI",
            "acousticness",
            "danceability",
            "energy",
            "instrumentalness",
            "liveness",
            "loudness",
            "speechiness",
            "tempo",
            "valence",
            "playlist",
        ]
    )

    happy = get_all_songs(happy, happy_playlist)
    sad_playlist = [
        "spotify:playlist:37i9dQZF1DX3YSRoSdA634",
        "spotify:playlist:37i9dQZF1DWSqBruwoIXkA",
        "spotify:playlist:37i9dQZF1DX3rxVfibe1L0",
        "spotify:playlist:4yXfnhz0BReoVfwwYRtPBm",
    ]
    sad = pd.DataFrame(
        columns=[
            "name",
            "artist",
            "track_URI",
            "acousticness",
            "danceability",
            "energy",
            "instrumentalness",
            "liveness",
            "loudness",
            "speechiness",
            "tempo",
            "valence",
            "playlist",
        ]
    )
    sad = get_all_songs(sad, sad_playlist)
    ones = np.ones(len(happy))
    happy.insert(3, "label", ones)
    zeros = np.zeros(len(sad))
    sad.insert(3, "label", zeros)
    full_data = happy.merge(sad, how="outer")
    train_full = full_data.drop(["name", "artist", "track_URI", "playlist"], axis=1)
    x_train, x_test, y_train, y_test = train_test_split(
        train_full.drop("label", axis=1),
        train_full["label"],
        test_size=0.2,
        random_state=0,
    )
    lr = LogisticRegression(max_iter=1000)
    lr.fit(x_train, y_train)
    cv_score = np.mean(cross_val_score(lr, x_test, y_test))
    print("Cross-validation score:", cv_score)
    pickle.dump(lr, open("model.sav", "wb"))


def predict(playlists):
    model = pickle.load(open("model.sav", "rb"))
    mixed = pd.DataFrame(
        columns=[
            "name",
            "artist",
            "track_URI",
            "acousticness",
            "danceability",
            "energy",
            "instrumentalness",
            "liveness",
            "loudness",
            "speechiness",
            "tempo",
            "valence",
            "playlist",
        ]
    )
    mixed = get_all_songs(mixed, playlists)
    vnpred = model.predict_proba(
        mixed.drop(["name", "artist", "track_URI", "playlist"], axis=1)
    )[:, 1]
    mixed.insert(3, "prediction", vnpred)
    day_median = float(np.median(mixed["prediction"]))
    return day_median


if __name__=="__main__":
    train()