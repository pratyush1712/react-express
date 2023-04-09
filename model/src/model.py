import os
import json
import operator
import numpy as np
import statistics
import pandas as pd
import scipy.stats as stats
import spotipy
import requests
import matplotlib.pyplot as plt
import seaborn as sns
from spotipy.oauth2 import SpotifyClientCredentials
from tqdm import tqdm
from sklearn import preprocessing
from sklearn.preprocessing import MinMaxScaler

SIZE = 500  # this defines how many playlists we want

# for Spotify API
cid = "3e57a43a806346728814e707b070dd29"
secret = "358dc112492d4b58a24cb70afc022d95"
client_credentials_manager = SpotifyClientCredentials(
    client_id=cid, client_secret=secret
)
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

def unpack(json_name):
    """
    unpack a json playlist file to obtain a playlist
    input: a file name
    return: SIZE list of playlists
    """
    # Opening JSON file
    f = open(json_name)

    # returns JSON object as
    # a dictionary
    data = json.load(f)
    f.close()
    playlists = data["playlists"]
    return playlists

playlists = unpack(json_name="playlists.json")

def find_uris(playlists, start=0, SIZE=SIZE):
    """
    ouput the uri list for a given playlist
    input: a playlist
    return: a list of all track uris, and the playlist uri
    """
    track_uris = [
        [i["track_uri"] for i in playlists[j]["tracks"]] for j in range(start, SIZE)
    ]
    pids = [playlists[i]["pid"] for i in range(start, SIZE)]
    return track_uris, pids

# check track_uris for first playlist in dataset
start = 0
uri_list, pids = find_uris(playlists, start, SIZE)

def playlist_summarise(playlist_uri):
    """
    where we query playlist uris with spotify API
    input: list of uris for a given playlist
    return: the mean features of the given playlist
    """
    all_key = np.zeros(len(playlist_uri))
    all_acousticness = np.zeros(len(playlist_uri))
    all_danceability = np.zeros(len(playlist_uri))
    all_energy = np.zeros(len(playlist_uri))
    all_instrumentalness = np.zeros(len(playlist_uri))
    all_loudness = np.zeros(len(playlist_uri))
    all_speechiness = np.zeros(len(playlist_uri))
    all_valence = np.zeros(len(playlist_uri))
    all_tempo = np.zeros(len(playlist_uri))

    # unpack each uri
    for i in tqdm(range(len(playlist_uri))):
        # query spotify api
        audio_features = sp.audio_features(playlist_uri[i])
        all_key[i] = audio_features[0]["key"]
        all_acousticness[i] = audio_features[0]["acousticness"]
        all_danceability[i] = audio_features[0]["danceability"]
        all_energy[i] = audio_features[0]["energy"]
        all_instrumentalness[i] = audio_features[0]["instrumentalness"]
        all_loudness[i] = audio_features[0]["loudness"]
        all_speechiness[i] = audio_features[0]["speechiness"]
        all_valence[i] = audio_features[0]["valence"]
        all_tempo[i] = audio_features[0]["tempo"]

    # calculate means
    key = np.mean(all_key)
    acousticness = np.mean(all_acousticness)
    danceability = np.mean(all_danceability)
    energy = np.mean(all_energy)
    instrumentalness = np.mean(all_instrumentalness)
    loudness = np.mean(all_loudness)
    speechiness = np.mean(all_speechiness)
    valence = np.mean(all_valence)
    tempo = np.mean(all_tempo)

    # return all means
    return [
        key,
        acousticness,
        danceability,
        energy,
        instrumentalness,
        loudness,
        speechiness,
        valence,
        tempo,
    ]

def normalize_df(df, col_names):
    x = df.values  # returns a numpy array
    min_max_scaler = MinMaxScaler()
    x_scaled = min_max_scaler.fit_transform(x)
    df = pd.DataFrame(x_scaled, columns=col_names)
    return df

def create_playlist_dataframe(playlists):
    """
    summary function to allow ease of playlist transformation into a df
    input: SIZE list of playlists
    output: dataframe with all mean playlist features
    """
    # find uris and playlist ids
    uri_list, pids = (playlists, start, SIZE)

    # set up dataframe
    col_names = [
        "pid",
        "key",
        "acousticness",
        "danceability",
        "energy",
        "instrumentalness",
        "loudness",
        "speechiness",
        "valence",
        "tempo",
    ]
    df = pd.DataFrame(columns=col_names)  # generate empty df

    # iterate through and get features for each playlist
    for i in range(SIZE):
        features = playlist_summarise(uri_list[i])
        features.insert(0, 0)
        df.loc[i] = features

    df = normalize_df(df, col_names)
    # insert ids
    df["pid"] = pids
    return df

