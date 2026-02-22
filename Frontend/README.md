# Product Analytics Dashboard - Frontend

A modern React-based frontend application for visualizing product analytics data. Features interactive charts, filtering capabilities, and secure authentication.

## Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Features](#features)
- [API Integration](#api-integration)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)

---

## Project Overview

This is the frontend component of the Product Analytics Dashboard. It provides:
- User authentication (login interface)
- Interactive dashboard with data visualizations
- Filter panels for analyzing metrics
- Feature click tracking visualization
- Responsive design with modern UI

The frontend communicates with a Node.js/Express backend API to fetch and display analytics data.

---

## Tech Stack

- **Framework:** React 18.3.1
- **Build Tool:** Vite 5.4.14
- **Routing:** React Router DOM 6.30.1
- **HTTP Client:** Axios 1.8.4
- **Charts:** Recharts 2.15.1
- **Cookies:** JS Cookie 3.0.5
- **Styling:** Custom CSS

---

## Prerequisites

Before running this project, ensure you have:

1. **Node.js** (version 18.0.0 or higher)
2. **npm** or **yarn** package manager
3. **Backend server** running (see [Backend README](../backend/README.md))

---

## Installation

1. Navigate to the frontend directory:
   
```bash
   cd Frontend
   
```

2. Install dependencies:
   
```
bash
   npm install
   
```

3. Create environment configuration (see below)

4. Start the development server:
   
```
bash
   npm run dev
   
```

The application will be available at `http://localhost:5173` (default Vite port).

---

## Environment Variables

Create a `.env` file in the `Frontend` directory with the following variable:

```
env
VITE_API_BASE_URL=http://localhost:5000
```

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000` |

---

## Project Structure

```
Frontend/
├── index.html                 # Main HTML entry point
├── package.json               # Dependencies and scripts
├── vite.config.js            # Vite configuration
├── src/
│   ├── main.jsx              # React application entry
│   ├── App.jsx               # Root component with routing
│   ├── styles.css            # Global styles
│   ├── components/           # Reusable UI components
│   │   ├── ClickTrendLineChart.jsx   # Line chart for trends
│   │   ├── FeatureBarChart.jsx       # Bar chart for features
│   │   ├── FilterPanel.jsx           # Filter controls
│   │   └── ProtectedRoute.jsx        # Auth protection wrapper
│   ├── pages/                # Page components
│   │   ├── LoginPage.jsx     # Login interface
│   │   └── DashboardPage.jsx # Main dashboard
│   ├── hooks/                # Custom React hooks
│   │   ├── useFilters.js     # Filter state management
│   │   └── useTracking.js    # Event tracking utilities
│   ├── services/             # API and external services
│   │   ├── apiClient.js      # Axios instance configuration
│   │   ├── apiService.js     # API endpoint functions
│   │   └── tokenService.js   # JWT token management
│   └── utils/                # Utility functions
│       ├── cookies.js        # Cookie manipulation
│       └── date.js           # Date formatting utilities
```

---

## Features

### Authentication
- Login page with username/password
- JWT token-based authentication
- Secure token storage in cookies
- Protected routes for authenticated users

### Dashboard
- **Click Trend Line Chart:** Visualizes feature clicks over time
- **Feature Bar Chart:** Shows distribution of clicks across features
- **Filter Panel:** Filter data by:
  - Date range (start/end date)
  - User age
  - User gender
  - Feature name

### Data Visualization
- Interactive charts powered by Recharts
- Responsive chart sizing
- Tooltips on hover
- Legend support

---

## API Integration

The frontend integrates with the backend API for the following operations:

### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Authenticate user |

### Analytics Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/track` | Track feature click (requires auth) |
| GET | `/analytics` | Fetch analytics data (requires auth) |

### Analytics Query Parameters
```
GET /analytics?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&age=number&gender=Male|Female|Other&featureName=string
```

---

## Available Scripts

In the `Frontend` directory, you can run:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

### Development
```
bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Deployment

### Build for Production
```
bash
npm run build
```

This creates an optimized build in the `dist` folder.

### Deploying to Static Hosting

The frontend can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

#### Example: Deploying to Vercel
```
bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Example: Deploying to Netlify
```
bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### Environment Configuration for Production

When deploying, set the `VITE_API_BASE_URL` to your production backend URL:
```
env
VITE_API_BASE_URL=https://your-backend-api.onrender.com
```

---

## Connecting Frontend to Backend

1. **Start the Backend:**
   
```
bash
   cd backend
   npm run dev
   
```

2. **Start the Frontend:**
   
```
bash
   cd Frontend
   npm run dev
   
```

3. **Access the Application:**
   - Open `http://localhost:5173` in your browser
   - Register a new user or login with existing credentials
   - View the dashboard with analytics data

---

## License

MIT License

---

## Support

For issues or questions, please refer to the main project repository.
