import mongoose from 'mongoose';

// Define the schema for the Message model
const messageSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

export default mongoose.model('Message', messageSchema);