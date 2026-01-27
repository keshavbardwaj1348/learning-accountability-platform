# Learning Accountability Platform

A full-stack web application designed to help users track their learning progress through a structured **8-week learning plan** with daily tasks, analytics, streak tracking, and productivity features.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Features](#features)
- [Database Models](#database-models)
- [API Reference](#api-reference)
- [API Request/Response Examples](#api-requestresponse-examples)
- [Authentication Flow](#authentication-flow)
- [Business Logic](#business-logic)
- [Validation Rules](#validation-rules)
- [Error Handling](#error-handling)
- [Frontend Architecture](#frontend-architecture)
- [Frontend Pages](#frontend-pages)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Seed Data](#seed-data)
- [Known Limitations](#known-limitations)
- [Future Features](#future-features)

---

## Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | v18+ | Runtime environment |
| Express.js | v5.2.1 | Web framework |
| MongoDB | Latest | NoSQL database |
| Mongoose | v9.1.3 | ODM for MongoDB |
| JWT | v9.0.3 | Authentication tokens |
| bcryptjs | v3.0.3 | Password hashing (12 salt rounds) |
| Zod | v4.3.5 | Request validation |
| cookie-parser | v1.4.7 | Cookie handling |
| cors | v2.8.5 | Cross-origin resource sharing |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | v19.2.0 | UI library |
| Vite | v7.2.4 | Build tool & dev server |
| TailwindCSS | v4.1.18 | Utility-first CSS styling |
| React Query | v5.90.17 | Server state management & caching |
| React Router | v7.12.0 | Client-side routing |
| Axios | v1.13.2 | HTTP client |
| Recharts | v3.6.0 | Charts & visualizations |
| Framer Motion | v12.26.2 | Animations & transitions |
| Lucide React | v0.562.0 | Icon library |
| React Hot Toast | v2.6.0 | Toast notifications |

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   React     │  │ React Query │  │     React Router        │  │
│  │   Pages     │◄─┤   Cache     │◄─┤   (Protected Routes)    │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│         │                │                                      │
│         ▼                ▼                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Axios HTTP Client                          │    │
│  │    (Bearer Token from localStorage on each request)     │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ HTTP (REST API)
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Express.js App                       │    │
│  │  ┌─────────┐  ┌──────────────┐  ┌──────────────────┐   │    │
│  │  │  CORS   │─▶│ JSON Parser  │─▶│  Auth Middleware │   │    │
│  │  └─────────┘  └──────────────┘  └──────────────────┘   │    │
│  └─────────────────────────────────────────────────────────┘    │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                     MODULES                              │    │
│  │  ┌──────┐ ┌──────┐ ┌─────────┐ ┌────────┐ ┌─────────┐   │    │
│  │  │ Auth │ │ Plan │ │  Tasks  │ │Pomodoro│ │Analytics│   │    │
│  │  └──────┘ └──────┘ └─────────┘ └────────┘ └─────────┘   │    │
│  │  ┌──────┐ ┌────────┐                                    │    │
│  │  │ DSA  │ │ Search │                                    │    │
│  │  └──────┘ └────────┘                                    │    │
│  └─────────────────────────────────────────────────────────┘    │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Mongoose ODM + MongoDB                      │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow Diagram

```
User Action (Click "Complete Task")
        │
        ▼
┌───────────────────┐
│  React Component  │
│  (Daily.jsx)      │
└───────────────────┘
        │
        ▼ useMutation()
┌───────────────────┐
│  React Query      │
│  Mutation         │
└───────────────────┘
        │
        ▼ PATCH /tasks/:taskKey/status
┌───────────────────┐
│  Axios HTTP       │
│  (Bearer Token)   │
└───────────────────┘
        │
        ▼
┌───────────────────┐
│  Express Router   │
│  authMiddleware   │──▶ Verify JWT ──▶ Extract userId
└───────────────────┘
        │
        ▼
┌───────────────────┐
│  Task Controller  │
│  updateTaskStatus │
└───────────────────┘
        │
        ├──▶ Update UserTask in MongoDB
        │
        └──▶ If status === "COMPLETED"
                    │
                    ▼
            ┌───────────────────┐
            │  Streak Service   │
            │  updateStreak()   │
            └───────────────────┘
                    │
                    ▼
            Update User.streak in MongoDB
```

### Module Interactions

```
┌─────────────────────────────────────────────────────────────┐
│                    MODULE DEPENDENCIES                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  userTask ──────────────┬──────────▶ streak.service         │
│     │                   │                   │               │
│     │                   │                   ▼               │
│     │                   │              auth.model           │
│     │                   │              (User.streak)        │
│     │                   │                                   │
│     ▼                   ▼                                   │
│  analytics ◀────── userTask.model                           │
│     │                   ▲                                   │
│     │                   │                                   │
│     ├──────────▶ pomodoro.model                             │
│     │                                                       │
│     └──────────▶ userDsaProgress.model                      │
│                                                             │
│  search ─────────▶ userTask.model                           │
│                                                             │
│  learningPlan ───▶ learningPlan.model (read-only seed)      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
learning-accountability-platform/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection (mongoose.connect)
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js     # JWT verification (Bearer token)
│   │   │   └── errorHandler.js       # Global error handler
│   │   ├── modules/
│   │   │   ├── analytics/
│   │   │   │   ├── heatmap.controller.js      # Activity heatmap (90 days)
│   │   │   │   ├── heatmap.routes.js
│   │   │   │   ├── overview.controller.js     # Dashboard stats
│   │   │   │   ├── overview.routes.js
│   │   │   │   ├── weeklyProgress.controller.js
│   │   │   │   └── weeklyProgress.routes.js
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.js         # Register, login, logout
│   │   │   │   ├── auth.model.js              # User schema + streak
│   │   │   │   ├── auth.routes.js
│   │   │   │   ├── auth.service.js            # JWT, bcrypt utilities
│   │   │   │   └── auth.validation.js         # Zod schemas
│   │   │   ├── dsa/
│   │   │   │   ├── dsa.controller.js          # CRUD + solve/reset
│   │   │   │   ├── dsa.routes.js
│   │   │   │   ├── dsaProblem.model.js        # Problem schema
│   │   │   │   └── userDsaProgress.model.js   # User progress
│   │   │   ├── learningPlan/
│   │   │   │   ├── learningPlan.controller.js # Get week/day plans
│   │   │   │   ├── learningPlan.model.js      # 8-week curriculum schema
│   │   │   │   └── learningPlan.routes.js
│   │   │   ├── pomodoro/
│   │   │   │   ├── pomodoro.controller.js     # Start/stop sessions
│   │   │   │   ├── pomodoro.model.js          # Session schema
│   │   │   │   └── pomodoro.routes.js
│   │   │   ├── search/
│   │   │   │   ├── search.controller.js
│   │   │   │   ├── search.routes.js
│   │   │   │   └── search.service.js          # Regex search on tasks
│   │   │   └── userTask/
│   │   │       ├── streak.controller.js       # Get streak
│   │   │       ├── streak.routes.js
│   │   │       ├── streak.service.js          # Streak calculation logic
│   │   │       ├── userTask.analytics.controller.js
│   │   │       ├── userTask.analytics.routes.js
│   │   │       ├── userTask.controller.js     # Status/notes CRUD
│   │   │       ├── userTask.model.js          # Task progress schema
│   │   │       └── userTask.routes.js
│   │   ├── seed/
│   │   │   ├── learningPlan.week1.js          # Week 1: Foundation
│   │   │   ├── learningPlan.week2.js          # Week 2-8: Progressive content
│   │   │   ├── ...
│   │   │   ├── learningPlan.week8.js
│   │   │   ├── runSeed.js                     # Execute seeding
│   │   │   └── seedDsaFromLearningPlan.js     # Extract DSA problems
│   │   ├── utils/
│   │   │   ├── AppError.js                    # Custom operational error
│   │   │   ├── asyncHandler.js                # try/catch wrapper
│   │   │   └── cookieOptions.js               # Cookie config
│   │   ├── app.js                             # Express app + routes
│   │   └── server.js                          # Entry point + DB connect
│   ├── .env                                   # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── http.js                        # Axios instance + interceptor
    │   │   ├── auth.js                        # Auth API calls
    │   │   ├── tasks.js                       # Task status updates
    │   │   ├── notes.js                       # Task notes updates
    │   │   ├── plan.js                        # Learning plan API
    │   │   ├── weeklyPlan.js                  # Week plan API
    │   │   ├── pomodoro.js                    # Pomodoro API
    │   │   ├── dsa.js                         # DSA API
    │   │   ├── analytics.js                   # Overview API
    │   │   ├── analyticsPage.js               # Full analytics API
    │   │   ├── search.js                      # Search API
    │   │   ├── session.js                     # Session management
    │   │   ├── tasksProgress.js               # Task progress API
    │   │   └── queryClient.js                 # React Query config
    │   ├── components/
    │   │   ├── AccordionSection.jsx           # Collapsible section
    │   │   ├── CommandPalette.jsx             # Ctrl+K search
    │   │   ├── HeatmapGrid.jsx                # Activity heatmap
    │   │   ├── Navbar.jsx                     # Navigation bar
    │   │   └── PageTransition.jsx             # Framer motion wrapper
    │   ├── layouts/
    │   │   └── AppLayout.jsx                  # Main layout with navbar
    │   ├── pages/
    │   │   ├── Analytics.jsx                  # Full analytics page
    │   │   ├── DSA.jsx                        # DSA practice page
    │   │   ├── Daily.jsx                      # Daily tasks page
    │   │   ├── Dashboard.jsx                  # Main dashboard
    │   │   ├── Login.jsx                      # Login form
    │   │   ├── Register.jsx                   # Register form
    │   │   ├── Roadmap.jsx                    # Full 8-week roadmap
    │   │   ├── Settings.jsx                   # User settings
    │   │   └── WeeklyRoadmap.jsx              # Single week view
    │   ├── routes/
    │   │   ├── AppRoutes.jsx                  # Route definitions
    │   │   ├── HomeRedirect.jsx               # Root redirect logic
    │   │   └── ProtectedRoute.jsx             # Auth guard
    │   ├── App.jsx                            # Root component
    │   ├── main.jsx                           # React entry point
    │   └── index.css                          # Global styles
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## Features

### 1. Learning Plan System
- **8-week structured curriculum** covering JavaScript, DSA, MERN, and AI/ML
- Each week has **7 days** with morning and evening time blocks
- Tasks organized by **category**: JavaScript, DSA, MERN, AI/ML
- Expected **outcomes** defined for each topic
- Static seed data (version: "v1") loaded into MongoDB

### 2. Task Tracking
- Three task statuses: `NOT_STARTED` → `IN_PROGRESS` → `COMPLETED`
- **Markdown notes** support for each task
- **Completion timestamps** (`completedAt`) recorded
- Task progress stored per user with unique constraint
- Upsert behavior: creates task record on first status update

### 3. Streak System
- Daily streak tracking based on task completions
- **Current streak** and **longest streak** stored on User model
- `lastActiveDate` tracks the last day user completed a task
- Streak resets to 1 if user misses a day
- Streak increments when completing tasks on consecutive days

### 4. Pomodoro Timer (Focus Sessions)
- Start/stop focus sessions tied to specific tasks
- Tracks `startedAt`, `endedAt`, and `durationMinutes`
- Daily summary: total sessions count and total hours
- "Deep Work" hours displayed on dashboard

### 5. DSA Practice Module
- DSA problems with **Easy/Medium/Hard** difficulty levels
- Topics: Arrays, Strings, Two Pointers, Hashing, DP, etc.
- Track solved problems with notes and code snippets
- Reset problem progress to re-practice
- Spaced repetition revision system (today's revisions)

### 6. Analytics Dashboard
- **Heatmap**: Activity visualization (last 90 days by default)
  - Aggregates: completed tasks + pomodoro sessions + DSA solves
- **Weekly progress**: Completion percentage per week
- **Overview stats**: streak, completion %, deep work hours
- MongoDB aggregation pipelines for efficient queries

### 7. Authentication
- JWT-based authentication (7-day expiry)
- Secure password hashing with bcrypt (12 salt rounds)
- Bearer token in Authorization header
- Token stored in localStorage on frontend
- Protected routes middleware validates JWT on each request

### 8. Global Search
- Regex-based search across task keys and notes
- Returns matching tasks with preview snippets
- Limited to 50 results max

---

## Database Models

### User (`auth.model.js`)
```javascript
{
  email: String,              // unique, required, lowercase, trimmed
  passwordHash: String,       // required, bcrypt hash
  auth: {
    refreshTokenHash: String, // SHA-256 hash of refresh token
    refreshTokenExpiry: Date  // 7 days from creation
  },
  streak: {
    current: Number,          // default: 0
    longest: Number,          // default: 0
    lastActiveDate: Date      // null until first task completion
  },
  createdAt: Date,
  updatedAt: Date
}
// Index: { email: 1 }
```

### LearningPlan (`learningPlan.model.js`)
```javascript
{
  version: String,            // default: "v1"
  weekNumber: Number,         // 1-8
  title: String,              // e.g., "Foundation Week"
  goal: String,               // Weekly goal description
  days: [{
    dayNumber: Number,        // 1-7
    label: String,            // "Monday", "Tuesday", etc.
    schedule: [{
      timeBlock: String,      // "Morning" | "Evening"
      category: String,       // "JavaScript" | "DSA" | "MERN" | "AI/ML"
      topic: String,          // Topic title
      tasks: [String],        // Array of task descriptions
      outcomes: [String]      // Expected learning outcomes
    }]
  }],
  createdAt: Date,
  updatedAt: Date
}
// Unique index: { version: 1, weekNumber: 1 }
```

### UserTask (`userTask.model.js`)
```javascript
{
  userId: ObjectId,           // ref: User, indexed
  version: String,            // default: "v1"
  weekNumber: Number,         // 1-8
  dayNumber: Number,          // 1-7
  taskKey: String,            // e.g., "W1-D1-JavaScript-0-2"
  status: String,             // enum: ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]
  notesMarkdown: String,      // default: ""
  completedAt: Date,          // null until completed
  createdAt: Date,
  updatedAt: Date
}
// Unique index: { userId, version, weekNumber, dayNumber, taskKey }
```

### PomodoroSession (`pomodoro.model.js`)
```javascript
{
  userId: ObjectId,           // ref: User, indexed
  taskKey: String,            // Associated task
  weekNumber: Number,
  dayNumber: Number,
  startedAt: Date,            // required
  endedAt: Date,              // null until stopped
  durationMinutes: Number,    // calculated on stop
  createdAt: Date,
  updatedAt: Date
}
// Index: { userId: 1, startedAt: -1 }
```

### DSAProblem (`dsaProblem.model.js`)
```javascript
{
  title: String,              // unique, required
  topic: String,              // "Array", "DP", "Graph", etc.
  difficulty: String,         // enum: ["Easy", "Medium", "Hard"]
  createdAt: Date,
  updatedAt: Date
}
// Indexes: { title: 1 } unique, { topic: 1, difficulty: 1 }
```

---

## API Reference

### Authentication (`/auth`)
| Method | Endpoint | Description | Auth | Request Body |
|--------|----------|-------------|------|--------------|
| POST | `/auth/register` | Register new user | No | `{ email, password }` |
| POST | `/auth/login` | Login user | No | `{ email, password }` |
| POST | `/auth/logout` | Logout user | No | - |
| GET | `/auth/me` | Get current user ID | Yes | - |

### Learning Plan (`/plan`)
| Method | Endpoint | Description | Auth | Query Params |
|--------|----------|-------------|------|--------------|
| GET | `/plan/week/:weekNumber` | Get full week plan | No | - |
| GET | `/plan/current-day` | Get current day plan | No | `?day=1` (optional) |

### Tasks (`/tasks`)
| Method | Endpoint | Description | Auth | Body/Query |
|--------|----------|-------------|------|------------|
| GET | `/tasks/day` | Get day tasks | Yes | `?weekNumber=1&dayNumber=1` |
| PATCH | `/tasks/:taskKey/status` | Update task status | Yes | `{ status, weekNumber, dayNumber }` |
| PATCH | `/tasks/:taskKey/notes` | Update task notes | Yes | `{ notesMarkdown }` |

### Pomodoro (`/pomodoro`)
| Method | Endpoint | Description | Auth | Body/Query |
|--------|----------|-------------|------|------------|
| POST | `/pomodoro/start` | Start focus session | Yes | `{ taskKey, weekNumber, dayNumber }` |
| POST | `/pomodoro/stop` | Stop current session | Yes | - |
| POST | `/pomodoro/stop/:sessionId` | Stop specific session | Yes | - |
| GET | `/pomodoro/daily-summary` | Get daily summary | Yes | `?weekNumber=1&dayNumber=1` |

### DSA (`/dsa`)
| Method | Endpoint | Description | Auth | Body |
|--------|----------|-------------|------|------|
| POST | `/dsa/problems` | Add new problem | Yes | `{ title, topic, difficulty }` |
| GET | `/dsa/problems` | List all problems | Yes | - |
| POST | `/dsa/:problemId/solve` | Mark as solved | Yes | - |
| GET | `/dsa/revisions/today` | Get today's revisions | Yes | - |
| PATCH | `/dsa/:problemId/notes` | Save notes & code | Yes | `{ notes, code }` |
| PATCH | `/dsa/:problemId/reset` | Reset progress | Yes | - |

### Analytics (`/analytics`)
| Method | Endpoint | Description | Auth | Query Params |
|--------|----------|-------------|------|--------------|
| GET | `/analytics/heatmap` | Activity heatmap | Yes | `?days=90` |
| GET | `/analytics/weekly-progress` | Weekly stats | Yes | `?weekNumber=1` |
| GET | `/analytics/overview` | Dashboard overview | Yes | `?weekNumber=1&dayNumber=1` |
| GET | `/analytics/streak` | Get streak data | Yes | - |

### Search (`/search`)
| Method | Endpoint | Description | Auth | Query Params |
|--------|----------|-------------|------|--------------|
| GET | `/search` | Global search | Yes | `?q=keyword&limit=20` |

---

## API Request/Response Examples

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com"
    }
  }
}
```

**Error Response (409):**
```json
{
  "status": "fail",
  "message": "User already exists"
}
```

---

### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com"
    }
  }
}
```

---

### Update Task Status
```http
PATCH /tasks/W1-D1-JavaScript-0-2/status
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "status": "COMPLETED",
  "weekNumber": 1,
  "dayNumber": 1
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "version": "v1",
    "weekNumber": 1,
    "dayNumber": 1,
    "taskKey": "W1-D1-JavaScript-0-2",
    "status": "COMPLETED",
    "notesMarkdown": "",
    "completedAt": "2026-01-25T10:30:00.000Z",
    "createdAt": "2026-01-25T10:00:00.000Z",
    "updatedAt": "2026-01-25T10:30:00.000Z"
  }
}
```

---

### Get Overview Stats
```http
GET /analytics/overview?weekNumber=1&dayNumber=1
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "weekNumber": 1,
    "dayNumber": 1,
    "streak": {
      "current": 5,
      "longest": 12,
      "lastActiveDate": "2026-01-25T10:30:00.000Z"
    },
    "tasks": {
      "totalTasks": 10,
      "completedTasks": 7,
      "completionPercentage": 70
    },
    "focus": {
      "totalSessions": 3,
      "totalMinutes": 90,
      "totalHours": 1.5
    }
  }
}
```

---

### Get Heatmap
```http
GET /analytics/heatmap?days=90
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "startDate": "2025-10-27T00:00:00.000Z",
    "endDate": "2026-01-25T23:59:59.999Z",
    "days": 90,
    "heatmap": [
      { "date": "2025-11-01", "count": 5 },
      { "date": "2025-11-02", "count": 3 },
      { "date": "2025-11-05", "count": 8 }
    ]
  }
}
```

---

### Global Search
```http
GET /search?q=closure&limit=10
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "type": "task",
      "weekNumber": 1,
      "dayNumber": 3,
      "taskKey": "W1-D3-JavaScript-0-2",
      "status": "COMPLETED",
      "notesPreview": "...Closures (intuition only) - A closure is when...",
      "updatedAt": "2026-01-20T15:30:00.000Z"
    }
  ]
}
```

---

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. REGISTRATION                                                │
│     ┌──────────┐    POST /auth/register    ┌──────────────┐    │
│     │  Client  │ ─────────────────────────▶│   Backend    │    │
│     │          │    { email, password }    │              │    │
│     │          │                           │  • Validate  │    │
│     │          │                           │  • Hash pwd  │    │
│     │          │                           │  • Create    │    │
│     │          │◀───────────────────────── │    user     │    │
│     │          │    { accessToken, user }  │  • Gen JWT   │    │
│     └──────────┘                           └──────────────┘    │
│          │                                                      │
│          ▼ Store in localStorage                                │
│     ┌──────────────────────┐                                    │
│     │ localStorage.setItem │                                    │
│     │ ("accessToken", jwt) │                                    │
│     └──────────────────────┘                                    │
│                                                                 │
│  2. AUTHENTICATED REQUESTS                                      │
│     ┌──────────┐                           ┌──────────────┐    │
│     │  Client  │    GET /tasks/day         │   Backend    │    │
│     │          │ ─────────────────────────▶│              │    │
│     │          │  Authorization:           │              │    │
│     │          │  Bearer <accessToken>     │              │    │
│     │          │                           │ authMiddleware│    │
│     │          │                           │  • Extract   │    │
│     │          │                           │    token     │    │
│     │          │                           │  • Verify    │    │
│     │          │                           │    JWT       │    │
│     │          │                           │  • Set       │    │
│     │          │◀───────────────────────── │    req.userId│    │
│     │          │    { tasks data }         │              │    │
│     └──────────┘                           └──────────────┘    │
│                                                                 │
│  3. TOKEN EXPIRY (7 days)                                       │
│     • JWT expires after 7 days                                  │
│     • User must login again                                     │
│     • No refresh token rotation implemented (simplified)        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Token Structure
```javascript
// JWT Payload
{
  "userId": "507f1f77bcf86cd799439011",
  "iat": 1737792000,  // Issued at
  "exp": 1738396800   // Expires (7 days)
}
```

### Frontend Token Handling (`http.js`)
```javascript
// Axios interceptor attaches token to every request
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## Business Logic

### Streak Calculation (`streak.service.js`)

```javascript
const updateStreak = async (userId) => {
  const user = await User.findById(userId);
  const today = new Date();

  // Case 1: First ever activity
  if (!user.streak.lastActiveDate) {
    user.streak.current = 1;
  }
  // Case 2: Already active today (no change)
  else if (isSameDay(user.streak.lastActiveDate, today)) {
    return;
  }
  // Case 3: Active yesterday (increment streak)
  else if (isYesterday(user.streak.lastActiveDate, today)) {
    user.streak.current += 1;
  }
  // Case 4: Missed day(s) (reset streak)
  else {
    user.streak.current = 1;
  }

  // Update longest if current exceeds it
  user.streak.longest = Math.max(user.streak.longest, user.streak.current);
  user.streak.lastActiveDate = today;
  await user.save();
};
```

### Task Key Generation (Frontend)
```javascript
// Generated in Daily.jsx for each task
const taskKey = `W${weekNumber}-D${dayNumber}-${category}-${blockIndex}-${taskIndex}`;
// Example: "W1-D1-JavaScript-0-2"
```

### Heatmap Aggregation
- Combines 3 data sources:
  1. **Completed tasks** (`UserTask.completedAt`)
  2. **Finished pomodoro sessions** (`PomodoroSession.endedAt`)
  3. **Solved DSA problems** (`UserDSAProgress.lastSolvedAt`)
