
---

# 🏢 EstateEase – Building Management System

**Live Site**: [https://estate-ease-2k25.web.app/](https://estate-ease-2k25.web.app/)

EstateEase is a modern, web-based Building Management System designed to streamline apartment rentals, tenant/member management, payment handling, and administrative control. With built-in features like secure authentication, role-based dashboards, and Stripe-powered payments, EstateEase brings efficiency and ease to property management.

---

## 📑 Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Installation](#installation)
* [Environment Variables](#environment-variables)
* [Usage](#usage)
* [Admin Access](#admin-access)
* [Examples](#examples)
* [Troubleshooting](#troubleshooting)
* [Contributors](#contributors)
* [License](#license)

---

## ✨ Features

* 🔐 **User Authentication**
  Supports secure login via email/password and Google OAuth.

* 👥 **Role-Based Dashboards**
  Custom dashboards for **Users**, **Members**, and **Admins**.

* 🏠 **Apartment Listings**
  View available units with search and pagination.

* 📝 **Rental Agreements**
  Users can request to rent apartments through an agreement process.

* 💳 **Payment System**
  Members can pay rent via Stripe and apply coupon codes for discounts.

* 📣 **Announcements**
  Admins can post important notices viewable by all users.

* 🎟️ **Coupon Management**
  Admins can create and manage discount codes.

* 👤 **Member Management**
  Admins can approve/reject tenant agreements and manage resident data.

* 🌐 **Responsive Design**
  Fully optimized for mobile, tablet, and desktop screens.

---

## 🛠️ Tech Stack

### Frontend

* **React**
* **Tailwind CSS**
* **TanStack React Query**
* **Firebase Authentication**

### Backend

* **Node.js**
* **Express.js**
* **MongoDB**
* **JWT (JSON Web Tokens)**

### Payments

* **Stripe API**

---

## 📦 Notable NPM Packages

| Package                | Purpose                          |
| ---------------------- | -------------------------------- |
| `react-router-dom`     | Routing                          |
| `firebase`             | Authentication                   |
| `tanstack/react-query` | Data fetching & caching          |
| `axios`                | HTTP requests                    |
| `react-toastify`       | Toast notifications              |
| `sweetalert2`          | Beautiful alerts & modals        |
| `jsonwebtoken`         | Token-based authentication (JWT) |
| `dotenv`               | Environment variable management  |
| `stripe`               | Payment integration              |

---

## 🧰 Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/estateease.git
   cd estateease
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

> ⚠️ Make sure your backend server is running and connected to MongoDB before using the frontend.

---

## 🔐 Environment Variables

Create a `.env` file in both your frontend and backend directories with the following values:

### Frontend `.env`:

```
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
...
```

### Backend `.env`:

```
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
```

---

## 🚀 Usage

Once installed and running:

* Users can **browse apartments** and request to rent them.
* Members can **pay rent**, **view history**, and **apply coupons**.
* Admins have full control to **manage users, approve agreements**, and **post announcements**.

---

## 🔑 Admin Access

> Use these credentials to access the admin dashboard:

* **Username:** `admin@gmail.com`
* **Password:** `1234aA@`

---

## 🧪 Examples

* A **User** requests to rent an apartment → **Admin** approves → **User** becomes a **Member**.
* A **Member** views an announcement posted by **Admin**.
* A **Member** enters a coupon code at payment checkout and sees the discounted amount via **Stripe**.

---

## 🛠️ Troubleshooting

| Issue                             | Solution                               |
| --------------------------------- | -------------------------------------- |
| Firebase errors                   | Check API keys and auth settings       |
| Payments not working              | Ensure Stripe keys are valid           |
| Backend not connecting to MongoDB | Verify `MONGO_URI` and database status |
| CORS issues                       | Allow frontend origin in backend CORS  |

---