# playlist_df = create_playlist_dataframe(playlists)
playlist_df = pd.read_csv("playlist_df.csv", index_col=0)

genres = [
    "pop",
    "hip-hop",
    "edm",
    "latin",
    "rock",
    "r-n-b",
    "country",
    "jazz",
    "classical",
    "alternative",
]
# number of songs to query per genre
song_num = 100
n_requests = 20
# we generate using genre seeds
pop_uris = []
hip_hop_uris = []
edm_uris = []
latin_uris = []
rock_uris = []
randb_uris = []
country_uris = []
jazz_uris = []
classical_uris = []
alternative_uris = []

# query spotify api for each genre n_requests time
# this method bypasses the 100 limit on song queries
for i in range(n_requests):
    pop_recs = sp.recommendations(seed_genres=["pop"], limit=song_num)
    pop_uris += [i["uri"] for i in pop_recs["tracks"]]
    hip_hop_recs = sp.recommendations(seed_genres=["hip-hop"], limit=song_num)
    hip_hop_uris += [i["uri"] for i in hip_hop_recs["tracks"]]
    edm_recs = sp.recommendations(seed_genres=["edm"], limit=song_num)
    edm_uris += [i["uri"] for i in edm_recs["tracks"]]
    latin_recs = sp.recommendations(seed_genres=["latin"], limit=song_num)
    latin_uris += [i["uri"] for i in latin_recs["tracks"]]
    rock_recs = sp.recommendations(seed_genres=["rock"], limit=song_num)
    rock_uris += [i["uri"] for i in rock_recs["tracks"]]
    randb_recs = sp.recommendations(seed_genres=["r-n-b"], limit=song_num)
    randb_uris += [i["uri"] for i in randb_recs["tracks"]]
    country_recs = sp.recommendations(seed_genres=["country"], limit=song_num)
    country_uris += [i["uri"] for i in country_recs["tracks"]]
    jazz_recs = sp.recommendations(seed_genres=["jazz"], limit=song_num)
    jazz_uris += [i["uri"] for i in jazz_recs["tracks"]]
    classical_recs = sp.recommendations(seed_genres=["classical"], limit=song_num)
    classical_uris += [i["uri"] for i in classical_recs["tracks"]]
    alternative_recs = sp.recommendations(seed_genres=["alternative"], limit=song_num)
    alternative_uris += [i["uri"] for i in alternative_recs["tracks"]]

# turn into sets to remove duplicates
pop_uris = list(set(pop_uris))
hip_hop_uris = list(set(hip_hop_uris))
edm_uris = list(set(edm_uris))
latin_uris = list(set(latin_uris))
rock_uris = list(set(rock_uris))
randb_uris = list(set(randb_uris))
country_uris = list(set(country_uris))
jazz_uris = list(set(jazz_uris))
classical_uris = list(set(classical_uris))
alternative_uris = list(set(alternative_uris))

song_uris = (
    pop_uris
    + hip_hop_uris
    + edm_uris
    + latin_uris
    + rock_uris
    + randb_uris
    + country_uris
    + jazz_uris
    + classical_uris
    + alternative_uris
)
# create a list for labels
genre_list = (
    (["pop"] * len(pop_uris))
    + (["hip-hop"] * len(hip_hop_uris))
    + (["edm"] * len(edm_uris))
    + (["latin"] * len(latin_uris))
    + (["rock"] * len(rock_uris))
    + (["r-n-b"] * len(randb_uris))
    + (["country"] * len(country_uris))
    + (["jazz"] * len(jazz_uris))
    + (["classical"] * len(classical_uris))
    + (["alternative"] * len(alternative_uris))
)

