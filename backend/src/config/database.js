import mongoose from 'mongoose';

/**
 * Establish connection to MongoDB via Mongoose.
 * 
 * Strict safety rules:
 * - Reads process.env.MONGODB_URI
 * - Fails clearly if MONGODB_URI is missing
 * - Logs safe success message without exposing connection strings or passwords
 * - Catches and sanitizes any connection errors
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables. Please check your .env file.');
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected successfully [Host: ${conn.connection.host}]`);
    return conn;
  } catch (error) {
    // Sanitize any URI / credentials that could appear in MongoDB driver error messages
    const sanitizedMessage = error.message
      ? error.message.replace(/mongodb(\+srv)?:\/\/[^@]+@/gi, 'mongodb$1://<credentials>@')
      : 'Unknown database connection error';

    console.error(`[Database Error] Failed to connect to MongoDB: ${sanitizedMessage}`);
    throw error;
  }
};

export default connectDB;
