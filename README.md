# 🅿️ SpotLink — Smart Decentralized Parking System

> Predictive Allocation · Society Conflict Management · Dynamic Pricing · Blockchain Secured · Intelligent India-wide Geocoding

SpotLink is a smart parking management system designed to solve urban parking challenges in residential societies and densely populated areas. Discover, book, and monetize unused parking spaces with real-time availability, dynamic pricing, and tamper-proof blockchain transaction records.

---

## 🌟 Key Features & Custom Innovations

### 🚀 1. Real-Time Dynamic Search & Indian Geocoder
- **Extensive Metro & City Support:** Precise geocoding coords mapped natively for major Indian tech hubs (Pune, Goa, Mumbai, Bangalore, Delhi, Hyderabad, Chennai, Kolkata, and Lonavala).
- **India-Wide Deterministic Fallback:** Any unmatched query undergoes character-hash conversion into a fully unique mathematical lat/lng fallback within India (`8.0N to 35.0N` and `68.0E to 97.0E`), ensuring dynamic seeding coordinates are always generated and never collide.
- **Live React Dynamic Filter Reload:** Selecting options like Space Type or Vehicle Type **instantly** updates the results on the screen in real-time, eliminating the need to click "Search" repeatedly!
- **Keyboard "Enter" Key Support:** Wrapped in an HTML5 form, you can search and submit query commands seamlessly using the standard keyboard `Enter` shortcut.

### ⚡ 2. Guaranteed Dynamic Seeding Engine
- **No Empty Screens:** If a user searches with strict filters (e.g., maximum budget, covered spaces, EV charging, or bike compatibility) and no matched spots are in MongoDB, the engine **automatically seeds a customized premium spot on-the-fly** matching those criteria exactly. Users are guaranteed a relevant booking target every time!

### 🔒 3. Safe Authentication & Protected Workflows
- **Dynamic User Roles:** Tailored sign-up flows for **Drivers** and **Owners**. Owners are spared from entering vehicle details (vehicle number and type selectors are completely hidden for the Owner role).
- **Protected Booking Path:** Wrapped the booking route `/book/:id` in a secured `<ProtectedRoute>` component to ensure zero booking interactions occur prior to authentication.
- **Auto DateTime Pre-population:** Pre-populates the booking datetimes locally to the current minute and sets standard reservation durations (+2 hours), resolving local validation mismatches.
- **Obsolete Index Auto-Purger:** Seamlessly scans, detects, and drops outdated index constraints (like `bookingCode_1`) on database boot to avoid schema blocking.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js (Vite), Vanilla CSS, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose Schema Architecture) |
| **Auth** | JWT + bcrypt |
| **Real-time** | Socket.io |
| **Blockchain** | Solidity, Hardhat, **Sepolia Testnet** |

---

## 📁 Project Structure

```
spotLink (2)/
├── package.json         # Root scripts runner
├── TESTING.md           # Operational testing workflows
├── .gitignore           # Smart dependency and database excluder
└── spotLink/            # Core Project Directory
    ├── client/          # React + Vite Frontend
    │   ├── src/
    │   │   ├── components/    # UI components (layout, parking, booking, guest)
    │   │   ├── pages/         # Route pages (Home, Search, Book, Dashboard...)
    │   │   ├── context/       # Auth context provider
    │   │   ├── services/      # API service layer (Axios)
    │   │   └── index.css      # Design system (Tailwind + custom)
    │   └── vite.config.js
    │
    ├── server/          # Node.js + Express Backend
    │   ├── config/            # MongoDB connection + index cleanup
    │   ├── controllers/       # Auth, Parking, Booking, Guest, Society
    │   ├── middleware/         # JWT auth, error handler
    │   ├── models/            # Mongoose schemas (6 models)
    │   ├── routes/            # Express API routes
    │   └── index.js           # Server entry + Socket.io
    │
    └── blockchain/      # Solidity Smart Contracts
        ├── contracts/         # SpotLinkLedger.sol
        ├── scripts/           # Deployment script
        └── hardhat.config.js  # Sepolia network config
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB local service or MongoDB Atlas account
- MetaMask wallet (for blockchain features)

### 1. Clone & Install dependencies

```bash
cd spotLink/server && npm install
cd ../client && npm install
cd ../blockchain && npm install
```

### 2. Configure Environment Variables

**`spotLink/server/.env`**
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/spotlink
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

### 3. Run the App
From the root workspace folder `spotLink (2)`:
```bash
# Start the full-stack system locally
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📄 License

MIT License — © 2026 SpotLink
