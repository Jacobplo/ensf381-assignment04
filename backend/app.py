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
from datetime import datetime

app = Flask(__name__)
CORS(app)


users = {} # Each item should map the actual user id to a dictionary in this form {"id": int, "username": str, "email": str, "password_hash": ..., "cart": [], "orders": []} 

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

@app.route("/cart", methods=["GET"])
def get_cart():
    user_id = request.args.get("userId", type=int)
    if user_id is None:
        return jsonify({"success": False, "message": "User id missing or incorrect"}), 400

    try:
        cart = users[user_id]["cart"]
    except KeyError:
        return jsonify({"success": False, "message": "User data not found"}), 404
    
    return jsonify({"success": True, "message": "Cart loaded.", "cart": cart}), 200

@app.route("/cart", methods=["POST"])
def add_to_cart():
    data = request.json
    if data is None:
        return jsonify({"success": False, "message": "Invalid JSON"}), 400

    # Get attributes from request
    try: 
        user_id = data["userId"]
        flavor_id = data["flavorId"]
    except KeyError:
        return jsonify({"success": False, "message": "Missing JSON field(s)"}), 400 

    # Get user
    try:
        user_data = users[user_id]
    except KeyError:
        return jsonify({"success": False, "message": "User not found"}), 404

    # Get flavor
    try:
        with open("flavors.json") as file:
            flavors_json = json.load(file)
    except FileNotFoundError:
        return jsonify({"success": False, "message": "Flavors data file not found"}), 404
    except json.JSONDecodeError:
        return jsonify({"success": False, "message": "Flavors data file is invalid"}), 500
    
    flavor_data = get_flavor_from_id(flavors_json, flavor_id)
    if flavor_data is None:
        return jsonify({"success": False, "message": "Flavor id is invalid"}), 400

    # Add to cart
    cart_flavor = get_flavor_from_id(user_data["cart"], flavor_id)
    if cart_flavor is None:
        user_data["cart"].append({
            "flavorId": flavor_data["id"],
            "name": flavor_data["name"],
            "price": flavor_data["price"],
            "quantity": 1
        })
    else:
        return jsonify({"success": False, "message": "Flavor already in cart."}), 400

    return jsonify({"success": True, "message": "Flavor added to cart.", "cart": user_data["cart"]}), 200

@app.route("/cart", methods=["PUT"])
def update_cart_quantity():
    data = request.json
    if data is None:
        return jsonify({"success": False, "message": "Invalid JSON"}), 400

    # Get attributes from request
    try: 
        user_id = data["userId"]
        flavor_id = data["flavorId"]
        quantity = data["quantity"]
    except KeyError:
        return jsonify({"success": False, "message": "Missing JSON field(s)"}), 400 

    # Get user
    try:
        user_data = users[user_id]
    except KeyError:
        return jsonify({"success": False, "message": "User not found"}), 404

    # Get flavor
    try:
        with open("flavors.json") as file:
            flavors_json = json.load(file)
    except FileNotFoundError:
        return jsonify({"success": False, "message": "Flavors data file not found"}), 404
    except json.JSONDecodeError:
        return jsonify({"success": False, "message": "Flavors data file is invalid"}), 500
    
    flavor_data = get_flavor_from_id(flavors_json, flavor_id)
    if flavor_data is None:
        return jsonify({"success": False, "message": "Flavor id is invalid"}), 400

    # Confirm quantity
    if quantity < 1:
        return jsonify({"success": False, "message": "Quantity must be greater than 0"}), 400

    # Update cart quantity
    cart_flavor = get_flavor_from_id(user_data["cart"], flavor_id)
    if cart_flavor is None: 
        return jsonify({"success": False, "message": "Flavor not in cart."}), 400
    else:
        cart_flavor["quantity"] = quantity

    return jsonify({"success": True, "message": "Cart update successfully.", "cart": user_data["cart"]}), 200

@app.route("/cart", methods=["DELETE"])
def remove_from_cart():
    data = request.json
    if data is None:
        return jsonify({"success": False, "message": "Invalid JSON"}), 400

    # Get attributes from request
    try: 
        user_id = data["userId"]
        flavor_id = data["flavorId"]
    except KeyError:
        return jsonify({"success": False, "message": "Missing JSON field(s)"}), 400 

    # Get user
    try:
        user_data = users[user_id]
    except KeyError:
        return jsonify({"success": False, "message": "User not found"}), 404

    # Get flavor
    try:
        with open("flavors.json") as file:
            flavors_json = json.load(file)
    except FileNotFoundError:
        return jsonify({"success": False, "message": "Flavors data file not found"}), 404
    except json.JSONDecodeError:
        return jsonify({"success": False, "message": "Flavors data file is invalid"}), 500
    
    flavor_data = get_flavor_from_id(flavors_json, flavor_id)
    if flavor_data is None:
        return jsonify({"success": False, "message": "Flavor id is invalid"}), 400

    # Remove flavor from cart
    cart_flavor = get_flavor_from_id(user_data["cart"], flavor_id)
    if cart_flavor is not None:
        user_data["cart"].remove(cart_flavor)

    return jsonify({"success": True, "message": "Flavor removed from cart.", "cart": user_data["cart"]}), 200

