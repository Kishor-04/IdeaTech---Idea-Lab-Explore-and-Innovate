// routes/studentBooking.js
import express from 'express';
import AdminBooking from '../models/AdminBooking.js';
import StudentBooking from '../models/StudentBooking.js';
import schedule from 'node-schedule';
import cron from 'node-cron';

const router = express.Router();

// Home route
router.get('/', (req, res) => {
    res.redirect('/studentBooking');
});

// Student route - Show available machines and dynamic schedule
router.get('/studentBooking', async (req, res) => {
    try {
        const machines = await AdminBooking.find({ machineStatus: 'Available' });
        const bookings = await StudentBooking.find({}).populate('machineId');
        res.render('studentBooking', { machines, bookings });
    } catch (err) {
        console.error('Error fetching machines or bookings:', err.message);
        res.status(500).send('Server Error');
    }
});

// Booking a machine (Student)
router.post('/studentBooking', async (req, res) => {
    const { email, machineId, setTime, duration } = req.body;

    try {
        const machine = await AdminBooking.findById(machineId);
        const requestedStartTime = new Date(setTime);
        const requestedEndTime = new Date(requestedStartTime.getTime() + duration * 60000);

        const conflict = machine.schedule.some(
            (booking) =>
                requestedStartTime < booking.endTime && requestedEndTime > booking.startTime
        );

        if (conflict) {
            return res.send('This machine is already booked at that time.');
        }

        const timeOverAt = new Date(requestedStartTime.getTime() + duration * 60000);
        const newBooking = new StudentBooking({
            email,
            machineId,
            setTime: requestedStartTime,
            duration,
            timeOverAt,
            statusMachine: 'Available',
            studentId: req.session.student_id,
        });

        await newBooking.save();

        // Schedule the new booking for real-time activation
        scheduleBooking(newBooking);

        machine.schedule.push({
            studentEmail: email,
            startTime: requestedStartTime,
            endTime: timeOverAt,
        });
        machine.machineStatus = 'Available';
        await machine.save();

        res.redirect('/studentBooking');
    } catch (err) {
        console.error('Error booking machine:', err.message);
        res.status(500).send('Server Error');
    }
});



// Schedule a booking in real-time
function scheduleBooking(booking) {
    const job = schedule.scheduleJob(new Date(booking.setTime), async function () {
        try {
            console.log(`Activating booking for ${booking.email} on ${booking.machineId.machineName}`);
            // Perform any real-time actions here, like setting machine status to 'Booked'
            
            const machine = await AdminBooking.findById(booking.machineId);
            if (machine) {
                machine.machineStatus = 'Booked'; // Set the machine to booked
                await machine.save();
            }
        } catch (err) {
            console.error('Error during real-time booking activation:', err.message);
        }
    });

    return job;
}

// Use this function to load and schedule existing bookings when the server starts
async function scheduleExistingBookings() {
    try {
        const bookings = await StudentBooking.find({
            setTime: { $gte: new Date() } // Only schedule future bookings
        }).populate('machineId');

        bookings.forEach(scheduleBooking);
    } catch (err) {
        console.error('Error scheduling existing bookings:', err.message);
    }
}

// Schedule the task to run every day at midnight (00:00)
cron.schedule('0 0 * * *', () => {
    scheduleExistingBookings();
});




// Route to display the schedule page
router.get('/schedule', async (req, res) => {
    try {
        const bookings = await StudentBooking.find({})
            .populate('machineId')
            .sort({ setTime: 1 }); // 1 for ascending order

        res.render('schedule', { bookings });
    } catch (err) {
        console.error('Error fetching bookings:', err.message);
        res.status(500).send('Server Error');
    }
});



// Route to display the daily schedule
// Route to display the daily schedule for a specific date
router.get('/dailySchedule/:date', async (req, res) => {
    try {
        const selectedDate = new Date(req.params.date);
        const startOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
        const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

        const bookings = await StudentBooking.find({
            setTime: { $gte: startOfDay, $lt: endOfDay }
        }).populate('machineId');

        const today = new Date();
        const validDates = [];

        // Generate valid dates for the next 7 days, excluding Sunday
        for (let i = 0; i < 7; i++) {
            const date = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
            if (date.getDay() !== 0) { // Exclude Sundays
                validDates.push(date);
            }
        }

        res.render('dailySchedule', { bookings, validDates, selectedDate, session: req.session });
    } catch (err) {
        console.error('Error fetching daily schedule:', err.message);
        res.status(500).send('Server Error');
    }
});

// Default route for today's schedule
router.get('/dailySchedule', (req, res) => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format
    res.redirect(`/dailySchedule/${formattedDate}`);
});


router.post('/studentBooking/delete/:id', async (req, res) => {
    try {
        const bookingId = req.params.id;
        
        // Check if the user is logged in
        if (!req.session.student_id) {
            return res.status(401).send('You must be logged in to delete a booking.');
        }

        // Fetch the booking by ID
        const booking = await StudentBooking.findById(bookingId);

        // Check if the booking exists and if the logged-in user is the owner
        if (!booking || booking.studentId.toString() !== req.session.student_id) {
            return res.status(403).send('You are not authorized to delete this booking.');
        }

        // Delete the booking
        await StudentBooking.findByIdAndDelete(bookingId);

        // Also remove the booking from the associated machine schedule
        const machine = await AdminBooking.findById(booking.machineId);
        
        // Ensure the machine exists before attempting to update its schedule
        if (machine) {
            machine.schedule = machine.schedule.filter(b => b.studentEmail !== booking.email || b.startTime !== booking.setTime);
            await machine.save();
        }

        // Redirect to the bookings page after successful deletion
        res.redirect('/dailySchedule');
    } catch (err) {
        console.error('Error deleting booking:', err.message);
        res.status(500).send('Server Error');
    }
});


export default router;
