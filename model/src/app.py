from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from utils import analysis
from model import predict
import json
import os

app = Flask(__name__)
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"


@app.route("/model/analyse-tracks", methods=["POST"])
@cross_origin()
def index():
    body = request.get_json()
    tracks = body.get("tracks")
    data = analysis.get_tracks_analysis(tracks)
    response = jsonify(data)
    return response


@app.route("/model/predict-mood/<playlist_id>/")
@cross_origin()
def mood_predict(playlist_id):
    data = predict([f"spotify:playlist:{playlist_id}"])
    return jsonify(f"{round(data*100, 2)}% happy")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8002))
    app.run(host="0.0.0.0", port=port, debug=True)
