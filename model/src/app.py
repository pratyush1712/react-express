from flask import Flask, jsonify
import pandas as pd
import numpy as np
import os

app = Flask(__name__)


@app.route("/predict", methods=["POST"])
def index():
    return jsonify("Hello World")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8002))
    app.run(host="0.0.0.0", port=port)