@app.route("/orders", methods=["GET"])
def get_order_history():
    user_id = request.args.get("userId", type=int)
    if user_id is None:
        return jsonify({"success": False, "message": "User id missing or incorrect"}), 400

    try:
        orders = users[user_id]["orders"]
    except KeyError:
        return jsonify({"success": False, "message": "User data not found"}), 404
    
    return jsonify({"success": True, "message": "Order history loaded.", "orders": orders}), 200

@app.route("/orders", methods=["POST"])
def place_order():
    data = request.json
    if data is None:
        return jsonify({"success": False, "message": "Invalid JSON"}), 400

    try:
        user_id = data["userId"]
    except KeyError:
        return jsonify({"success": False, "message": "Missing JSON field(s)"}), 400

    try:
        user_data = users[user_id]
    except KeyError:
        return jsonify({"success": False, "message": "User not found"}), 404

    if len(user_data["cart"]) == 0:
        return jsonify({"success": False, "message": "Cart is empty."}), 400

    total = sum(item["price"] * item["quantity"] for item in user_data["cart"])
    order_id = len(user_data["orders"]) + 1
    order = {
        "orderId": order_id,
        "items": user_data["cart"].copy(),
        "total": round(total, 2),
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    user_data["orders"].append(order)
    user_data["cart"] = []

    return jsonify({"success": True, "message": "Order placed successfully.", "orderId": order_id}), 200

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    if data is None:
        return jsonify({"success": False, "message": "Invalid JSON"}), 400

    try:
        username = data["username"]
        password = data["password"]
    except KeyError:
        return jsonify({"success": False, "message": "Missing JSON field(s)"}), 400

    user = None
    for u in users.values():
        if u["username"] == username:
            user = u
            break

    if user is None:
        return jsonify({"success": False, "message": "Invalid username or password."}), 401

    if not bcrypt.checkpw(password.encode("utf-8"), user["password_hash"]):
        return jsonify({"success": False, "message": "Invalid username or password."}), 401

    return jsonify({
        "success": True,
        "message": "Login successful.",
        "userId": user["id"],
        "username": user["username"]
    }), 200

@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    if data is None:
        return jsonify({"success": False, "message": "Invalid JSON"}), 400

    try:
        username = data["username"]
        email = data["email"]
        password = data["password"]
    except KeyError:
        return jsonify({"success": False, "message": "Missing JSON field(s)"}), 400

    # Validate username
    if len(username) < 3 or len(username) > 20:
        return jsonify({"success": False, "message": "Username must be between 3 and 20 characters."}), 400
    if not username[0].isalpha():
        return jsonify({"success": False, "message": "Username must start with a letter."}), 400
    if not all(c.isalnum() or c in "_-" for c in username):
        return jsonify({"success": False, "message": "Username may only contain letters, numbers, underscores, and hyphens."}), 400

    # Validate email
    if "@" not in email or "." not in email.split("@")[-1]:
        return jsonify({"success": False, "message": "Invalid email format."}), 400

    # Validate password
    if len(password) < 8:
        return jsonify({"success": False, "message": "Password must be at least 8 characters."}), 400
    if not any(c.isupper() for c in password):
        return jsonify({"success": False, "message": "Password must contain at least one uppercase letter."}), 400
    if not any(c.islower() for c in password):
        return jsonify({"success": False, "message": "Password must contain at least one lowercase letter."}), 400
    if not any(c.isdigit() for c in password):
        return jsonify({"success": False, "message": "Password must contain at least one number."}), 400
    if not any(c in "!@#$%^&*()_+-=[]{}|;':\",./<>?" for c in password):
        return jsonify({"success": False, "message": "Password must contain at least one special character."}), 400

    # Check for duplicate username or email
    for u in users.values():
        if u["username"] == username:
            return jsonify({"success": False, "message": "Username is already taken."}), 400
        if u["email"] == email:
            return jsonify({"success": False, "message": "Email is already registered."}), 400

    # Hash password and create user
    password_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    new_id = len(users) + 1
    users[new_id] = {
        "id": new_id,
        "username": username,
        "email": email,
        "password_hash": password_hash,
        "cart": [],
        "orders": []
    }

    return jsonify({"success": True, "message": "Registration successful."}), 201


"""
Helpers
"""
def get_flavor_from_id(json, id):
    for flavor in json:
        if flavor.get("id") == id or flavor.get("flavorId") == id:
            return flavor
        
    return None


"""
Startup
"""

if __name__ == "__main__":
    app.run(debug=True, port=5050)