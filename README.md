# 🚗 AutoHub – Backend API

The backend REST API for **AutoHub**, a full-stack car e-commerce platform.

Built with Node.js, Express.js, MongoDB, Mongoose, and JWT authentication.

## 🌐 Live Project

### 👉 [🚗 Visit AutoHub](https://6aae71a1699140f1b8a808ff--autohub-28d0b6.netlify.app/)

## 🔗 Backend API

### 👉 [⚙️ AutoHub Backend API](https://autohub-server-woz6.onrender.com)

## 💻 GitHub Repositories

* **Frontend:** [AutoHub Client](https://github.com/Karthikeya20020321/Autohub-client)
* **Backend:** [AutoHub Server](https://github.com/Karthikeya20020321/Autohub-server)

---

## 🛠️ Technologies Used

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Axios API integration
* Express Validator
* CORS
* dotenv
* Nodemon

---

## ✨ Backend Features

* 🔐 User Registration
* 🔑 User Login
* 🛡️ JWT Authentication
* 👤 User Profile
* 🚗 Car Management
* 🔎 Car Listings
* 📄 Car Details
* ❤️ Wishlist
* 📅 Car Booking
* 🏷️ Sell Car
* 🔒 Protected Routes
* ✅ Request Validation
* 💾 MongoDB Database Integration
* 🌐 RESTful API
* ☁️ Cloud Deployment

---

## 🏗️ Application Architecture

```text
                 ┌──────────────────────┐
                 │     React + Vite     │
                 │      Frontend        │
                 │       Netlify        │
                 └──────────┬───────────┘
                            │
                            │ REST API
                            ▼
                 ┌──────────────────────┐
                 │   Node.js + Express  │
                 │       Backend        │
                 │       Render         │
                 └──────────┬───────────┘
                            │
                            │ Mongoose
                            ▼
                 ┌──────────────────────┐
                 │    MongoDB Atlas     │
                 │       Database       │
                 └──────────────────────┘
```

---

## 📁 Project Structure

```text
server
│
├── config
│   └── db.js
│
├── controllers
│   ├── authController.js
│   └── ...
│
├── middleware
│   └── authMiddleware.js
│
├── models
│   ├── User.js
│   └── ...
│
├── routes
│   ├── authRoutes.js
│   └── ...
│
├── services
│   └── ...
│
├── scripts
│   └── createAdmin.js
│
├── utils
│   └── ...
│
├── validators
│   └── ...
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

---

## 🔐 Authentication

AutoHub uses **JWT-based authentication**.

### Authentication Flow

```text
User
 ↓
Register / Login
 ↓
Backend validates credentials
 ↓
JWT token generated
 ↓
Token stored by frontend
 ↓
Token sent with protected API requests
 ↓
Backend verifies JWT
 ↓
Authorized request
```

Passwords are securely hashed using **bcryptjs** before being stored.

---

## 🗄️ Database

AutoHub uses **MongoDB Atlas** as the cloud database.

MongoDB is connected to the Express server using **Mongoose**.

The application stores information such as:

* Users
* Cars
* Bookings
* Wishlist data
* Seller information

---

## 🌐 API Server

Production backend:

**https://autohub-server-woz6.onrender.com**

The frontend communicates with the backend using REST API requests.

---

## 🔐 Environment Variables

Create a `.env` file in the server directory:

```text
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=your_frontend_url
```

⚠️ **Never commit `.env` to GitHub.**

Do not expose:

* MongoDB connection strings
* Database passwords
* JWT secrets
* Admin passwords
* API keys

Use `.env.example` for safe configuration documentation.

---

## ▶️ Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/Karthikeya20020321/Autohub-server.git
```

### 2. Enter the project

```bash
cd Autohub-server
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file and add your MongoDB and JWT configuration.

### 5. Start the development server

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

---

## 🚀 Production Deployment

| Component | Platform      |
| --------- | ------------- |
| Frontend  | Netlify       |
| Backend   | Render        |
| Database  | MongoDB Atlas |

### Production URLs

**Frontend**

https://rococo-kulfi-28d0b6.netlify.app/

**Backend**

https://autohub-server-woz6.onrender.com

---

## 🎯 Project Highlights

* Developed a complete RESTful backend for a car e-commerce platform.
* Implemented JWT-based authentication and protected routes.
* Integrated MongoDB Atlas using Mongoose.
* Implemented secure password hashing with bcryptjs.
* Built API endpoints for cars, users, bookings, and wishlist functionality.
* Added request validation using Express Validator.
* Configured CORS for frontend-backend communication.
* Deployed the backend API using Render.
* Connected the production backend with the React frontend hosted on Netlify.

---

## 👨‍💻 Developer

**Karthik Reddy**

Full Stack Developer

### 🔗 Project Links

**🚗 Live AutoHub Project**
https://6aae71a1699140f1b8a808ff--autohub-28d0b6.netlify.app/

**💻 Frontend Repository**
https:
