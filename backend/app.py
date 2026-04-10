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
    try:
        with open("flavors.json") as data:
            flavors_json = json.load(data)
    except FileNotFoundError:
        return jsonify({"success": False, "message": "Flavors data file not found"}), 404
    except json.JSONDecodeError:
        return jsonify({"success": False, "message": "Flavors data file is invalid"}), 500
    
    return jsonify({"success": True, "message": "Flavors loaded.", "flavors": flavors_json}), 200

"""
Startup
"""

if __name__ == "__main__":
    app.run(debug=True, port=5050)
