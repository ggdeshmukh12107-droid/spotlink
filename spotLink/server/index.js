import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import parkingRoutes from './routes/parkingRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import guestParkingRoutes from './routes/guestParkingRoutes.js';
import societyRoutes from './routes/societyRoutes.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const httpServer = createServer(app);

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io accessible in routes
app.set('io', io);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/parking', parkingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/guest-parking', guestParkingRoutes);
app.use('/api/societies', societyRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'SpotLink API is running 🅿️' });
});

// Error handler
app.use(errorHandler);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  // Join a parking space room (for live updates)
  socket.on('join-space', (spaceId) => {
    socket.join(`space-${spaceId}`);
    console.log(`User ${socket.id} joined space-${spaceId}`);
  });

  // Join society room (for guest parking alerts)
  socket.on('join-society', (societyId) => {
    socket.join(`society-${societyId}`);
    console.log(`User ${socket.id} joined society-${societyId}`);
  });

  // Vacate alert
  socket.on('vacate-alert', (data) => {
    io.to(`space-${data.spaceId}`).emit('spot-available', {
      spaceId: data.spaceId,
      estimatedLeaveTime: data.estimatedLeaveTime,
      message: 'A spot is about to become available!'
    });
  });

  // Guest parking alert
  socket.on('guest-parking-alert', (data) => {
    io.to(`society-${data.societyId}`).emit('guest-alert', data);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════╗
  ║     🅿️  SpotLink Server Running          ║
  ║     Port: ${PORT}                          ║
  ║     Mode: ${process.env.NODE_ENV || 'development'}               ║
  ╚═══════════════════════════════════════════╝
  `);
});
