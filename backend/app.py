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

app = Flask(__name__)
CORS(app)

"""
Flask Routes
"""



"""
Startup
"""

if __name__ == "__main__":
    app.run(debug=True, port=5050)
