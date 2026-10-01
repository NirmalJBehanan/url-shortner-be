# URL Shortener – Full Stack Application

A full-stack URL Shortener application built using **React, Node.js, Express.js, and MongoDB**.

The application allows users to create short URLs from long URLs, manage their shortened URLs, and securely manage their accounts.

## Features

### User Authentication

* User registration
* Email activation
* User login
* JWT-based authentication
* Protected routes
* User profile
* Logout

### Password Management

* Forgot password
* Password reset through email
* Reset token with expiration
* Password hashing using bcrypt

### URL Shortener

* Enter a long URL and generate a short URL
* Short URL generated using Nano ID
* Redirect from short URL to original URL
* Copy short URL
* Store URLs in MongoDB
* Each user can view their own URL history

## Technologies Used

### Frontend

* React.js
* React Router
* Axios
* Formik
* Yup
* JavaScript
* HTML
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Nano ID
* Brevo

## Project Structure

```text
URL-Shortener/
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── UrlHistory.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
└── Backend/
    ├── controllers/
    ├── models/
    ├── routes/
    ├── middleware/
    ├── utils/
    ├── .env
    ├── server.js
    └── package.json
```

## How It Works

### 1. Registration

The user enters their username, email, and password.

The backend:

1. Checks whether the email already exists.
2. Hashes the password using bcrypt.
3. Creates the user.
4. Sends an activation email.
5. The user activates the account through the email link.

### 2. Login

The user enters their email and password.

The backend verifies the credentials and creates a JWT token.

The frontend stores the token in `localStorage`.

```text
Login
  ↓
Backend verifies user
  ↓
JWT generated
  ↓
Token stored in localStorage
  ↓
User logged in
```

### 3. Forgot Password

The user selects **Forgot Password** and enters their email.

The backend:

1. Finds the user.
2. Creates a JWT reset token.
3. Gives the token an expiration time.
4. Sends a password reset link through Brevo.

The user receives a link similar to:

```text
http://localhost:5173/reset-password/<token>
```

The React application reads the token from the URL and sends it to the backend when the new password is submitted.

### 4. URL Shortening

After logging in, the user enters a long URL.

The frontend sends:

```json
{
  "url": "https://example.com/very-long-url"
}
```

The backend generates a short code using Nano ID.

For example:

```text
aB72xK9p
```

The URL information is stored in MongoDB.

```text
Original URL
      +
Short Code
      +
User ID
```

The application then generates a short URL.

### 5. URL Redirection

When someone opens the short URL:

```text
/api/short/aB72xK9p
```

the backend finds the corresponding URL in MongoDB and redirects the user to the original URL.

### 6. URL History

Logged-in users can view the URLs they have created.

The backend uses the authenticated user's ID to return only that user's URLs.

```text
User A → User A's URLs

User B → User B's URLs
```

This prevents users from seeing another user's URL history.

## Authentication Flow

JWT is used for authentication.

The token contains the user's ID.

Example payload:

```json
{
  "_id": "user_id"
}
```

For protected requests, the frontend sends:

```text
Authorization: Bearer <token>
```

The backend verifies the token and identifies the logged-in user.

## Password Reset Flow

```text
Login
   ↓
Forgot Password
   ↓
Enter Email
   ↓
Backend Creates Reset Token
   ↓
Email Sent
   ↓
User Clicks Reset Link
   ↓
Reset Password Page
   ↓
Enter New Password
   ↓
Backend Verifies Reset Token
   ↓
Password Hashed Using bcrypt
   ↓
Password Updated
```

## API Endpoints

### Authentication

| Method | Endpoint            | Description                  |
| ------ | ------------------- | ---------------------------- |
| POST   | `/api/register`     | Register a new user          |
| POST   | `/api/login`        | Login user                   |
| GET    | `/api/verifytokens` | Verify JWT token             |
| GET    | `/api/profile`      | Get logged-in user's profile |

### Password

| Method | Endpoint                    | Description                       |
| ------ | --------------------------- | --------------------------------- |
| POST   | `/api/forgetPassword`       | Send password reset email         |
| PUT    | `/api/resetPassword/:token` | Change password using reset token |

### URL

| Method | Endpoint                | Description                      |
| ------ | ----------------------- | -------------------------------- |
| POST   | `/api/url`              | Create a short URL               |
| GET    | `/api/history`          | Get logged-in user's URL history |
| GET    | `/api/short/:shortCode` | Redirect to original URL         |

## Environment Variables

Create a `.env` file inside the backend:

```env
PORT=3000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

BREVO_API_KEY=your_brevo_api_key

brevo_sender_name=your_sender_name

brevo_sender_email=your_sender_email
```

Do not upload `.env` to GitHub.

Add this to `.gitignore`:

```text
node_modules/
.env
```

## Installation

### Clone the repository

```bash
git clone <your-github-repository-url>
```

### Backend

```bash
cd Backend
npm install
npm run dev
```

### Frontend

Open another terminal:

```bash
cd Frontend
npm install
npm run dev
```

## Required Packages

### Frontend

```bash
npm install axios formik yup react-router-dom
```

### Backend

```bash
npm install express mongoose bcrypt jsonwebtoken nanoid
```

Brevo is also used for sending transactional emails.

## Security

* Passwords are hashed using bcrypt.
* JWT is used for authentication.
* Protected API routes verify the user's token.
* Password reset tokens have an expiration time.
* `.env` contains sensitive credentials and is excluded from Git.
* Users can access only their own URL history.

## Future Improvements

* Custom short URLs
* URL expiration
* Click/visit statistics
* QR code generation
* Better error notifications
* Production deployment
* Custom domain for shortened URLs

## Author

**Nirmal J Behanan**

Built as a full-stack learning project using React, Node.js, Express.js, and MongoDB.
