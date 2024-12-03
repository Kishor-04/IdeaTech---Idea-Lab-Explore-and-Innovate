// routes/adminBooking.js
import express from 'express';
import AdminBooking from '../models/AdminBooking.js';
import StudentBooking from '../models/StudentBooking.js';
import nodemailer from 'nodemailer';
import schedule from 'node-schedule';
import { Parser } from 'json2csv';
import cron from 'node-cron';

const router = express.Router();

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'patilkrisha04@gmail.com',
        pass: 'cqwr jnru amsr jooz',
    },
});

// Function to send reminder email
const sendEmailReminder = (email, machineName, setTime) => {
    const mailOptions = {
        from: 'patilkrisha04@gmail.com',
        to: email,
        subject: 'Booking Reminder',
        text: `Dear Student,\n\nThis is a reminder that you have booked the machine "${machineName}" on ${setTime}.\n\nBest Regards,\nYour Booking System`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

// Schedule task to send email reminders
schedule.scheduleJob('* * * * *', async () => {
    try {
        const upcomingBookings = await StudentBooking.find({
            setTime: { $gte: new Date(), $lt: new Date(Date.now() + 10 * 60 * 1000) },
            emailSent: false,
        }).populate('machineId');

        for (const booking of upcomingBookings) {
            await sendEmailReminder(booking.email, booking.machineId.machineName, booking.setTime);
            booking.emailSent = true;
            await booking.save();
        }
    } catch (err) {
        console.error('Error fetching upcoming bookings:', err.message);
    }
});

// Admin route - Show machine list and dynamic schedule
router.get('/adminBooking', async (req, res) => {
    try {
        const machines = await AdminBooking.find({});
        const bookings = await StudentBooking.find({}).populate('machineId');
        res.render('adminBooking', { machines, bookings });
    } catch (err) {
        console.error('Error fetching machines or bookings:', err.message);
        res.status(500).send('Server Error');
    }
});

// Add machine (Admin)
router.post('/adminBooking', async (req, res) => {
    const { machineName, machineStatus } = req.body;
    try {
        const newMachine = new AdminBooking({ machineName, machineStatus });
        await newMachine.save();
        res.redirect('/adminBooking');
    } catch (err) {
        console.error('Error adding machine:', err.message);
        res.status(500).send('Server Error');
    }
});

// Update machine status (Admin)
router.put('/adminBooking/:id', async (req, res) => {
    const { machineStatus } = req.body;
    try {
        await AdminBooking.findByIdAndUpdate(req.params.id, { machineStatus });
        res.redirect('/adminBooking');
    } catch (err) {
        console.error('Error updating machine status:', err.message);
        res.status(500).send('Server Error');
    }
});

// New route to download bookings in CSV format
router.get('/schedule/csv', async (req, res) => {
    try {
        const bookings = await StudentBooking.find({}).populate('machineId').sort({ setTime: 1 });

        const csvData = bookings.map(booking => ({
            Email: booking.email,
            MachineName: booking.machineId.machineName,
            SetTime: booking.setTime,
            Duration: booking.duration,
            Status: booking.statusMachine,
        }));

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(csvData);

        res.header('Content-Type', 'text/csv');
        res.attachment('bookings.csv');
        res.send(csv);
    } catch (err) {
        console.error('Error fetching bookings for CSV:', err.message);
        res.status(500).send('Server Error');
    }
});

// Cron job to delete old bookings every day at midnight
cron.schedule('0 0 * * *', async () => {
    try {
        const dateThreshold = new Date();
        dateThreshold.setDate(dateThreshold.getDate() - 30); // 30 days ago

        const result = await StudentBooking.deleteMany({ createdAt: { $lt: dateThreshold } });
        console.log(`${result.deletedCount} old bookings deleted.`);
    } catch (err) {
        console.error('Error deleting old bookings:', err.message);
    }
});

export default router;
