import express from "express";
import session from 'express-session';
import bcrypt from 'bcrypt';
import Teacher from '../models/Teacher.js';

const router = express.Router();

router.use(session({
    secret: 'your-secret-key',
    resave: false, // Set to false to avoid deprecation warning
    saveUninitialized: false // Set to false to avoid deprecation warning
}));

router.post('/loginTeacher', async (req, res) => {

    try {
        const { userName, password } = req.body;

        const teacher = await Teacher.findOne({ userName });

        if(teacher){
            const isPasswordValid = await bcrypt.compare(password, teacher.password);
            
            if(isPasswordValid){
                req.session.teacher_id = teacher._id;
               res.redirect('/TeacherHomepage');
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

router.get('/loginTeacher', async (req, res) => {
    if (req.session.teacher_id) {
        res.render('TeacherHomepage');
        } else {
        res.redirect('/Login');
        }
})


// Profile route
router.get('/TeacherProfile', async (req, res) => {
    try {
        if (req.session.teacher_id) {
            const loggedInteacher = await Teacher.findById(req.session.teacher_id); // corrected line
           
            const { image,...profileData} = loggedInteacher.toObject();
            res.render('TeacherProfile', {
                teacher: profileData,
                image:image
            });
        } else {
            res.redirect('/TeacherHomepage');
        }
    } catch (err) {
        res.status(500).send('Error fetching teacher profile');
    }
});

export default router;