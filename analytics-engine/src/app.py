from flask import Flask, jsonify
import pandas as pd
import numpy as np
import os

def success_response(body):
    return jsonify({"status": "success", "body": body})

def error_response(message):
    return jsonify({"status": "error", "message": message})

app = Flask(__name__)

@app.route("/")
def index():
    return success_response("Hello World")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8002))
    app.run(host="0.0.0.0", port=port)
