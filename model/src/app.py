from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from utils import analysis
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


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8002))
    app.run(host="0.0.0.0", port=port, debug=True)
