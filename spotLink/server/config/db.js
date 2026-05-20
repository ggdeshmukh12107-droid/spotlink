import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import fs from 'fs';
import path from 'path';
import User from '../models/User.js';
import Society from '../models/Society.js';
import ParkingSpace from '../models/ParkingSpace.js';

let mongoServer;

const seedDB = async () => {
  try {
    // Clear old seeded owner and spaces to prevent duplicate key or schema conflicts
    await User.deleteMany({ email: 'owner@spotlink.com' });
    await ParkingSpace.deleteMany({});

    console.log('🌱 Seeding fresh database with demo parking spaces...');

    // 1. Create a dummy owner
    const owner = await User.create({
      name: 'John Owner',
      email: 'owner@spotlink.com',
      password: 'password123',
      role: 'owner',
      phone: '+91 9999999999',
      vehicleNumber: 'MH 12 AB 1234',
      vehicleType: 'car'
    });

    // 2. Create parking spaces in Pune, Mumbai, Bangalore using exact new schema fields
    await ParkingSpace.create([
      {
        ownerId: owner._id,
        title: 'University Campus – Open Lot, Pune',
        address: 'University Road, Pune, Maharashtra',
        lat: 18.5204,
        lng: 73.8567,
        basePrice: 20,
        type: 'open',
        totalSlots: 100,
        availableSlots: 80,
        amenities: ['lighting', 'security'],
        images: ['https://images.unsplash.com/photo-1506521781263-d8422e82f27a'],
        isActive: true
      },
      {
        ownerId: owner._id,
        title: 'Green Valley Basement, Mumbai',
        address: 'MG Road, Mumbai, Maharashtra',
        lat: 19.0760,
        lng: 72.8777,
        basePrice: 40,
        type: 'basement',
        totalSlots: 20,
        availableSlots: 12,
        amenities: ['covered', 'cctv', 'security', 'ev_charging'],
        images: ['https://images.unsplash.com/photo-1573348722427-f1d6819fdf98'],
        isActive: true
      },
      {
        ownerId: owner._id,
        title: 'TechPark Plaza Visitor Parking, Bangalore',
        address: 'Whitefield Road, Bangalore, Karnataka',
        lat: 12.9698,
        lng: 77.7184,
        basePrice: 60,
        type: 'covered',
        totalSlots: 50,
        availableSlots: 45,
        amenities: ['covered', 'cctv', 'security'],
        images: ['https://images.unsplash.com/photo-1590674899484-d5640e854abe'],
        isActive: true
      }
    ]);

    console.log('✅ Database successfully seeded with new parking spaces!');
  } catch (error) {
    console.error('❌ Seeding Error:', error.message);
  }
};

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;

    // Use in-memory MongoDB if standard is not configured or fails
    if (!uri || uri.includes('a5saake.mongodb.net') || uri.includes('127.0.0.1')) {
      console.log('⚠️  Standard MongoDB is not configured or local service is offline.');
      console.log('🚀 Starting a persistent local MongoDB instance for your session...');
      
      const dbPath = path.resolve('./data/db');
      if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
      }

      mongoServer = await MongoMemoryServer.create({
        instance: {
          dbPath: dbPath,
          storageEngine: 'wiredTiger',
        }
      });
      uri = mongoServer.getUri();
      console.log(`✅ Persistent Local MongoDB running at: ${uri}`);
      console.log(`📂 Database files are stored in: ${dbPath}`);
    }

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Clean up obsolete database indexes (like bookingCode_1) that cause duplicate key errors
    try {
      const collections = await conn.connection.db.listCollections().toArray();
      const bookingsExists = collections.some(c => c.name === 'bookings');
      if (bookingsExists) {
        const indexes = await conn.connection.db.collection('bookings').indexes();
        const hasBookingCodeIndex = indexes.some(idx => idx.name === 'bookingCode_1');
        if (hasBookingCodeIndex) {
          console.log('🧹 Cleaning up obsolete unique index bookingCode_1 from bookings...');
          await conn.connection.db.collection('bookings').dropIndex('bookingCode_1');
          console.log('✅ Successfully dropped obsolete index bookingCode_1!');
        }
      }
    } catch (err) {
      console.log('⚠️ Obsolete index cleanup skip/error:', err.message);
    }

    // Auto-seed the database
    await seedDB();
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
