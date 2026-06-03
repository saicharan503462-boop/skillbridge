<<<<<<< HEAD
# SkillBridge 🎯

> A structured skill-learning platform — share expertise, discover tutorials, and grow through community ratings.

---

## 🚀 Features

- **Auth** — Signup / Login / Logout with JWT
- **Skill Upload** — Title, description, YouTube video, category, level, tags
- **Explore** — Search + filter by category, level, sort by rating/date/views
- **Skill Detail** — Embedded video, ratings (1–5 stars), comment section
- **Rating System** — Average rating, duplicate prevention, can't rate your own
- **Like System** — Like/unlike any skill
- **Follow System** — Follow/unfollow creators
- **User Profiles** — Uploaded skills, average rating, follower count
- **Responsive UI** — Clean dark theme, works on mobile

---

## 🛠 Tech Stack

| Layer      | Tech                     |
|-----------|--------------------------|
| Frontend  | React 18, React Router 6, Tailwind CSS |
| Backend   | Node.js, Express          |
| Database  | MongoDB + Mongoose         |
| Auth      | JWT (jsonwebtoken + bcryptjs) |

---

## 📁 Project Structure

```
skillbridge/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Skill.js
│   │   ├── Rating.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── skills.js
│   │   ├── ratings.js
│   │   ├── comments.js
│   │   └── users.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── SkillCard.jsx
│   │   │   └── StarRating.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Explore.jsx
│   │   │   ├── SkillPage.jsx
│   │   │   ├── Upload.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── Profile.jsx
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── package.json
└── README.md
```

---

## ⚙️ Setup & Installation

### Prerequisites
- **Node.js** v18+ — https://nodejs.org
- **MongoDB** running locally, OR a free cloud instance at https://mongodb.com/atlas

---

### Step 1 — Clone / Extract the project

```bash
cd skillbridge
```

---

### Step 2 — Set up the backend

```bash
cd backend
npm install
```

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `backend/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/skillbridge
JWT_SECRET=change_this_to_something_long_and_random
```

> **MongoDB Atlas** (free cloud): Replace MONGO_URI with your Atlas connection string, e.g.
> `MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/skillbridge`

---

### Step 3 — Set up the frontend

```bash
cd ../frontend
npm install
```

The frontend proxies API requests to `http://localhost:5000` automatically (set in `package.json`).

---

### Step 4 — Run the app

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Server running on port 5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
# App running on http://localhost:3000
```

Visit **http://localhost:3000** in your browser. 🎉

---

## 📡 API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET  | `/api/auth/me` | Get current user (auth required) |

### Skills
| Method | Route | Description |
|--------|-------|-------------|
| GET  | `/api/skills` | List with search/filter/sort/pagination |
| GET  | `/api/skills/trending` | Top-rated skills |
| GET  | `/api/skills/recent` | Recently added |
| GET  | `/api/skills/:id` | Get single skill |
| POST | `/api/skills` | Create skill (auth) |
| PUT  | `/api/skills/:id` | Update skill (owner only) |
| DELETE | `/api/skills/:id` | Delete skill (owner only) |
| POST | `/api/skills/:id/like` | Toggle like (auth) |

### Ratings
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/ratings/:skillId` | Rate a skill (auth, 1-5) |
| GET  | `/api/ratings/:skillId/mine` | Get your rating for a skill |

### Comments
| Method | Route | Description |
|--------|-------|-------------|
| GET  | `/api/comments/:skillId` | Get all comments |
| POST | `/api/comments/:skillId` | Post comment (auth) |
| DELETE | `/api/comments/:id` | Delete own comment (auth) |

### Users
| Method | Route | Description |
|--------|-------|-------------|
| GET  | `/api/users/:id` | Get user profile + skills |
| PUT  | `/api/users/me` | Update own profile (auth) |
| POST | `/api/users/:id/follow` | Follow/unfollow user (auth) |

---

## 🎨 UI Pages

| Route | Page |
|-------|------|
| `/` | Home — hero, trending, recent |
| `/explore` | Explore — search, filters, pagination |
| `/skill/:id` | Skill detail — video, rating, comments |
| `/upload` | Upload skill (protected) |
| `/login` | Login |
| `/signup` | Signup |
| `/profile/:id` | User profile |

---

## 💡 Tips

- **YouTube URLs** — supports `watch?v=`, `youtu.be/`, and `/embed/` formats
- **Ratings** — can be updated (upsert), prevents rating own skills
- **Search** — uses MongoDB text index on title, description, tags
- **JWT expiry** — 30 days; stored in localStorage

---

## 🔒 Security Notes (for production)

- Change `JWT_SECRET` to a long random string
- Add rate limiting (`express-rate-limit`)
- Use HTTPS and set proper CORS origins
- Store passwords are hashed with bcrypt (already done ✅)
- Consider moving JWT to httpOnly cookies

---

## 📦 Extending the App

Some ideas to build on top of this MVP:

- **Email verification** on signup
- **Skill playlists** / learning paths
- **Upload video files** directly (use Cloudinary or S3)
- **Notifications** when someone follows or rates your skill
- **Admin dashboard** for moderation

---

Built with ❤️ as an MVP. Ready to extend!
=======
# backend1
# backend1
>>>>>>> db80eb8836fb5f4aac751e40fc526f14b788ca56
