# Assignment Submission Portal

A backend system for an assignment submission portal, allowing users to upload assignments and admins to manage them.

## Features

- User and Admin registration and login
- Assignment upload for users
- Assignment management for admins (view, accept, reject)
- MongoDB integration
- JWT authentication
- Input validation using Joi
- Error handling middleware

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- Bcrypt
- Joi

## Project Structure

```
assignment-portal/
├── src/config/         # Database configuration
├── src/controllers/    # Request handlers for routes
├── src/middleware/     # Custom middleware functions
├── src/models/         # Mongoose models for MongoDB
├── src/routes/         # Express route definitions
├── src/validators/     # Input validation schemas
├── .env            # Environment variables
├── src/app.js          # Express app setup
├── package.json    # Project dependencies and scripts
├── README.md       # Project documentation
└── server.js       # Entry point of the application
```

## Prerequisites

- Node.js (v14 or later)
- MongoDB

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/Farid4hmed/assignment-portal.git
   cd assignment-portal
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=3000
   HOST=localhost
   ```

4. Start the server:
   ```
   npm start
   ```

## API Endpoints

### User Endpoints
- `POST /register` - Register a new user
- `POST /login` - User login
- `POST /upload` - Upload an assignment (requires authentication)
- `GET /admins` - Fetch all admins (requires authentication)

### Admin Endpoints
- `POST /admin/register` - Register a new admin
- `POST /admin/login` - Admin login
- `GET /admin/assignments` - View assignments (requires authentication)
- `POST /admin/assignments/:id/accept` - Accept an assignment (requires authentication)
- `POST /admin/assignments/:id/reject` - Reject an assignment (requires authentication)

## Testing

To run the tests:

```
npm test
```

This command will execute the test suite using Mocha. The tests are located in the `test/` directory and cover various aspects of the application, including API endpoints, database operations, and authentication.

## API Testing with Postman

A Postman collection is included for easy API testing.

1. Import `Assignment Portal.postman_collection.json` into Postman.
2. Use the login request to obtain a JWT token.
3. For authenticated requests, use Bearer Token authentication with the obtained JWT.

The collection includes folders for user and admin endpoints.

## Usage

1. Register as a user or admin
2. Log in to receive a JWT token
3. Use the token in the Authorization header for subsequent requests:
   ```
   Authorization: Bearer your_jwt_token
   ```

## Development

Run the server in development mode with auto-reload:

```
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
