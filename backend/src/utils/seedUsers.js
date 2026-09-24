import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from '../config/database.js';
import User from '../models/User.js';

const DEMO_PASSWORD = 'demo123';

const demoUsers = [
  {
    name: 'Demo Student',
    email: 'student@athletica.demo',
    role: 'student'
  },
  {
    name: 'Demo Teacher',
    email: 'teacher@athletica.demo',
    role: 'teacher'
  }
];

const seed = async () => {
  try {
    await connectDB();

    console.log('Seeding demo accounts...');
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, saltRounds);

    for (const demoUser of demoUsers) {
      await User.findOneAndUpdate(
        { email: demoUser.email },
        {
          name: demoUser.name,
          email: demoUser.email,
          passwordHash,
          role: demoUser.role
        },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      );
      console.log(`- Seeded account: ${demoUser.email} (Role: ${demoUser.role})`);
    }

    console.log('Demo accounts seeded successfully.');
    console.log(`Default password for demo accounts: ${DEMO_PASSWORD}`);
  } catch (error) {
    console.error(`[Seeding Error] ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('Database disconnected after seeding.');
  }
};

seed();