- Groups by date using MongoDB `$dateToString`
- Merges counts per day

### Task Status Flow
```
NOT_STARTED ──▶ IN_PROGRESS ──▶ COMPLETED
     ▲              │               │
     │              │               │
     └──────────────┴───────────────┘
              (can reset)
```

---

## Validation Rules

### Registration (`auth.validation.js`)
```javascript
// Email
- Must be valid email format
- Min 5 characters
- Max 255 characters
- Stored as lowercase

// Password
- Min 8 characters
- Must contain at least one letter [A-Za-z]
- Must contain at least one number [0-9]
```

### Login
```javascript
// Email
- Must be valid email format

// Password
- Min 1 character (just required)
```

### Task Status
```javascript
// Valid values only
enum: ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]
```

### DSA Problem
```javascript
// Difficulty
enum: ["Easy", "Medium", "Hard"]

// Title
- Required, trimmed, unique
```

---

## Error Handling

### Error Response Format
```json
{
  "status": "fail",      // or "error" for 5xx
  "message": "Error description"
}
```

### AppError Class
```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode.toString().startsWith("4") ? "fail" : "error";
    this.isOperational = true;  // Distinguishes from programming errors
  }
}
```

### HTTP Status Codes Used
| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET, PATCH |
| 201 | Created | Successful POST (register) |
| 400 | Bad Request | Validation error, missing params |
| 401 | Unauthorized | Missing/invalid JWT |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Email already exists |
| 500 | Server Error | Unexpected errors |

