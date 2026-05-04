# Setup instructions
### 1. Clone the Repository
##### git clone <repository-url>
##### cd "Express Tradecom Assignment"

## Backend Setup
### 2. Create and Activate Virtual Environment
##### python -m venv venv
##### venv\Scripts\activate

### Install Backend Dependencies
##### 3. pip install -r requirements.txt

### Create MySQL Database(Open MySQL Workbench and run)
##### 4. CREATE DATABASE express_tradecom_assignment_db;

### Configure Backend Environment Variables(Create a .env file in the project root)
##### 5. DB_USER=root
#####    DB_PASSWORD=your_mysql_password
#####    DB_HOST=localhost
#####    DB_NAME=express_tradecom_assignment_db

### 6. Create Database Tables(run python in terminal)
##### from app import create_app, db
##### app = create_app()
##### with app.app_context():
#####     db.create_all()
##### exit()

## Run Backend Server
##### 7. python run.py


## Frontend Setup
### 8. Open a new terminal and run(in frontend folder)
##### npm install

### Configure Frontend Environment Variables(.env)
##### 9. VITE_API_BASE_URL=http://127.0.0.1:5000 

### Run Frontend Server
##### npm run dev

### -----------------------X----------------------------

#### ## API Endpoints with Request/Response Examples
### Base URL: http://127.0.0.1:5000

#### Create User

```http
POST /users

Request Body:

{
  "name": "Anurag Yadav",
  "email": "anurag@example.com",
  "role": "Developer"
}

Success Response:

{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 1,
    "name": "Anurag Yadav",
    "email": "anurag@example.com",
    "role": "Developer"
  }
}
Get All Users
GET /users

Success Response:

{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "name": "Anurag Yadav",
        "email": "anurag@example.com",
        "role": "Developer"
      }
    ]
  }
}
Get User by ID
GET /users/1

Success Response:

{
  "success": true,
  "data": {
    "id": 1,
    "name": "Anurag Yadav",
    "email": "anurag@example.com",
    "role": "Developer"
  }
}

Error Response:

{
  "success": false,
  "error": "User not found"
}
Search Users
GET /users?search=anu

Description: Search users by name or email

Success Response:

{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "name": "Anurag Yadav",
        "email": "anurag@example.com",
        "role": "Developer"
      }
    ]
  }
}
Get Paginated Users
GET /users?page=1&limit=10

Success Response:

{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "name": "Anurag Yadav",
        "email": "anurag@example.com",
        "role": "Developer"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "pages": 1
    }
  }
}
Delete User
DELETE /users/1

Success Response:

{
  "success": true,
  "message": "User deleted successfully"
}

Error Response:

{
  "success": false,
  "error": "User not found"
}
Validation & Error Handling
Missing Email

Request:

{
  "name": "Anurag Yadav",
  "role": "Developer"
}

Response:

{
  "success": false,
  "error": "Email is required"
}
Invalid Email Format

Request:

{
  "name": "Anurag Yadav",
  "email": "invalid-email",
  "role": "Developer"
}

Response:

{
  "success": false,
  "error": "Invalid email format"
}
Duplicate Email

Request:

{
  "name": "Anurag Yadav",
  "email": "anurag@example.com",
  "role": "Developer"
}

Response:

{
  "success": false,
  "error": "Email already exists"
}
Invalid JSON Body

Response:

{
  "success": false,
  "error": "Request body must be valid JSON"
}

--------------------------------------------------

## Database schema
### Database Name
```sql
express_tradecom_assignment_db

## Table: users
| Column | Data Type    | Constraints                 |
| :----- | :----------- | :-------------------------- |
| id     | Integer      | Primary Key, Auto Increment |
| name   | VARCHAR(100) | Not Null                    |
| email  | VARCHAR(120) | Unique, Not Null            |
| role   | VARCHAR(80)  | Not Null                    |

## SQL Schema
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  role VARCHAR(80) NOT NULL
);

## Assumptions made: 
The application is API-first and all responses are returned in JSON format.
MySQL is used as the primary database.
Email must be unique for every user.
Name, email, and role are required fields.
Search works on name and email.
Pagination works using page and limit query parameters.
JWT authentication and Docker are considered optional bonus enhancements.
AI Usage Declaration:

AI tools such as ChatGPT were used as a supportive resource during development.

Usage Scope:
Used for understanding best practices in Flask REST API structure
Assisted in clarifying validation, error handling, and API design concepts
Helped in improving code readability and documentation structure
Manual Contributions:
Backend architecture, API flow, MySQL integration, testing, and debugging were performed manually
JSON responses, validation handling, and error cases were reviewed and customized
Frontend-backend integration and API testing were done manually

Conclusion:
AI was used as a productivity and learning aid, while the final implementation, testing, debugging, and project decisions were handled independently.













### AI Usage Declaration

AI tools such as ChatGPT were used as a supportive resource during the development of this project.

**Usage Scope:**

* Used for understanding best practices in structuring a Flask-based API project
* Assisted in clarifying concepts related to validation, error handling, and REST API design
* Helped in drafting initial code patterns and improving code readability

**Manual Contributions:**

* Core implementation, debugging, and integration of backend APIs were performed manually
* All business logic, API flow, and database interactions were reviewed, tested, and refined independently
* Frontend-backend integration and API testing were carried out manually
* Edge cases, validation handling, and error responses were customized and improved beyond initial suggestions

**Conclusion:**
AI was used as a productivity and learning aid, while the final implementation, problem-solving, and project decisions were independently handled.
