# Product Analytics Dashboard - Backend

A production-ready Express.js + PostgreSQL backend for product analytics with JWT authentication, MVC architecture, and scalable service separation.

## Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Analytics Filters](#analytics-filters)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)

---

## Project Overview

This backend application provides a RESTful API for:
- **User Authentication:** Register and login with JWT tokens
- **Event Tracking:** Track feature clicks from users
- **Analytics:** Retrieve filtered analytics data

The API follows MVC architecture with separate layers for routes, controllers, services, and models.

---

## Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js 4.19.2
- **Database:** PostgreSQL with `pg` driver
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **Security:** Helmet, CORS, Rate Limiting
- **Logging:** Morgan
- **Environment:** dotenv

---

## Prerequisites

Before running this project, ensure you have:

1. **Node.js** (version 18.0.0 or higher)
2. **PostgreSQL** database (local or cloud-hosted)
3. **npm** package manager

---

## Installation

1. Navigate to the backend directory:
   
```
bash
   cd backend
   
```

2. Install dependencies:
   
```
bash
   npm install
   
```

3. Set up environment variables (see below)

4. Create the database schema:
   
```
bash
   # Run the schema.sql file in your PostgreSQL database
   # psql -U your_user -d your_database -f db/schema.sql
   
```

5. (Optional) Seed sample data:
   
```
bash
   npm run seed
   
```

6. Start the server:
   
```
bash
   npm run dev
   
```

The API will be available at `http://localhost:5000`.

---

## Environment Variables

Create a `.env` file in the `backend` directory:

```
env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/analytics_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
```

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | No (default: 5000) |
| `NODE_ENV` | Environment (development/production) | No |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `JWT_EXPIRES_IN` | JWT token expiration time | No (default: 7d) |

---

## Database Schema

### Users Table
```
sql
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age > 0 AND age <= 120),
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Feature Clicks Table
```
sql
CREATE TABLE IF NOT EXISTS feature_clicks (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  feature_name VARCHAR(100) NOT NULL,
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Indexes
```
sql
CREATE INDEX IF NOT EXISTS idx_feature_clicks_user_id ON feature_clicks(user_id);
CREATE INDEX IF NOT EXISTS idx_feature_clicks_feature_name ON feature_clicks(feature_name);
CREATE INDEX IF NOT EXISTS idx_feature_clicks_clicked_at ON feature_clicks(clicked_at);
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register a new user | No |
| POST | `/login` | Login and get JWT token | No |

### Tracking
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/track` | Track a feature click | Yes (JWT) |

### Analytics
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/analytics` | Get filtered analytics data | Yes (JWT) |

---

## API Request/Response Examples

### Register User
```
POST /register
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securepassword123",
  "age": 25,
  "gender": "Male"
}

Response (201):
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "johndoe",
    "age": 25,
    "gender": "Male"
  }
}
```

### Login
```
POST /login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securepassword123"
}

Response (200):
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Track Feature Click
```
POST /track
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "featureName": "Dashboard"
}

Response (201):
{
  "message": "Feature click tracked successfully"
}
```

### Get Analytics
```
GET /analytics?startDate=2026-02-01&endDate=2026-02-21&age=25&gender=Male&featureName=Dashboard
Authorization: Bearer <JWT_TOKEN>

Response (200):
{
  "totalClicks": 150,
  "clicksByFeature": [
    { "feature_name": "Dashboard", "click_count": 80 },
    { "feature_name": "Reports", "click_count": 45 },
    { "feature_name": "Settings", "click_count": 25 }
  ],
  "clicksByDate": [
    { "date": "2026-02-01", "click_count": 20 },
    { "date": "2026-02-02", "click_count": 25 }
  ]
}
```

---

## Analytics Filters

The `/analytics` endpoint supports the following query parameters for filtering data:

| Parameter | Type | Description |
|-----------|------|-------------|
| `startDate` | string | Filter clicks from this date (YYYY-MM-DD) |
| `endDate` | string | Filter clicks until this date (YYYY-MM-DD) |
| `age` | number | Filter by user age |
| `gender` | string | Filter by user gender (Male, Female, Other) |
| `featureName` | string | Filter by feature name |

### Example Queries
```
# All analytics
GET /analytics

# Date range
GET /analytics?startDate=2026-02-01&endDate=2026-02-21

# By age
GET /analytics?age=25

# By gender
GET /analytics?gender=Male

# By feature
GET /analytics?featureName=Dashboard

# Combined filters
GET /analytics?startDate=2026-02-01&endDate=2026-02-21&age=25&gender=Male&featureName=Dashboard
```

---

## Project Structure

```
backend/
├── .env                    # Environment variables
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies and scripts
├── render.yaml             # Render deployment config
├── db/
│   ├── schema.sql          # Database schema
│   └── seed.js             # Seed data script
└── src/
    ├── app.js              # Express app configuration
    ├── server.js           # Server entry point
    ├── config/
    │   ├── db.js           # Database connection
    │   └── env.js          # Environment config
    ├── controllers/        # Request handlers
    │   ├── analyticsController.js
    │   ├── authController.js
    │   └── trackController.js
    ├── middlewares/        # Express middlewares
    │   ├── authMiddleware.js
    │   └── errorMiddleware.js
    ├── models/             # Data models
    │   ├── featureClickModel.js
    │   └── userModel.js
    ├── routes/             # API routes
    │   ├── index.js
    │   ├── analyticsRoutes.js
    │   ├── authRoutes.js
    │   └── trackRoutes.js
    ├── services/           # Business logic
    │   ├── analyticsService.js
    │   ├── authService.js
    │   └── trackService.js
    └── utils/              # Utility functions
        ├── ApiError.js
        └── asyncHandler.js
```

---

## Available Scripts

In the `backend` directory, you can run:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with auto-reload |
| `npm run start` | Start production server |
| `npm run seed` | Seed database with sample data |

---

## Deployment

### Deploying to Render

This project includes `render.yaml` for easy deployment to Render:

1. **Create a Render Account:** Go to [render.com](https://render.com) and sign up

2. **Create a PostgreSQL Database:**
   - From the Render dashboard, create a new PostgreSQL database
   - Note the internal database URL

3. **Deploy the Backend:**
   - Connect your GitHub repository to Render
   - Create a new Web Service
   - Set the following environment variables:
     - `DATABASE_URL`: Your PostgreSQL connection string
     - `JWT_SECRET`: A secure random string
     - `NODE_ENV`: production

4. **Run Migrations:**
   - Use Render's SSH to connect to your service
   - Run the database schema manually or set up a migration process

### Manual Deployment

```
bash
# Build the application
npm run build  # If you have a build step

# Start production server
npm start
```

### Environment for Production

```
env
PORT=5000
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-production-secret
JWT_EXPIRES_IN=7d
```

---

## Security Features

- **Password Hashing:** All passwords are hashed using bcrypt
- **JWT Authentication:** Stateless token-based auth
- **Rate Limiting:** Protection against brute-force attacks
- **Helmet:** Security headers
- **CORS:** Cross-origin resource sharing configuration
- **SQL Injection Protection:** Parameterized queries with pg

---

## License

MIT License

---

## Support

For issues or questions, please refer to the main project repository.
