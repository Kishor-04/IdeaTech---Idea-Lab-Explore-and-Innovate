import mongoose from 'mongoose';

// Define the schema for the Message model
const adminSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  is_admin: {
    type: Number,
    required: true
  },
  is_verified: {
    type: Number,
    default: 0
  }
});

export default mongoose.model('Admin', adminSchema);
