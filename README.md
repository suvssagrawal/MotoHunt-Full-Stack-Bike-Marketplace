# 🏍️ MotoHunt - Premium Motorcycle Aggregator

![MotoHunt](https://img.shields.io/badge/MotoHunt-v2.0.0-orange?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-blue?style=for-the-badge&logo=tailwindcss)

**MotoHunt** is a state-of-the-art motorcycle marketplace platform engineered for enthusiasts. It combines a robust backend with a **premium, glassmorphic UI**, offering an immersive experience for discovering, comparing, and booking test rides for the latest motorcycles in India.

---

## ✨ Key Features

### 🎨 Premium UI/UX (New!)
- **Glassmorphism Design**: Modern, translucent aesthetic with background blurs and neon glowing effects.
- **Smooth Animations**: Scroll-triggered reveals, magnetic buttons, and parallax backgrounds.
- **Interactive Elements**: Hover cards, 3D tilts, and fluid page transitions.
- **Loading States**: Custom skeletons, spinners, and progress indicators for a seamless feel.

### 🔍 Discovery & Analysis
- **Advanced Filtering**: Filter by Price, Brand, Type, and Engine CC with real-time updates.
- **Smart Search**: Instant results with no page reloads.
- **Comparison Engine**: Compare 2 bikes side-by-side with **automated difference highlighting** (Green/Red indicators).
- **Infinite Scrolling**: Optimized pagination for browsing large inventories.

### 👤 User Interaction
- **Secure Authentication**: JWT-based Login/Register with session persistence.
- **Real-time Validation**: Interactive forms with floating labels and instant feedback.
- **Toast Notifications**: Non-intrusive success/error alerts for all actions.
- **Wishlist**: Save your favorite bikes locally (persists across sessions).
- **Test Ride Booking**: Seamless booking flow with date pickers and confirmation dialogs.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Custom CSS Modules (Glassmorphism/Animations)
- **State Management**: React Context API (`AuthContext`, `ToastContext`, `WishlistContext`)
- **Icons**: Heroicons / Emoji primitives

### Backend
- **Server**: Node.js + Express.js
- **Database**: SQLite (Lightweight, zero-config)
- **Security**: `bcryptjs` (Hashing), `jsonwebtoken` (Auth), `cors`
- **API**: RESTful architecture with pagination

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### 1. Clone & Install
```bash
git clone <repository-url>
cd "MotoHunt Website"
```

### 2. Backend Setup
```bash
cd backend
npm install
npm start
```
*Server runs at `http://localhost:5000`*

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
*Client runs at `http://localhost:3000`*

---

## 🚀 Application Tour

### 1. Homepage
Paradigm-shifting hero section with parallax showroom background, animated statistics, and trending bikes carousel.

### 2. Browse Bikes (`/bikes`)
Grid view of all motorcycles with sidebar filters. Features skeleton loading and "Add to Wishlist" toggle.

### 3. Smart Comparison (`/compare`)
Select any two bikes to see a detailed spec comparison. The system automatically highlights the winner in each category (e.g., Higher Mileage = Green).

### 4. Bike Detail (`/bikes/:id`)
Immersive product page with:
- Full-screen image gallery
- Specifications tab view
- Sticky "Book Test Ride" widget
- Related bikes recommendations

---

## 📂 Project Structure

```
├── backend/
│   ├── database/       # SQLite db and seed scripts
│   ├── routes/         # API endpoints (bikes, auth, test-rides)
│   └── server.js       # Entry point
│
├── frontend/
│   ├── app/            # Next.js App Router pages
│   ├── components/     # Reusable UI components
│   │   ├── FloatingLabelInput.jsx  # Modern form inputs
│   │   ├── BikeCard.jsx            # Product display
│   │   ├── Modal.jsx               # Dialog system
│   │   └── ToastNotification.jsx   # Alert system
│   └── context/        # Global state providers
```

---



## 🤝 Contributing
This is a portfolio project demonstrating advanced full-stack capabilities. Feel free to fork and submit PRs!

## 📄 Author
Created by **Suvan Agrawal**.
