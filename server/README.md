# SaaS Lead Management Backend

Enterprise-grade backend for SaaS Lead Management Admin Dashboard built with Node.js, Express.js, MongoDB, and Mongoose.

## Features

- **Modular Architecture**: Clean separation of concerns with controller-service-route pattern
- **API Versioning**: RESTful APIs with version support (`/api/v1/`)
- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Validation**: Joi-based request validation
- **Error Handling**: Centralized error handling with standardized responses
- **Pagination & Filtering**: Built-in pagination, search, and filtering support
- **Security**: Helmet, CORS, rate limiting, and secure password hashing
- **Logging**: Request logging with Morgan
- **Analytics**: Comprehensive analytics endpoints for dashboard

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Joi** - Data validation
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Morgan** - HTTP request logger
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

## Project Structure

```
server/
│
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.js  # MongoDB connection
│   │   └── index.js
│   │
│   ├── controllers/     # Request handlers
│   │   ├── leadController.js
│   │   ├── employeeController.js
│   │   ├── authController.js
│   │   ├── analyticsController.js
│   │   └── index.js
│   │
│   ├── middleware/      # Express middleware
│   │   ├── errorHandler.js
│   │   ├── requestLogger.js
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── index.js
│   │
│   ├── models/          # Mongoose models
│   │   ├── Lead.js
│   │   ├── Employee.js
│   │   ├── User.js
│   │   └── index.js
│   │
│   ├── routes/          # API routes
│   │   ├── leadRoutes.js
│   │   ├── employeeRoutes.js
│   │   ├── authRoutes.js
│   │   ├── analyticsRoutes.js
│   │   └── index.js
│   │
│   ├── services/        # Business logic layer
│   │   ├── leadService.js
│   │   ├── employeeService.js
│   │   ├── authService.js
│   │   ├── analyticsService.js
│   │   └── index.js
│   │
│   ├── utils/           # Utility functions
│   │   ├── asyncHandler.js
│   │   ├── AppError.js
│   │   ├── responseFormatter.js
│   │   └── index.js
│   │
│   ├── validations/     # Joi validation schemas
│   │   ├── leadValidation.js
│   │   ├── authValidation.js
│   │   ├── employeeValidation.js
│   │   └── index.js
│   │
│   ├── constants/       # Application constants
│   │   └── index.js
│   │
│   ├── app.js           # Express app configuration
│   └── server.js        # Server entry point
│
├── .env                 # Environment variables
├── .gitignore
├── nodemon.json
├── package.json
└── README.md
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
NODE_ENV=development
PORT=5000
API_VERSION=v1
MONGODB_URI=mongodb://localhost:27017/saas-lead-management
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

3. Start MongoDB server

4. Run the application:
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication (`/api/v1/auth`)

- `POST /register` - Register a new user
- `POST /login` - Login user
- `GET /me` - Get current user profile (Protected)
- `PATCH /update-profile` - Update user profile (Protected)
- `PATCH /update-password` - Update password (Protected)
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with token

### Leads (`/api/v1/leads`)

- `POST /` - Create a new lead (Protected, Admin/Manager)
- `GET /` - Get all leads with pagination (Protected)
- `GET /statistics/overview` - Get lead statistics (Protected)
- `PATCH /bulk/status` - Bulk update lead status (Protected, Admin/Manager)
- `GET /:id` - Get lead by ID (Protected)
- `PATCH /:id` - Update lead (Protected)
- `PATCH /:id/assign` - Assign lead to user (Protected, Admin/Manager)
- `DELETE /:id` - Delete lead (Protected, Admin)

### Employees (`/api/v1/employees`)

- `POST /` - Create a new employee (Protected, Admin/Manager)
- `GET /` - Get all employees with pagination (Protected)
- `GET /statistics/overview` - Get employee statistics (Protected)
- `GET /manager/:managerId` - Get employees by manager (Protected)
- `GET /:id` - Get employee by ID (Protected)
- `PATCH /:id` - Update employee (Protected)
- `PATCH /:id/status` - Update employee status (Protected, Admin/Manager)
- `DELETE /:id` - Delete employee (Protected, Admin)

### Analytics (`/api/v1/analytics`)

- `GET /dashboard` - Get dashboard overview (Protected)
- `GET /leads` - Get lead analytics over time (Protected)
- `GET /employee-performance` - Get employee performance (Protected, Admin/Manager)
- `GET /departments` - Get department analytics (Protected)
- `GET /priority` - Get priority analytics (Protected)
- `GET /report` - Get comprehensive report (Protected)

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": {},
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Success message",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## User Roles

- **Admin**: Full access to all resources
- **Manager**: Access to manage leads and employees
- **Employee**: Limited access to view and update assigned leads

## Lead Status

- `new` - New lead
- `contacted` - Contacted
- `qualified` - Qualified
- `proposal` - Proposal sent
- `negotiation` - In negotiation
- `won` - Lead won
- `lost` - Lead lost

## Lead Priority

- `low` - Low priority
- `medium` - Medium priority
- `high` - High priority
- `urgent` - Urgent priority

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS configuration
- Helmet security headers
- Input validation with Joi
- Role-based access control

## Development

The backend follows enterprise-level best practices:

- **Controller-Service-Route Pattern**: Clean separation of concerns
- **Async/Await**: Modern async handling with error catching
- **Middleware Architecture**: Reusable middleware for common tasks
- **Validation Layer**: Joi schemas for request validation
- **Error Handling**: Centralized error handling with custom error classes
- **API Versioning**: Support for multiple API versions
- **Pagination**: Built-in pagination support for list endpoints
- **Filtering & Search**: Advanced filtering and search capabilities

## License

ISC
