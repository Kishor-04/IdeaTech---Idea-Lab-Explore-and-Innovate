// routes/StudentLabRequest.js

import express from 'express';
import multer from 'multer';
import path from 'path';
import cron from 'node-cron';

import Request from '../models/LabRequest.js'; // Import your model

const router = express.Router();

// Set up multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder to store uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Use unique filename
    }
});

// File filter for PDFs
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

// Handle the form POST request, including file upload
router.post('/submit-lab-request', upload.single('pdfDocument'), async (req, res) => {
    try {
        if (req.session.student_id) {
            const { clubName, date, time, members, competition, labName } = req.body;

            // Get the file path for the uploaded permission letter
            const permissionLetterPath = req.file ? req.file.path : null;

            // Create a new request document
            const newRequest = new Request({
                clubName,
                timing: [{
                    days: date,  // Storing the date as 'days' in schema
                    time
                }],
                members,
                competition,
                labName,
                permissionLetter: permissionLetterPath,  // Add the file path to the schema
                studentId: req.session.student_id
            });

            // Save the document to the database
            await newRequest.save();

            // Send a response back to the client
            res.redirect('/lab-request?message=success');
        } else {
            res.status(401).send('You must be logged in to submit a lab request.');
        }
    } catch (error) {
        console.error('Error submitting lab request:', error);
        res.status(500).send('Error submitting lab request');
    }
});

router.get('/LabRequest' ,(req,res)=>{
    res.redirect('/lab-request');
})

//LabName management
router.get('/lab-request', async (req, res) => {
    try {
        if (!req.session.student_id) {
            return res.redirect('/login');
        }

        // Fetch all approved lab requests to disable those lab options
        const approvedRequests = await Request.find({ status: 'approved' }).select('labName');

        // Extract the lab names of approved requests
        const approvedLabs = approvedRequests.map(request => request.labName);

        // Pass the actual `approvedLabs` to the template instead of an empty array
        res.render('LabRequest', { approvedLabs, message: req.query.message });
    } catch (error) {
        console.error('Error loading lab request form:', error);
        res.status(500).send('Error loading lab request form.');
    }
});

//View Requests route
router.get('/view-requests', async (req, res) => {
    try {
        if (req.session.student_id) {
            // Fetch the lab requests for the logged-in student
            const studentId = req.session.student_id;
            const labRequests = await Request.find({ studentId });

            res.render('ViewLabRequests', { labRequests });
        } else {
            res.redirect('/login'); // If the user is not logged in, redirect to the login page
        }
    } catch (err) {
        console.error('Error fetching lab requests:', err);
        res.status(500).send('Error fetching lab requests');
    }
});


// Cron job to mark approved requests as expired if the timing has passed
cron.schedule('* * * * *', async () => { // Runs every minute
    try {
        const currentDate = new Date();

        // Find approved requests where the timing (date and time) has passed
        const requestsToExpire = await Request.find({
            status: 'approved',
            $or: [
                {
                    'timing.days': { $lt: currentDate.toISOString().split('T')[0] } // Date is in the past
                },
                {
                    'timing.days': { $eq: currentDate.toISOString().split('T')[0] }, // Same day
                    'timing.time': { $lt: currentDate.toTimeString().split(' ')[0] } // Time has passed
                }
            ]
        });

        // Expire requests
        for (const request of requestsToExpire) {
            request.status = 'expired'; // Mark as expired
            request.expiredAt = currentDate; // Set the expiration date
            await request.save();
            console.log(`Request ID ${request._id} marked as expired.`);
        }
    } catch (err) {
        console.error('Error expiring requests:', err);
    }
});


// Cron job to delete expired requests 10 days after expiration
cron.schedule('* * * * *', async () => {
    const currentDate = new Date();
    const tenDaysAgo = new Date(currentDate.getTime() - 10 * 24 * 60 * 60 * 1000); // 10 days ago

    // 1. Handle pending requests
    try {
        const pendingRequestsToDelete = await Request.find({
            status: 'pending',
            createdAt: { $lt: tenDaysAgo }
        });

        for (const request of pendingRequestsToDelete) {
            await Request.deleteOne({ _id: request._id });
            console.log(`Pending request ID ${request._id} deleted.`);
        }
    } catch (err) {
        console.error('Error deleting pending requests:', err);
    }

    // 2. Handle rejected requests
    try {
        const rejectedRequestsToDelete = await Request.find({
            status: 'rejected',
            rejectedAt: { $lt: tenDaysAgo }
        });

        for (const request of rejectedRequestsToDelete) {
            await Request.deleteOne({ _id: request._id });
            console.log(`Rejected request ID ${request._id} deleted.`);
        }
    } catch (err) {
        console.error('Error deleting rejected requests:', err);
    }

    // 3. Handle expired requests
    try {
        const expiredRequestsToDelete = await Request.find({
            status: 'expired',
            expiredAt: { $lt: tenDaysAgo }
        });

        for (const request of expiredRequestsToDelete) {
            await Request.deleteOne({ _id: request._id });
            console.log(`Expired request ID ${request._id} deleted.`);
        }
    } catch (err) {
        console.error('Error deleting expired requests:', err);
    }
});


export default router;
