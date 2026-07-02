<div align="center">

<img src="frontend/assets/Login.png" alt="JOB-KART Banner" width="100%" />

# JOB<span style="color:#2563EB">·</span>KART

### *Empowering Careers, Simplifying Hiring*

A full-stack job portal platform connecting skilled professionals with verified opportunities from India's top companies.

---

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)](https://jwt.io)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Glossary/HTML5)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

<br/>

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/your-username/JOB-KART/pulls)
[![Issues](https://img.shields.io/github/issues/your-username/JOB-KART?style=flat-square)](https://github.com/your-username/JOB-KART/issues)

<br/>

<a href="#-live-demo">Live Demo</a> · <a href="#-getting-started">Getting Started</a> · <a href="#-api-reference">API Docs</a> · <a href="#-contributing">Contributing</a>

</div>

---

## Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [Seed Data](#-seed-data)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## Overview

**JOB·KART** is a comprehensive recruitment platform built with the MERN-style stack (MongoDB, Express.js, vanilla JS frontend) that bridges the gap between job seekers and employers. It features dual-role authentication, dynamic dashboards, real-time application tracking, and a fully responsive design — all without relying on heavy frontend frameworks.

> *"Job-Kart is a trusted career platform connecting skilled professionals with verified opportunities from India's top companies. We simplify hiring for employers and empower candidates to find roles aligned with their expertise."*

---

## Key Features

### For Candidates
| Feature | Description |
|---------|-------------|
| **Smart Job Discovery** | Browse, search, and filter job listings by type, experience, salary, and location |
| **One-Click Apply** | Apply to positions with auto-filled profile data and resume upload |
| **Application Tracker** | Real-time status updates: Applied → Under Review → Shortlisted → Interview → Selected |
| **Saved Jobs** | Bookmark interesting positions and access them from your dashboard |
| **Job Comparison** | Side-by-side comparison of up to 2 jobs on salary, skills, benefits, and more |
| **Profile Completion** | Guided profile setup with percentage-based completion tracking |
| **Company Insights** | View company profiles, galleries, employee reviews, and follow companies |

### For Recruiters
| Feature | Description |
|---------|-------------|
| **Job Management** | Create, edit, and close job listings with rich detail fields |
| **Applicant Pipeline** | Visual hiring pipeline: Applied → Under Review → Shortlisted → Interview → Selected |
| **Candidate Screening** | Search and filter applicants by name, role, or status |
| **Company Branding** | Build a rich company profile with mission, values, gallery, and benefits |
| **Real-time Stats** | Dashboard with applications-by-job charts, hiring status distribution, and pipeline metrics |
| **Review Management** | Receive and display employee reviews with star ratings |

### Platform
| Feature | Description |
|---------|-------------|
| **JWT Authentication** | Secure token-based auth with bcrypt password hashing |
| **Role-Based Access** | Candidate and Recruiter roles with distinct permissions |
| **Dark Mode** | Eye-friendly dark theme on all dashboard pages |
| **Responsive Design** | Seamless experience from mobile to desktop |
| **Scroll Animations** | Intersection Observer-powered reveal effects |
| **Contact System** | Contact form with server-side storage and FAQ section |

---

## Tech Stack

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND                            │
│                                                         │
│   HTML5 · CSS3 · Vanilla JavaScript · Chart.js          │
│   Google Fonts (DM Sans) · Font Awesome 6               │
│   Dark Mode · Responsive Design · CSS Custom Properties │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                     BACKEND                             │
│                                                         │
│   Node.js · Express.js 5 · JWT · bcryptjs               │
│   RESTful API · Middleware (Auth, CORS)                  │
│   Nodemon (dev) · dotenv                                │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                     DATABASE                            │
│                                                         │
│   MongoDB Atlas · Mongoose ODM                           │
│   6 Collections · Aggregation Pipelines                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Architecture

```
                         ┌──────────────┐
                         │   Browser    │
                         │  (Frontend)  │
                         └──────┬───────┘
                                │
                    Static HTML/CSS/JS
                                │
                         ┌──────▼───────┐
                         │  Express.js  │
                         │   Server     │
                         │  :5000/api   │
                         └──────┬───────┘
                                │
                    JWT Auth · CORS · Routes
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                  │
     ┌────────▼──────┐  ┌──────▼───────┐  ┌──────▼───────┐
     │  Controllers  │  │  Middleware  │  │    Models    │
     │               │  │              │  │              │
     │  authController│  │  protect()  │  │  User        │
     │  jobController │  │  authorize()│  │  Job         │
     │  companyCtrl   │  │              │  │  Company     │
     │  applicationCtrl│ │              │  │  Application │
     │  reviewCtrl    │  │              │  │  Review      │
     │  contactCtrl   │  │              │  │  ContactMsg  │
     └────────┬──────┘  └──────────────┘  └──────┬───────┘
              │                                   │
              └─────────────────┬─────────────────┘
                                │
                         ┌──────▼───────┐
                         │   MongoDB    │
                         │    Atlas     │
                         └──────────────┘
```

---

## Screenshots

<div align="center">

<table>
  <tr>
    <td align="center"><b>Homepage</b></td>
    <td align="center"><b>Job Listings</b></td>
    <td align="center"><b>Job Details</b></td>
  </tr>
  <tr>
    <td><img src="frontend/assets/readme/homepage.png" width="300" /></td>
    <td><img src="frontend/assets/readme/openings.png" width="300" /></td>
    <td><img src="frontend/assets/readme/job-details.png" width="300" /></td>
  </tr>
  <tr>
    <td align="center"><b>Candidate Dashboard</b></td>
    <td align="center"><b>Recruiter Dashboard</b></td>
    <td align="center"><b>Company Profile</b></td>
  </tr>
  <tr>
    <td><img src="frontend/assets/readme/candidate-dash.png" width="300" /></td>
    <td><img src="frontend/assets/readme/recruiter-dash.png" width="300" /></td>
    <td><img src="frontend/assets/readme/company.png" width="300" /></td>
  </tr>
</table>

> *Place your screenshots in `frontend/assets/readme/` and update the paths above.*

</div>

---

## Getting Started

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| [Node.js](https://nodejs.org) | v16+ | JavaScript runtime |
| [npm](https://www.npmjs.com) | v8+ | Package manager |
| [MongoDB Atlas](https://www.mongodb.com/atlas) | Free tier | Cloud database |

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/JOB-KART.git
cd JOB-KART
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
```

### 3. Seed the Database (Optional but Recommended)

```bash
node seed.js
```

This populates the database with:
- **7 companies** (Leadjen Media, Algopage Tech, TechNova Solutions, NorthStar Solutions, Bluepoint Digital, Vertex Outsourcing, Coastline Tech)
- **18 job listings** across all companies
- **12 employee reviews**

### 4. Start the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:5000/api`.

### 5. Open the Frontend

No build step needed — the frontend is pure HTML/CSS/JS.

```bash
# Option A: Open directly
open frontend/index.html

# Option B: Use VS Code Live Server
# Right-click index.html → "Open with Live Server"
```

> The frontend API client (`frontend/js/api.js`) is configured to point to `http://localhost:5000/api` by default.

---

## Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | Yes | Server port number | `5000` |
| `MONGO_URI` | Yes | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster/db` |
| `JWT_SECRET` | Yes | Secret key for JWT token signing | `any_long_random_string` |

---

## Database Schema

### User
```
├── name              String (required)
├── email             String (required, unique, lowercase)
├── password          String (required, min 6, hashed)
├── role              Enum ['candidate', 'recruiter'] (default: 'candidate')
├── phone             String
├── companyId         ObjectId → Company
├── profilePhoto      String
├── resume            String
├── skills            [String]
├── experience        String
├── education         String
├── portfolioUrl      String
├── profileCompletion Number (0-100)
└── timestamps        createdAt, updatedAt
```

### Job
```
├── companyId         ObjectId → Company (required)
├── title             String (required)
├── description       String
├── responsibilities  [String]
├── skills            [String]
├── benefits          [String]
├── exp               String
├── sal               String
├── type              Enum ['Full-Time','Part-Time','Contract','Internship','Remote']
├── location          String
├── fresher           Boolean
├── postedDate        Date
├── applyBefore       Date
├── status            Enum ['active', 'closed']
└── timestamps        createdAt, updatedAt
```

### Company
```
├── name              String (required)
├── industry, hq, founded, size, type
├── website, email, logo, logoText, cover
├── about, mission, vision
├── mvv               [{ icon, label, desc }]
├── coreValues        [String]
├── gallery           [{ url, label }]
├── benefits          [{ icon, label }]
├── stats             [{ label, val, target }]
├── rating            { score, total, bars: [Number] }
├── socials           [{ label, icon, url }]
├── followers         [ObjectId → User]
└── timestamps        createdAt, updatedAt
```

### Application
```
├── jobId             ObjectId → Job (required)
├── candidateId       ObjectId → User (required)
├── status            Enum ['applied','underReview','shortlisted','interview','selected','rejected']
├── resume            String
├── appliedDate       Date
└── timestamps        createdAt, updatedAt
```

### Review
```
├── companyId         ObjectId → Company (required)
├── userId            ObjectId → User
├── author            String (required)
├── role              String
├── stars             Number (1-5, required)
├── text              String
└── timestamps        createdAt, updatedAt
```

---

## API Reference

**Base URL:** `http://localhost:5000/api`

### Authentication

| Method | Endpoint | Auth | Body | Description |
|--------|----------|------|------|-------------|
| `POST` | `/auth/register` | No | `{ name, email, password, role }` | Register a new user |
| `POST` | `/auth/login` | No | `{ email, password }` | Login & receive JWT |
| `GET` | `/auth/me` | Yes | — | Get current user profile |
| `PUT` | `/auth/profile` | Yes | `{ name?, phone?, skills?, ... }` | Update user profile |

### Jobs

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `GET` | `/jobs` | No | — | List all active jobs |
| `GET` | `/jobs/compare?ids=a,b` | No | — | Compare jobs by IDs |
| `GET` | `/jobs/:id` | No | — | Get job details |
| `POST` | `/jobs` | Yes | Recruiter | Create a job listing |
| `PUT` | `/jobs/:id` | Yes | Recruiter | Update a job listing |
| `DELETE` | `/jobs/:id` | Yes | Recruiter | Delete a job listing |

### Companies

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `GET` | `/companies` | No | — | List all companies |
| `GET` | `/companies/:id` | No | — | Get company profile |
| `GET` | `/companies/:id/jobs` | No | — | Get company's job listings |
| `POST` | `/companies/:id/follow` | Yes | Any | Toggle follow company |
| `POST` | `/companies` | Yes | Recruiter | Create company profile |
| `PUT` | `/companies/:id` | Yes | Recruiter | Update company profile |

### Applications

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `POST` | `/applications/apply` | Yes | Candidate | Apply to a job |
| `GET` | `/applications/my` | Yes | Candidate | Get my applications |
| `GET` | `/applications/recruiter` | Yes | Recruiter | Get applicants for my jobs |
| `PUT` | `/applications/:id/status` | Yes | Recruiter | Update application status |
| `GET` | `/applications/dashboard/candidate` | Yes | Candidate | Get candidate dashboard stats |
| `GET` | `/applications/dashboard/recruiter` | Yes | Recruiter | Get recruiter dashboard stats |

### Reviews

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/reviews/:companyId` | No | Get company reviews |
| `POST` | `/reviews` | Yes | Create a review |
| `DELETE` | `/reviews/:id` | Yes | Delete a review |

### Contact

| Method | Endpoint | Auth | Body | Description |
|--------|----------|------|------|-------------|
| `POST` | `/contact` | No | `{ name, email, message, ... }` | Submit contact form |
| `GET` | `/contact` | No | — | Get all messages |

---

## Project Structure

```
JOB-KART/
│
├── backend/
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js       # Register, login, profile
│   │   ├── jobController.js        # Job CRUD operations
│   │   ├── companyController.js    # Company CRUD + follow
│   │   ├── applicationController.js# Apply, track, dashboard stats
│   │   ├── reviewController.js     # Company reviews
│   │   └── contactController.js    # Contact form messages
│   ├── middleware/
│   │   └── auth.js                 # JWT protect + role authorize
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   ├── Company.js
│   │   ├── Application.js
│   │   ├── Review.js
│   │   └── ContactMessage.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── jobs.js
│   │   ├── companies.js
│   │   ├── applications.js
│   │   ├── reviews.js
│   │   └── contact.js
│   ├── server.js                   # Express app entry point
│   ├── seed.js                     # Database seeder
│   ├── .env                        # Environment variables
│   └── package.json
│
└── frontend/
    ├── css/
    │   ├── style.css               # Main styles (2900+ lines)
    │   ├── dashboard.css           # Dashboard styles
    │   ├── company.css             # Company profile styles
    │   └── login.css               # Login page styles
    ├── js/
    │   ├── api.js                  # Fetch wrapper with JWT auth
    │   ├── main.js                 # Shared UI logic
    │   ├── dashboard.js            # Dashboard logic
    │   ├── login.js                # Auth form logic
    │   ├── job-details.js          # Job detail page
    │   ├── company.js              # Company profile page
    │   ├── compare.js              # Job comparison
    │   └── companies-data.js       # Client-side fallback data
    ├── index.html                  # Homepage
    ├── openings.html               # Job listings
    ├── job-details.html            # Job detail view
    ├── company.html                # Company profile
    ├── login.html                  # Login / Register
    ├── candidate-dashboard.html    # Candidate dashboard
    ├── recruiter-dashboard.html    # Recruiter dashboard
    ├── compare.html                # Job comparison
    ├── about.html                  # About page
    ├── contact.html                # Contact page
    └── services.html               # Services & pricing
```

---

## Seed Data

Running `node backend/seed.js` populates the database with:

| Entity | Count | Details |
|--------|-------|---------|
| Companies | 7 | Leadjen Media, Algopage Tech, TechNova Solutions, NorthStar Solutions, Bluepoint Digital, Vertex Outsourcing, Coastline Tech |
| Jobs | 18 | Full-time, part-time, contract, and remote positions across all companies |
| Reviews | 12 | Employee reviews with 1-5 star ratings |

Each company includes: profile info, mission/vision/values, workplace gallery, employee benefits, company statistics, rating breakdowns, and social media links.

---

## Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow existing code style (vanilla JS, no semicolons in frontend files, IIFE pattern)
- Test all API endpoints before submitting
- Ensure responsive design on mobile/tablet/desktop
- Update this README if adding new features or endpoints

---

## License

This project is licensed under the **ISC License** — see the [LICENSE](LICENSE) file for details.

---

## Contact

<div align="center">

**JOB·KART** — Bhubaneswar, Odisha, India

[![Email](https://img.shields.io/badge/Email-contact%40jobkart.in-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:contact@jobkart.in)
[![Phone](https://img.shields.io/badge/Phone-%2B91-96923%2064168-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](tel:+919692364168)
[![Website](https://img.shields.io/badge/Website-www.job--kart.org-2563EB?style=for-the-badge&logo=googlechrome&logoColor=white)](https://www.job-kart.org)

<br/>

Unit No. 310, Third Floor Royal Arcade, Nirman Rd, Old City, Bhubaneswar, Odisha 751024

---

**If you found this project helpful, please give it a star on GitHub!**

</div>
