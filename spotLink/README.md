1# 🅿️ SpotLink — Smart Decentralized Parking System

> Predictive Allocation · Society Conflict Management · Dynamic Pricing · Blockchain Secured

SpotLink is a smart parking management system designed to solve urban parking challenges in residential societies and densely populated areas. Discover, book, and monetize unused parking spaces with real-time availability, dynamic pricing, and tamper-proof blockchain transaction records.

---

## 🌟 Key Features

- **🔍 Parking Discovery** — Search nearby parking with filters, dynamic pricing display
- **📈 Dynamic Pricing** — `Price = BasePrice × DemandFactor` based on time, location, demand
- **🏢 Guest Parking** — Residents pre-assign guest slots with QR/code verification
- **🚨 Conflict Detection** — Unauthorized parking alerts and violation tracking
- **🔗 Blockchain Ledger** — Booking records on Ethereum Sepolia for transparency
- **📡 Live Alerts** — Real-time vacate notifications via Socket.io
- **💰 Monetization** — Owners earn from unused spaces with analytics dashboard
- **🔮 Predictive AI** — Historical data analysis for availability predictions

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js (Vite), Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT + bcrypt |
| Real-time | Socket.io |
| Blockchain | Solidity, Hardhat, **Sepolia Testnet** |
| Hosting | Vercel (FE), Render (BE) |

---

## 📁 Project Structure

```
spotLink/
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
│   ├── config/            # MongoDB connection
│   ├── controllers/       # Auth, Parking, Booking, Guest, Society
│   ├── middleware/         # JWT auth, error handler
│   ├── models/            # Mongoose schemas (6 models)
│   ├── routes/            # Express API routes
│   └── index.js           # Server entry + Socket.io
│
├── blockchain/      # Solidity Smart Contracts
│   ├── contracts/         # SpotLinkLedger.sol
│   ├── scripts/           # Deployment script
│   └── hardhat.config.js  # Sepolia network config
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- MetaMask wallet (for blockchain features)

### 1. Clone & Install

```bash
git clone <repo-url>
cd spotLink

# Install backend
cd server && npm install

# Install frontend
cd ../client && npm install

# Install blockchain
cd ../blockchain && npm install
```

### 2. Configure Environment Variables

**`server/.env`**
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/spotlink
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

**`blockchain/.env`**
```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
PRIVATE_KEY=your_wallet_private_key
ETHERSCAN_API_KEY=your_etherscan_key
```

### 3. Run the App

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

Open **http://localhost:5173** in your browser.

### 4. Deploy Smart Contract (Optional)

```bash
cd blockchain

# Compile
npx hardhat compile

# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia
```

---

## 👥 User Roles

| Role | Capabilities |
|------|-------------|
| **Driver** | Search parking, book slots, receive alerts |
| **Owner** | List spaces, manage availability, earn revenue |
| **Admin** | Manage society policies, approve guests, monitor violations |

---

## 🔄 System Workflows

**Driver:** Login → Search → View dynamic price → Book → Park

**Owner:** Login → Add parking → Set availability → Earn revenue

**Guest Parking:** Resident → Register guest → Assign slot → Guest parks → System verifies

**Pricing:** System evaluates demand → Applies multiplier → Displays updated price

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/parking` | Search parking spaces |
| POST | `/api/bookings` | Create booking |
| POST | `/api/guest-parking` | Register guest |
| POST | `/api/guest-parking/verify` | Verify guest code |
| GET | `/api/bookings/my-bookings` | User's bookings |

---

## 🔗 Blockchain (Sepolia)

The `SpotLinkLedger` smart contract stores:
- Booking ID, User & Owner addresses
- Payment amount & timestamp
- Transaction status

**Purpose:** Prevent data tampering, provide proof of transactions, enable dispute resolution.

---

## 📄 License

MIT License — © 2026 SpotLink
