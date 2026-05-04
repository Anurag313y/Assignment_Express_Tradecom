from app import db
from app.models.user import User


def create_user(data):
    existing_user = User.query.filter_by(email=data["email"]).first()

    if existing_user:
        return None, "Email already exists"

    user = User(
        name=data["name"],
        email=data["email"],
        role=data["role"],
        avatar_url=data.get("avatar_url")
    )
    user.set_password(data["password"])

    db.session.add(user)
    db.session.commit()

    return user, None


def get_user_by_email(email):
    return User.query.filter_by(email=email).first()


def get_users(search=None, page=None, limit=None):
    query = User.query

    if search:
        search_value = f"%{search}%"
        query = query.filter(
            (User.name.like(search_value)) |
            (User.email.like(search_value))
        )

    if page and limit:
        pagination = query.paginate(
            page=page,
            per_page=limit,
            error_out=False
        )

        return {
            "users": [user.to_dict() for user in pagination.items],
            "pagination": {
                "page": page,
                "limit": limit,
                "total": pagination.total,
                "pages": pagination.pages,
            }
        }

    users = query.all()

    return {
        "users": [user.to_dict() for user in users]
    }


def get_user_by_id(user_id):
    return User.query.get(user_id)

def delete_user(user_id):
    user = User.query.get(user_id)

    if not user:
        return None, "User not found"

    db.session.delete(user)
    db.session.commit()

    return True, None