### Global Error Handler
```javascript
// Operational errors (expected)
if (err.isOperational) {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
}

// Programming errors (unexpected)
return res.status(500).json({
  status: "error",
  message: "Something went wrong. Please try again later.",
});
```

---

## Frontend Architecture

### State Management
- **Server State**: React Query (TanStack Query)
- **Local State**: React useState/useReducer
- **No global client state library** (Redux not needed)

### React Query Patterns
```javascript
// Query Keys Convention
["week-plan", weekNumber]
["day-progress", weekNumber, dayNumber]
["pomodoro-summary", weekNumber, dayNumber]
["overview", weekNumber, dayNumber]

// Cache Invalidation on Mutations
onSettled: () => {
  queryClient.invalidateQueries({ queryKey: ["day-progress", W, D] });
  queryClient.invalidateQueries({ queryKey: ["overview", W, D] });
}
```

### Protected Route Pattern
```jsx
// ProtectedRoute.jsx
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("accessToken");
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}
```

### Component Hierarchy
```
App
└── AppRoutes
    ├── Login / Register (public)
    └── ProtectedRoute
        └── AppLayout (Navbar + content)
            ├── Dashboard
            ├── Daily
            ├── WeeklyRoadmap
            ├── Roadmap
            ├── DSA
            ├── Analytics
            └── Settings
```

