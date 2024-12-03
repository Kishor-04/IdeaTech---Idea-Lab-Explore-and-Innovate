import express from "express";
import session from 'express-session';
import bcrypt from 'bcrypt';
import Student from '../models/Student.js';

const router = express.Router();

router.use(session({
    secret: 'your-secret-key',
    resave: false, // Set to false to avoid deprecation warning
    saveUninitialized: false // Set to false to avoid deprecation warning
}));

router.post('/login', async (req, res) => {

    try {
        const { userName, password } = req.body;

        const student = await Student.findOne({ userName });

        if(student){
            const isPasswordValid = await bcrypt.compare(password, student.password);
            
            if(isPasswordValid){
                req.session.student_id = student._id;
                console.log("Session in loginAdmin route:", req.session);
               res.redirect('/StudentHomepage');
            }
            else{
                res.render('Login',{message: "Username and Password is incorrect"});
            }
        }
        else{
            res.render('Login',{message: "Username and Password is incorrect"});
        }
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).send('Error logging in');
    }
});

router.get('/login', async (req, res) => {
    if (req.session.student_id) {
        res.render('StudentHomepage');
        } else {
        res.redirect('/Login');
        }
})


// Profile route
router.get('/StudentProfile', async (req, res) => {
    try {
        if (req.session.student_id) {
            const loggedInstudent = await Student.findById(req.session.student_id); // corrected line
           
            const { image,...profileData} = loggedInstudent.toObject();
            res.render('StudentProfile', {
                student: profileData,
                image:image
            });
        } else {
            res.redirect('/StudentHomepage');
        }
    } catch (err) {
        res.status(500).send('Error fetching student profile');
    }
});

export default router;