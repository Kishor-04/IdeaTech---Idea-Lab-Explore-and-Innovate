import mongoose from "mongoose";

const rsvpSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const newsletterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  theme: { type: String, required: true },
  guidelines: { type: String, required: true },
  prizes: { type: String, required: true },
  keyDates: { type: String, required: true },
  registrationLink: { type: String, required: true },
  contactInfo: { type: String, required: true },
  poster: { type: String, required: true },
  banner: { type: String, required:true},
  rsvps: [rsvpSchema],
  capacity: { type: Number, default: 50 },
  
});

export default mongoose.model("Newsletter", newsletterSchema);