def create_song_dataframe(song_uris):
    """
    combine all song URIS into a df
    input: song uris
    output: dataframe with all song features
    """

    # set up dataframe
    col_names = [
        "uri",
        "genre",
        "key",
        "acousticness",
        "danceability",
        "energy",
        "instrumentalness",
        "loudness",
        "speechiness",
        "valence",
        "tempo",
    ]
    df = pd.DataFrame(columns=col_names)  # generate empty df

    # iterate through and get features for each playlist
    for i in tqdm(range(len(song_uris))):
        # get song features
        audio_features = sp.audio_features(song_uris[i])
        key = audio_features[0]["key"]
        acousticness = audio_features[0]["acousticness"]
        danceability = audio_features[0]["danceability"]
        energy = audio_features[0]["energy"]
        instrumentalness = audio_features[0]["instrumentalness"]
        loudness = audio_features[0]["loudness"]
        speechiness = audio_features[0]["speechiness"]
        valence = audio_features[0]["valence"]
        tempo = audio_features[0]["tempo"]
        features = [
            key,
            acousticness,
            danceability,
            energy,
            instrumentalness,
            loudness,
            speechiness,
            valence,
            tempo,
        ]
        features.insert(0, 0)
        features.insert(0, 0)
        df.loc[i] = features

    df = normalize_df(df, col_names)
    # insert uris and genres
    df["uri"] = song_uris
    df["genre"] = genre_list
    return df

song_df = create_song_dataframe(song_uris)

# label encode
for i in range(len(genres)):
    song_df["genre"] = np.where(song_df["genre"] == genres[i], i, song_df["genre"])

playlist_df_ul = playlist_df.drop(columns=["pid"])
song_df_ul = song_df.drop(columns=["uri", "genre"])

# ------------------------------------------------

# sklearn libraries
import sklearn
from sklearn.cluster import KMeans
from sklearn.cluster import SpectralClustering
from sklearn.decomposition import PCA
from sklearn.svm import LinearSVC
from sklearn import mixture
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score
from sklearn.metrics import confusion_matrix
from sklearn.model_selection import cross_val_score, KFold

# Libraries to create the Multi-class Neural Network
from keras.models import Sequential
from keras.layers import Dense
from keras.layers import Embedding
from keras.layers import Dropout
from keras.wrappers.scikit_learn import KerasClassifier
from keras.utils import np_utils
from keras import backend as K
from keras.optimizers import Adam
from keras.callbacks import EarlyStopping
from keras.losses import CategoricalCrossentropy
from keras import backend as K
import tensorflow as tf

X = song_df.drop(columns=["uri", "genre"]).values
y = song_df[["genre"]].values.ravel()
# train test split for model testing
X_train, X_test, y_train, y_test = train_test_split(
    X, list(y), test_size=0.05, random_state=2
)
# increment k from 1 to 50 and save the testing accuracy to find best k
k_range = range(1, 50)
scores_list = []

# test across values of k
for k in k_range:
    knn = KNeighborsClassifier(n_neighbors=k)
    kf = KFold(n_splits=10, shuffle=True)
    score_acc_list = []
    # implement k folding (10)
    for train_index, test_index in kf.split(X):
        X_train, X_test = list(X[train_index]), list(X[test_index])
        y_train, y_test = list(y[train_index]), list(y[test_index])
        knn.fit(X_train, y_train)
        y_pred = knn.predict(X_test)
        score_acc_list.append(accuracy_score(y_test, y_pred))
    scores_list.append(np.mean(score_acc_list))

# k somewhere near 40 is best
knn = KNeighborsClassifier(n_neighbors=40)
knn.fit(X_train, y_train)
y_pred = knn.predict(X_test)
# Create the confusion matrix using test data and predictions
cm = confusion_matrix(y_test, y_pred)
# plot the confusion matrix

knn_classes = knn.predict(playlist_df_ul.values)

pca = PCA(n_components=2)
pca.fit(song_df_ul.values)
projected_x = pca.transform(song_df_ul.values)
projected_y = pca.transform(playlist_df_ul.values)

kmeans = KMeans(n_clusters=10, random_state=0).fit(projected_x)

