import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✓ Connected successfully to MongoDB Atlas (caveno_db)`);
  } catch (error) {
    console.error(`✕ MongoDB Atlas Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
