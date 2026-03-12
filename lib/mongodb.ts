import mongoose from 'mongoose';

// Define the connection object type
type MongooseConnection = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Extend the global object to include our cached connection
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseConnection | undefined;
}

// Retrieve MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// Validate that MongoDB URI is provided
if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Global cache for the MongoDB connection.
 * In development, Next.js hot reloads can create multiple connections.
 * Caching prevents connection exhaustion by reusing existing connections.
 */
let cached: MongooseConnection = global.mongoose || {
  conn: null,
  promise: null,
};

// Initialize the global cache if it doesn't exist
if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Establishes and returns a cached MongoDB connection.
 * Reuses existing connections to prevent connection pool exhaustion.
 * 
 * @returns Promise<typeof mongoose> - The Mongoose instance
 */
async function connectDB(): Promise<typeof mongoose> {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create new connection promise if one doesn't exist
  if (!cached.promise) {
    const options = {
      bufferCommands: false, // Disable Mongoose buffering
    };

    cached.promise = mongoose.connect(MONGODB_URI, options).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    // Wait for the connection to be established and cache it
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset the promise on error to allow retry on next call
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
