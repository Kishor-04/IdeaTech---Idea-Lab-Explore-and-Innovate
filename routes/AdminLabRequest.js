import express from 'express';

import Request from "../models/LabRequest.js";

const router = express.Router();

router.get('/view-admin-requests', async (req, res) => {
    try {
        // Fetch all lab requests
        const labRequests = await Request.find();

        // Fetch all approved requests to get the approved lab names
        const approvedLabNames = await Request.find({ status: 'approved' }).distinct('labName');

        res.render('ViewAdminLabRequests', { labRequests, approvedLabNames });
    } catch (err) {
        console.error('Error fetching lab requests:', err);
        res.status(500).send('Error fetching lab requests');
    }
});


// Approve for labs
router.post('/admin/update-status', async (req, res) => {
    try {
        const { requestId, status } = req.body;

        // Prepare the update object
        const updateData = { status };

        // If the status is approved, set the approvedAt timestamp
        if (status === 'approved') {
            updateData.approvedAt = new Date(); // Set to the current date and time
        }

        if (status === 'rejected') {
            updateData.rejectedAt = new Date(); // Set to the current date and time
        }

        // Update the status (and possibly approvedAt) of the request
        await Request.findByIdAndUpdate(requestId, updateData);

        // Redirect back to the admin panel or requests view
        res.redirect('/view-admin-requests');
    } catch (error) {
        console.error('Error updating request status:', error);
        res.status(500).send('Error updating request status');
    }
});


export default router;