X_train, X_test, y_train, y_test = train_test_split(
    X, list(y), test_size=0.05, random_state=2
)
# using keras create NN
def classification_model():
    # Create the model
    model = Sequential()
    # Add 1 layer with 12 nodes, input of 9 dim with relu function
    model.add(Dense(12, input_dim=9, activation="relu", name="Dense_1"))
    model.add(Dropout(0.1, input_shape=(12,), name="Dropout_1"))
    # Add another layer
    model.add(Dense(24, input_dim=12, activation="relu", name="Dense_2"))
    # dropout layers lets us prevent overfitting
    model.add(Dropout(0.1, input_shape=(24,), name="Dropout_2"))
    # Add another layer
    model.add(Dense(48, input_dim=24, activation="relu", name="Dense_3"))
    # add tanh layer for sigmoid classification if i want to output embeddings
    model.add(Dense(96, input_dim=48, activation="tanh", name="Dense_4"))
    model.add(Dense(10, input_dim=96, activation="softmax", name="Output_Layer"))
    # Compile the model using cat cross ent loss function and adam optimizer with learning rate,
    # accuracy correspond to the metric displayed
    opt = Adam(learning_rate=0.02)
    loss = CategoricalCrossentropy(label_smoothing=0.2)
    model.compile(loss=loss, optimizer=opt, metrics=["accuracy"])
    return model

# define model
classifier = KerasClassifier(
    build_fn=classification_model, epochs=3000, batch_size=300, verbose=0
)

es = EarlyStopping(monitor="val_loss", mode="min", verbose=0, patience=400)
history = classifier.fit(X_train, y_train, validation_split=0.05, callbacks=[es])

classifier.fit(X_train, y_train)
# Predict the model with the test data
y_pred = classifier.predict(X_test)

def classify_playlist(playlist, KNN=True):
    """
    chooses which classifier to use (knn or nn)
    """

    if KNN == True:
        playlist_prediction = knn.predict(playlist.reshape(1, -1))

    elif KNN == False:
        playlist_prediction = classifier.predict(playlist.reshape(1, 9))

    return playlist_prediction

def predict_song(playlist_index, KNN, uri_label, own_playlist):

    # if uri is provided
    if own_playlist == True:
        playlist_uris = [
            i["track"]["uri"] for i in sp.playlist(uri_label)["tracks"]["items"]
        ]
        features = np.array(playlist_summarise(playlist_uris))
        playlist_name = sp.playlist(uri_label)["name"]
        print(f"Name of playlist: {playlist_name}")
        playlist_prediction = classify_playlist(features, KNN)
        print(f"The playlist is genre: {genres[playlist_prediction[0]]}")

    # if querying playlist from dataset
    else:
        print(f"Name of playlist: {playlists[playlist_index]['name']}")
        features = playlist_df_ul.values[playlist_index]
        playlist_prediction = classify_playlist(features, KNN)
        print(f"The playlist is genre: {genres[playlist_prediction[0]]}")

    # generate songs of specific genre
    genre_songs = song_df.loc[song_df["genre"] == playlist_prediction[0]]
    genre_songs = genre_songs.drop(columns=["genre"]).reset_index(drop=True)

    # so we take all genre songs we have and gaussian process
    # fit a Gaussian Mixture Model
    clf = mixture.GaussianMixture(
        n_components=(len(genre_songs)) // n_requests,
        covariance_type="full",
        random_state=0,
    )
    clf.fit(genre_songs.drop(columns=["uri"]).values)

    # predict classes using GMM
    classes = clf.predict(genre_songs.drop(columns=["uri"]).values)

    # recommend top x songs
    most_recommended_songs = clf.predict_proba(features.reshape(1, -1))[0]
    # print(most_recommended_songs)
    max_index, max_value = max(
        enumerate(most_recommended_songs), key=operator.itemgetter(1)
    )

    # take the songs
    songs_index = np.where(classes == max_index)
    selected_songs = genre_songs.loc[songs_index]
    selected_songs_uris = selected_songs["uri"].values

    # make sure songs aren't already in playlist
    if own_playlist == False:
        playlist_uris, pid = find_uris(
            playlists, start=playlist_index - 1, SIZE=playlist_index
        )
        playlist_uris = playlist_uris[0]

    # remove overlapping songs
    for element in playlist_uris:
        if element in selected_songs_uris:
            selected_songs_uris.remove(element)

    print("\n")
    print("The recommended songs, in no particular order, are:")
    counter = 0
    for i in selected_songs_uris:
        counter += 1
        print(f"{sp.track(i)['name']}, by {sp.track(i)['artists'][0]['name']}")
        if counter == 20:
            break

    return

predict_song(
    playlist_index=0,
    KNN=True,
    uri_label="spotify:playlist:1uxYGMdAecU679BHs3TaI7",
    own_playlist=False,
)

