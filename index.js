//Main Backend File
import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql";
// import mongoose from "mongoose";
import session from 'express-session';
import { dirname } from "path";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import database from "./routes/StudAdminInbox.js";
import adminSandbox from "./routes/adminSandbox.js";
import studLoginRoutes from "./routes/StudLogin.js";
import studSignupRoutes from "./routes/StudSignup.js";
import teacherLoginRoutes from "./routes/TeacherLogin.js";
import teacherSignupRoutes from "./routes/TeacherSignup.js";
import adminLoginRoutes from "./routes/AdminLogin.js";
import adminSignupRoutes from "./routes/AdminSignup.js";
import adminRoutes from './routes/AdminUpdates.js';
import StudentLabRequestRoute from './routes/StudentLabRequest.js';
import AdminLabRequestRoute from './routes/AdminLabRequest.js'
import adminBooking from './routes/adminBooking.js'; // Import admin routes
import studentBooking from './routes/studentBooking.js'; // Import student routes

const app = express();
const port = 3000;

app.use(session({
    secret: 'your-secret-key',
    resave: false, // Set to false to avoid deprecation warning
    saveUninitialized: false // Set to false to avoid deprecation warning
}));

const __dirname = dirname(fileURLToPath(import.meta.url));

// Middleware setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/public', express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(express.json());


const isLogin = async (req, res, next) => {

    try{
        if(req.session.admin_id){}
        else{
            res.redirect('/');
        }
        next();
    }
    catch (error) {
        console.log(error.message)
    }
}

const isLogout = async (req, res, next) => {

    try{

        if(req.session.admin_id){
            res.redirect('/AdminHomepage');
        }

        next();
    }
    catch (error) {
        console.log(error.message)
    }
}

app.get("/", (req, res) => {
    res.render('Login',{message:[]});
});

app.get("/signupStudent", (req, res) => {
    res.render("signupStudent");
});

app.get("/signupTeacher", (req, res) => {
    res.render("signupTeacher");
});

app.get("/signupAdmin", (req, res) => {
    res.render("signupAdmin");
});

app.get("/Login",(req, res) => {
    res.render("Login",{message:[]});
});

app.get("/TeacherSandbox", (req, res) => {
    res.render("TeacherSandbox");
});

app.get("/AdminManualDisplay",(req, res) => {
    res.render("AdminManualDisplay");
});
// Route for rendering student.ejs (student home  page)
app.get('/student', (req, res) => {
    res.render('student'); // Renders the 'student.ejs' file
});

// Route to show form for sending message
app.get('/message/new', (req, res) => {
    res.render('new'); // Render the form for sending a new message
});

app.get('/new', (req, res) => {
    res.render('new'); // Renders the 'new.ejs' file
});

app.get('/message/new', (req, res) => {
    res.render('index'); // Renders the 'new.ejs' file
});

//About and Help
app.get('/Help', (req, res) => {
    res.render('Help'); // Renders the 'new.ejs' file
});

app.get('/About_Us', (req, res) => {
    res.render('About_Us'); // Renders the 'new.ejs' file
});

app.get('/UserAboutUs', (req, res) => {
    res.render('UserAboutUs'); // Renders the 'new.ejs' file
});

app.get('/UserHelp', (req, res) => {
    res.render('UserHelp'); // Renders the 'new.ejs' file
});


// app.get('/lab-request', (req, res) => {
//     res.render('LabRequest', { approvedLabs, message: req.query.message });
// });


//Student and Teacher Login and Signup Backend//

//Student's login page
app.use("/", studLoginRoutes);
//Student's signup page
app.use("/", studSignupRoutes);
// Teacher's login page 
app.use("/", teacherLoginRoutes);
// Teacher's signup page
app.use("/", teacherSignupRoutes);
// Admin's login page 
app.use("/", adminLoginRoutes);
// Admin's signup page
app.use("/", adminSignupRoutes);
//Admin's inbox and student
app.use("/", database);
//Admin's route for sandbox functioning
app.use('/', adminSandbox);
//Admin Event Updates
app.use('/',adminRoutes);
//Student Lab request Route
app.use('/', StudentLabRequestRoute);
//Admin Lab request Route
app.use('/', AdminLabRequestRoute);
//Booking routes
app.use('/',adminBooking);
app.use('/',studentBooking);

//Permission document uploads
app.use('/uploads', express.static('uploads'));


app.listen(port, () => {
    console.log(`Server's now running on port ${port}`);
})




