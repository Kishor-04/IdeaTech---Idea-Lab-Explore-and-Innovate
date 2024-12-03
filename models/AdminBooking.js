import mongoose from 'mongoose';

const adminBookingSchema = new mongoose.Schema({
  machineName: {
    type: String,
    required: true,
    unique: true,
  },
  machineStatus: {
    type: String,
    enum: ['Available','Maintenance', 'Closed'],
    default: 'Available',
  },
  schedule: [{
    studentEmail: String,
    startTime: Date,
    endTime: Date,
  }],
});

const AdminBooking = mongoose.model('AdminBooking', adminBookingSchema);

export default AdminBooking;
