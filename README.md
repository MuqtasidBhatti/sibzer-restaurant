# Sibzer — Full Stack Restaurant Web App

A production-ready restaurant web application built with the MERN stack. Includes a customer-facing site and a full admin panel.

**Live Demo:** https://sibzer-restaurant-flra.vercel.app/

---

## Tech Stack

**Frontend:** React (Vite), Tailwind CSS, Zustand, Framer Motion, Lucide React  
**Backend:** Node.js, Express.js, MongoDB (Mongoose)  
**Auth:** JWT (JSON Web Tokens)  
**Image Uploads:** Cloudinary  
**Payments:** JazzCash, EasyPaisa, Cash on Delivery, Credit/Debit Card  

---

## Features

### Customer Side
- Browse menu with category filters, dietary tags (Halal, Vegan, Spicy, etc.), and search
- Add to cart, adjust quantities, view subtotal + 5% GST
- Checkout with order type: Delivery, Pickup, or Dine-In
- Multiple payment methods including JazzCash and EasyPaisa
- JWT-based auth (Register / Login)
- My Profile page (update name and phone)
- Order History with real-time status tracking
- Contact page with message form

### Admin Panel (`/admin`)
- Dashboard with revenue and order charts (last 7 days)
- Top 5 selling items
- Pending orders and reservations count
- Menu Items management (add, edit, delete, Cloudinary image upload)
- Categories management
- Orders pipeline with status updates (Pending → Confirmed → Preparing → Ready → Out for Delivery → Completed)
- Coupon system
- Users management
- Messages inbox

---

## Folder Structure

```
Sibzer's Website/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── public/
│   │   │   └── user/
│   │   ├── services/
│   │   ├── store/
│   │   └── utils/
│   └── package.json
└── .gitignore
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)
- Cloudinary account (free tier works)

---

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder. Use `.env.example` as reference:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend:

```bash
npm run dev
```

Backend runs on `http://localhost:5000`

---

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## Creating an Admin Account

After registering a user normally, go to your MongoDB Atlas collection, find the user document, and manually set:

```json
"role": "admin"
```

That user will now see the **Admin Panel** link in the navbar dropdown.

---

## Deployment Notes

- Frontend is deployed on **Vercel** — set `VITE_API_URL` as an environment variable in Vercel project settings
- Backend can be deployed on **Render** or **Railway** — add all `.env` variables in their dashboard
- Make sure to whitelist your frontend domain in MongoDB Atlas → Network Access

---

## License

This source code is for personal and commercial use. Do not resell or redistribute the source code itself.