---

## Frontend Pages

| Page | Route | Key Features |
|------|-------|--------------|
| Login | `/login` | Email/password form, stores JWT |
| Register | `/register` | Email/password with validation |
| Dashboard | `/dashboard` | Streak, completion %, deep work hours, "Go to Today" |
| Daily | `/daily/:week/:day` | Task list, status toggles, notes, pomodoro timer |
| Weekly Roadmap | `/roadmap` | Current week overview with day cards |
| Weekly Roadmap | `/roadmap/week/:weekNumber` | Specific week view |
| Full Roadmap | `/roadmap-full` | All 8 weeks overview |
| DSA | `/dsa` | Problem list, solve/reset, notes |
| Analytics | `/analytics` | Heatmap, charts, detailed stats |
| Settings | `/settings` | User preferences |

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd learning-accountability-platform
```

2. **Setup Backend**
```bash
cd backend
npm install
```

3. **Setup Frontend**
```bash
cd frontend
npm install
```

4. **Configure Environment Variables** (see below)

5. **Seed the Database**
```bash
cd backend
node src/seed/runSeed.js
```

6. **Run Development Servers**

Backend (Terminal 1):
```bash
cd backend
npm run dev
# Runs on http://localhost:4000
```

Frontend (Terminal 2):
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

---

## Environment Variables

### Backend (`backend/.env`)
```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/learning-accountability
JWT_ACCESS_SECRET=your-super-secret-jwt-key-min-32-chars
NODE_ENV=development
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:4000
```

---

## Seed Data

### 8-Week Curriculum Structure
| Week | Title | Focus Areas |
|------|-------|-------------|
| 1 | Foundation Week | JS basics (execution context, closures), DSA basics (arrays, strings) |
| 2-4 | Core Concepts | Advanced JS, more DSA patterns, MERN intro |
| 5-6 | Advanced Topics | React deep dive, Node.js, MongoDB |
| 7-8 | Projects & AI/ML | Full-stack projects, AI/ML intro |

### Running Seeds
```bash
cd backend
node src/seed/runSeed.js          # Seed all 8 weeks
node src/seed/seedDsaFromLearningPlan.js  # Extract DSA problems
```

---

## Known Limitations

### Current Hardcoded Values
| Item | Current State | Impact |
|------|---------------|--------|
| `getCurrentDayPlan` | Always returns Week 1 | Dashboard shows wrong "current day" |
| Day labels | Hardcoded "Monday"-"Sunday" | Confusing if user starts mid-week |
| Plan version | Fixed to "v1" | No support for multiple plan versions |

### Missing Features
- No user `planStartDate` - can't calculate actual current day
- No password reset / forgot password
- No email verification
- No refresh token rotation (single JWT only)
- No rate limiting
- No input sanitization beyond Zod

### Technical Debt
- Some controllers have commented-out old code
- No unit tests
- No integration tests
- No API documentation (Swagger/OpenAPI)
- Frontend has some inline styles mixed with Tailwind

---

## Future Features

### High Priority (Production Essentials)

#### 1. Dynamic Plan Start Date
- Add `planStartDate` field to User model
- Create `calculateCurrentDay()` utility
- Update `getCurrentDayPlan` to use user's start date
- Allow users to start on any day of the week

#### 2. Authentication Improvements
- Password reset via email
- Email verification on registration
- Refresh token rotation
- Session management (logout all devices)

#### 3. Security Hardening
- Rate limiting (express-rate-limit)
- Input sanitization (express-mongo-sanitize)
- Helmet.js security headers
- CORS origin validation
- Request size limits

#### 4. Generic Day Labels
- Change "Monday"-"Sunday" to "Day 1"-"Day 7"
- Show actual calendar date based on user's start date

### Medium Priority (Enhanced UX)

#### 5. Pause/Resume Plan
- Add `pausedAt`, `resumedAt`, `totalPausedDays` to User
- Adjust current day calculation for paused time
- UI to pause/resume learning journey

#### 6. Progress Indicators
- Overall plan progress (e.g., "Day 15 of 56")
- Week completion badges
- Achievement system

#### 7. Notifications
- Email reminders for daily tasks
- Streak warning notifications
- Weekly progress summary emails

#### 8. Data Export
- Export progress as JSON/CSV
- Export notes as Markdown
- Backup/restore functionality

### Low Priority (Nice to Have)

#### 9. Social Features
- Public profiles
- Leaderboards
- Share progress on social media
- Study groups

#### 10. Mobile App
- React Native version
- Push notifications
- Offline support

#### 11. AI Integration
- AI-powered study recommendations
- Smart task prioritization
- Personalized learning path adjustments

#### 12. Advanced Analytics
- Learning velocity metrics
- Predicted completion date
- Comparison with average users
- Time-of-day productivity analysis

### Infrastructure

#### 13. DevOps
- Docker containerization
- CI/CD pipeline (GitHub Actions)
- Automated testing
- Staging environment

#### 14. Monitoring
- Error tracking (Sentry)
- Performance monitoring
- API analytics
- User behavior tracking

#### 15. Scalability
- Redis caching
- Database indexing optimization
- CDN for static assets
- Horizontal scaling support

---

## Task Key Format

Tasks are identified by a unique key format:
```
W{weekNumber}-D{dayNumber}-{category}-{blockIndex}-{taskIndex}
```

Example: `W1-D1-JavaScript-0-2` represents:
- **W1**: Week 1
- **D1**: Day 1
- **JavaScript**: Category
- **0**: First time block (Morning = 0, Evening = 1)
- **2**: Third task in that block (0-indexed)

---

## License

ISC
