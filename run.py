from app import create_app, db
from app.models.user import User
import time
from sqlalchemy.exc import OperationalError, IntegrityError

app = create_app()

def init_db():
    retries = 10
    while retries > 0:
        try:
            with app.app_context():
                db.create_all()
                
                # Create default admin user if it doesn't exist
                admin_email = "admin@gmail.com"
                if not User.query.filter_by(email=admin_email).first():
                    admin = User(name="Admin", email=admin_email, role="Admin")
                    admin.set_password("admin@123")
                    db.session.add(admin)
                    try:
                        db.session.commit()
                        print("Default admin user created.")
                    except IntegrityError:
                        # Multiple workers (or parallel startups) can race here.
                        db.session.rollback()
                return
        except OperationalError:
            retries -= 1
            print(f"Waiting for database connection... ({retries} retries left)")
            time.sleep(5)
    print("Could not connect to database. Exiting.")
    exit(1)

init_db()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)