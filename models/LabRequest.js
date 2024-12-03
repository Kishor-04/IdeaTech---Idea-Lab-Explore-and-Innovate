import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    clubName: {
        type: String,
        required: true
    },
    timing: [{
        days: {
            type: String,
            required: true
        },
        time: {
            type: String,
            required: true
        }
    }],
    members: {
        type: Number,
        required: true
    },
    competition: { 
        type: String,
        required: true
    },
    labName: {
        type: String,
        required: true
    },
    permissionLetter: { 
        type: String,
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'expired'],
        default: 'pending'
    },
    approvedAt: {
        type: Date,
        default: null // This will be set when the request is approved
    },
    expiredAt: {
        type: Date,
        default: null // This will be set when the request is marked as expired
    },
    rejectedAt: {
        type: Date,
        default: null // This will be set when the request is rejected
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Request = mongoose.model('Request', requestSchema);
export default Request;