import pystan

target = list(song_df["genre"])
stan_data = {
    "N": len(song_df_ul),  # number of songs
    "N2": len(playlist_df_ul),  # number of playlists
    "D": len(song_df_ul.columns),  # number of features
    "K": 10,  # number of classes
    "y": np.array(target) + 1,  # the reponse
    "x": song_df_ul.values,  # model matrix
    "x_new": playlist_df_ul.values,
}
stan_code = """

data {
    int<lower=0> N; //the number of training observations
    int<lower=0> N2; //the number of test observations
    int<lower=1> D; //the number of features
    int<lower=2> K; //the number of classes
    int<lower=1, upper=K> y[N]; //the response
    matrix[N, D] x; //the model matrix
    matrix[N2, D] x_new; //the matrix for the predicted values
}

parameters {
    real alpha;
    matrix[D, K] beta; //the regression coefficient matrix
}

model {
    
    matrix[N, K] x_beta = x*beta;
    
    alpha ~ cauchy(0,10); //prior for the intercept following Gelman 2008
    
    to_vector(beta) ~ normal(0, 1); // prior on regression coefficients
    
    // logit output (logistic odds)
    for (n in 1:N) {
        y[n] ~ categorical_logit(x_beta[n]');
    }
}

// predict playlist df
generated quantities {                                                                               
    matrix[N2, K] y_pred;
    for (n in 1:N2) {
        for (k in 1:K) {
            y_pred[n,k] = alpha + x_new[n, ] * beta[, k]; //the y values predicted by the model
        }
        
    }
}


"""
stan_model = pystan.StanModel(model_code=stan_code)

# reminder of genres
genres = [
    "pop",
    "hip-hop",
    "edm",
    "latin",
    "rock",
    "r-n-b",
    "country",
    "jazz",
    "classical",
    "alternative",
]

def logitodds_to_probs(odds):
    """
    take exponent and divide over sum
    """
    return np.exp(odds) / np.sum(np.exp(odds))

def most_likely(probs):
    """
    use argmax to find highest probability genre
    """
    max_prob = np.argmax(probs)
    return max_prob

# append highest probability songs using functions above
blr_classes = []
for i in target:
    probs = logitodds_to_probs(i)
    classification = most_likely(probs)
    blr_classes.append(classification)

def predict_song_blr(class_array, index):
    """
    predict the next best songs
    using the bayesian logistic regression output
    we input the index of the song we want to predict
    and the whole classification array

    we use a GMM here as well
    """

    print(f"Name of playlist: {playlists[index]['name']}")
    features = playlist_df_ul.values[index]
    print(f"The playlist is genre: {genres[class_array[index]]}")

    genre_songs = song_df.loc[song_df["genre"] == class_array[index]]
    genre_songs = genre_songs.drop(columns=["genre"]).reset_index(drop=True)

    # so we take all genre songs we have and gaussian process
    # fit a Gaussian Mixture Model
    clf = mixture.GaussianMixture(
        n_components=(len(genre_songs)) // n_requests,
        covariance_type="full",
        random_state=0,
    )
    clf.fit(genre_songs.drop(columns=["uri"]).values)

    classes = clf.predict(genre_songs.drop(columns=["uri"]).values)

    # recommend top x songs
    most_recommended_songs = clf.predict_proba(features.reshape(1, -1))[0]
    # print(most_recommended_songs)
    max_index, max_value = max(
        enumerate(most_recommended_songs), key=operator.itemgetter(1)
    )

    # take the songs
    songs_index = np.where(classes == max_index)
    selected_songs = genre_songs.loc[songs_index]
    selected_songs_uris = selected_songs["uri"].values

    # make sure songs aren't already in playlist
    playlist_uris, pid = find_uris(playlists, start=index - 1, SIZE=index)
    playlist_uris = playlist_uris[0]

    # remove overlapping songs
    for element in playlist_uris:
        if element in selected_songs_uris:
            selected_songs_uris.remove(element)

    print("\n")
    print("The recommended songs, in no particular order, are:")
    counter = 0
    for i in selected_songs_uris:
        counter += 1
        print(f"{sp.track(i)['name']}, by {sp.track(i)['artists'][0]['name']}")
        if counter == 20:
            break

    return
