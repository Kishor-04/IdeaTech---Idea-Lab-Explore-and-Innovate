import express from "express";
import session from 'express-session';
import bcrypt from 'bcrypt';
import Admin from '../models/Admin.js';

const router = express.Router();

router.use(session({
    secret: 'your-secret-key',
    resave: false, // Set to false to avoid deprecation warning
    saveUninitialized: false // Set to false to avoid deprecation warning
}));

router.post('/loginAdmin', async (req, res) => {

    try {
        const { userName, password } = req.body;

        const admin = await Admin.findOne({ userName });

        if (admin) {
            const isPasswordValid = await bcrypt.compare(password, admin.password);

            if (isPasswordValid) {
                req.session.admin_id = admin._id;
                
            console.log("Session in loginAdmin route:", req.session);
                res.redirect('/AdminHomepage');
            }
            else {
                res.render('Login', { message: "Username and Password is incorrect" });
            }
        }
        else {
            res.render('Login', { message: "Username and Password is incorrect" });
        }
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).send('Error logging in');
    }
});

router.get('/loginAdmin', async (req, res) => {
    if (req.session.admin_id) {
        res.render('AdminHomepage');
        } else {
        res.redirect('/Login');
        }
})


// Profile route
router.get('/AdminProfile', async (req, res) => {
    try {
        if (req.session.admin_id) {
            const loggedInAdmin = await Admin.findById(req.session.admin_id); // corrected line
           
            const { image,...profileData} = loggedInAdmin.toObject();
            res.render('AdminProfile', {
                admin: profileData,
                image:image
            });
        } else {
            res.redirect('/AdminHomepage');
        }
    } catch (err) {
        res.status(500).send('Error fetching admin profile');
    }
});

export default router;