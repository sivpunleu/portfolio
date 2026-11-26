# Personal Developer Portfolio & DevCMS

A full-stack personal developer portfolio and custom **DevCMS** content management system built with **Vue 3**, **Vite**, **Pinia**, **Node.js**, **Express 5**, and **MySQL**, deployed on **Firebase Hosting** and **Railway**.

- **Live Website:** https://siv-punleu-portfolio-202-b812a.web.app
- **API Health:** https://backend-production-3bd03ec4.up.railway.app/api/health

---

## Tech Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | Vue 3 (Composition API), Vite 8, Pinia, Vue Router 4, Axios, Lucide Icons |
| **Backend** | Node.js (CommonJS), Express 5, MySQL2 (`mysql2/promise`), JWT (`jsonwebtoken`), Bcrypt (`bcryptjs`), Joi Validation |
| **Security & Uploads** | Helmet CSP, CORS Origin Filtering, Express Rate Limit, Multer (Avatar & PDF Resume Uploads), Nodemailer |
| **Deployment** | Firebase Hosting (`frontend`), Railway (`backend` + managed MySQL + persistent `/app/uploads` volume) |

---

## Key Features

- **Dynamic Portfolio Showcase:** Hero section with typewriter effects, About Me, Education timeline, interactive Skills grid by category, Projects showcase with details modal, downloadable Resume PDF, and Contact form.
- **Custom Admin Dashboard (`/admin/login`):** Secure JWT-authenticated CMS to manage Profile details, Avatar & Resume PDF uploads, Projects, Skills, Education entries, Contact Messages, and Account Security.
- **Auth & Email Workflows:** Role-protected admin routes, public registration guard, password reset, and email verification via Nodemailer.
- **Schema Migration & Seeding:** Automated MySQL schema setup (`npm run migrate`) and idempotent admin provisioning (`npm run seed:admin`).

---

## Project Structure

```text
Portfolio/
├── backend/                # Express 5 API, controllers, services, models, Joi validations, migrations
│   ├── config/             # MySQL pool, JWT, and mailer configuration
│   ├── middlewares/        # Auth guards, Joi validation, Multer uploads, rate limiters, error handler
│   ├── routes/             # /api/profile, /api/projects, /api/skills, /api/education, /api/contact, /api/upload
│   ├── scripts/            # migrate.js and createAdmin.js
│   └── railway.json        # Railway Railpack deployment config
└── frontend/               # Vue 3 + Vite SPA & Firebase Hosting configuration
    ├── src/components/     # Portfolio sections (Hero, About, Skills, Education, Projects, Contact)
    ├── src/views/admin/    # Admin CMS views (Dashboard, Profile, Projects, Skills, Education, Messages, Account)
    ├── firebase.json       # Firebase Hosting rewrites & cache headers
    └── .firebaserc         # Firebase project alias
```

---

## Run Locally

1. **Configure Backend Environment:** Copy `.env.example` to `backend/.env` and update your MySQL, JWT, and mail settings.
2. **Migrate Database & Seed Admin:**

```bash
cd backend
npm install
npm run migrate
npm run seed:admin
npm run dev
```

3. **Start Frontend (`http://localhost:5173`):**

```bash
cd frontend
npm install
npm run dev
```

4. **Run Backend API Tests:**

```bash
cd backend
npm run test:api
```
