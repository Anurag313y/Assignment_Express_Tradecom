
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.services.user_service import create_user, get_users, get_user_by_id, delete_user, get_user_by_email
from app.utils.validators import validate_user_data

user_bp = Blueprint("user_bp", __name__)

# User registration


@user_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True)

    validation_error = validate_user_data(data)
    if validation_error:
        return jsonify({"success": False, "error": validation_error}), 400

    user, error = create_user(data)
    if error:
        return jsonify({"success": False, "error": error}), 409

    # Create JWT token so the user is logged in immediately after registration
    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "success": True,
        "message": "User registered successfully",
        "access_token": access_token,
        "user": user.to_dict(),
        "data": user.to_dict()
    }), 201


# User login
@user_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True)
    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"success": False, "error": "Email and password required"}), 400

    user = get_user_by_email(data["email"])
    if not user or not user.check_password(data["password"]):
        return jsonify({"success": False, "error": "Invalid credentials"}), 401

    # identity must be a string for Flask-JWT-Extended v4+
    access_token = create_access_token(identity=str(user.id))
    return jsonify({"success": True, "access_token": access_token, "user": user.to_dict()}), 200


@user_bp.route("/users", methods=["GET"])
@jwt_required()
def fetch_users():
    search = request.args.get("search")
    page = request.args.get("page", type=int)
    limit = request.args.get("limit", type=int)

    result = get_users(search=search, page=page, limit=limit)

    return jsonify({"success": True, "data": result}), 200


@user_bp.route("/users/<int:user_id>", methods=["GET"])
@jwt_required()
def fetch_user_by_id(user_id):
    user = get_user_by_id(user_id)
    if not user:
        return jsonify({"success": False, "error": "User not found"}), 404
    return jsonify({"success": True, "data": user.to_dict()}), 200


@user_bp.route("/users/<int:user_id>", methods=["DELETE"])
@jwt_required()
def remove_user(user_id):
    success, error = delete_user(user_id)
    if error:
        return jsonify({"success": False, "error": error}), 404
    return jsonify({"success": True, "message": "User deleted successfully"}), 200


# Example protected route to get current user info
@user_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = get_user_by_id(int(user_id))
    if not user:
        return jsonify({"success": False, "error": "User not found"}), 404
    return jsonify({"success": True, "data": user.to_dict()}), 200