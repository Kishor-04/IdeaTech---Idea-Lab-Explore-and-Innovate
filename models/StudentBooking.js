import mongoose from 'mongoose';

const studentBookingSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  machineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminBooking',
    required: true,
  },
  setTime: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  timeOverAt: {
    type: Date,
    required: true,
  },
  statusMachine: {
    type: String,
    default: 'Available',
  },
  emailSent: { // New field to track email sent status
    type: Boolean,
    default: false,
  },
  studentId: { // New field to track the ID of the student who made the booking
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student', // Assuming you have a Student model
    required: true,
  },
});

const StudentBooking = mongoose.model('StudentBooking', studentBookingSchema);

export default StudentBooking;
