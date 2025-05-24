from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from backend.db_config import db
from backend.models import User

auth_bp = Blueprint('auth', __name__)

# Register Route
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    # Validate required fields
    if not data or not all(k in data for k in ('username', 'email', 'password')):
        return jsonify({"error": "Missing required fields"}), 400

    # Check if email is already registered
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already registered"}), 400

    # Hash the password
    hashed_password = generate_password_hash(data['password'])

    # Create new user
    user = User(username=data['username'], email=data['email'], password=hashed_password)

    # Save to database
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201


# Login Route
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    # Validate required fields
    if not data or not all(k in data for k in ('email', 'password')):
        return jsonify({"error": "Missing email or password"}), 400

    # Look up user by email
    user = User.query.filter_by(email=data['email']).first()

    # Check password
    if user and check_password_hash(user.password, data['password']):
        return jsonify({
            "message": "Login successful",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            }
        }), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401
