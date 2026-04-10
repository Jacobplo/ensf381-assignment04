"""
Group Members:
Name: Jacob Plourde, UCID: 30241981
Name: Dave Burgoin, UCID: 30214909
"""

"""
Imports and Initialization
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import bcrypt
import json

app = Flask(__name__)
CORS(app)

"""
Flask Routes
"""

@app.route("/flavors", methods=["GET"])
def get_flavors():
    with open("flavors.json") as data:
        flavors_json = json.load(data)
    
    return jsonify({}), 200

"""
Startup
"""

if __name__ == "__main__":
    app.run(debug=True, port=5050)
