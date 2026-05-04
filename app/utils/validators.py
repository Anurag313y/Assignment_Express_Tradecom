from email_validator import validate_email, EmailNotValidError


def validate_user_data(data):
    if data is None:
        return "Request body must be valid JSON"

    name = data.get("name")
    email = data.get("email")
    role = data.get("role")
    password = data.get("password")

    if not name:
        return "Name is required"

    if not email:
        return "Email is required"

    if not role:
        return "Role is required"

    if not password or len(password) < 6:
        return "Password is required and must be at least 6 characters"

    try:
        validate_email(email)
    except EmailNotValidError:
        return "Invalid email format"

    return None