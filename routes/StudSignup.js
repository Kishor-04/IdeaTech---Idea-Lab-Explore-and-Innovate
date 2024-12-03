import express from "express";
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import multer from 'multer';
import path from 'path';
import { dirname } from 'path';
import fs from 'fs';
import bcrypt from 'bcrypt';
import Student from '../models/Student.js';
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use('/public', express.static(__dirname + "/public"));
// Middleware to handle form data
router.use(express.urlencoded({ extended: true }));
// // Serve static files from the 'public' directory
router.use(express.static(path.join(__dirname, 'public')));

const uploadDirectory = path.join(__dirname, 'public', 'image');
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true }, (err) => {
    if (err) {
      console.error('Error creating upload directory:', err);
    }
  });
}

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 10 * 1024 * 1024 // 1000MB 
  }
});
const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  }
  catch (error) {
    console.log(error.message);
  }
}


router.post("/signup", upload.single('image'), async (req, res) => {

  try {
    const { Name, userName, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).send('Passwords do not match');
    }

    const spassword = await securePassword(req.body.password);
    const image = '/image/' + req.file.filename;
    const newStudent = new Student({
      Name,
      userName,
      email,
      image,
      password: spassword,
      is_admin: 0,
    });

    const studentData = await newStudent.save();

    if (studentData) {
      res.render('Login', { message: "You Successfully Registered as Student" });
    }
    else {
      res.render('signup', { message: "You Failed to Register" })
    }
  }
  catch (error) {
    console.log(error.message);
  }

});

// Nodemailer transporter setup (using SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail', // e.g., 'gmail'
  auth: {

    user: 'patilkrisha04@gmail.com',
    pass: 'cqwr jnru amsr jooz'
  }
});


// Route to handle sending emails to all students
router.post('/message', async (req, res) => {
  const { teacherName, from, subject, message } = req.body;
  try {
    // Fetch all students' emails from the database
    const students = await Student.find({}, 'email');

    // Send emails to all students
    for (const student of students) {
      try {
        // Prepare email message for each student
        const mailOptions = {
          from: from,
          to: student.email,
          subject: subject,
          text: `Dear Student,\n\n${message}\n\nRegards,\n${teacherName}`
        };

        // Send email to individual student
        await transporter.sendMail(mailOptions);
      } catch (error) {
        console.error('Error sending email to student:', error);
      }
    }
    res.send('Emails sent successfully!');
  } catch (err) {
    console.error('Error sending emails:', err);
    res.status(500).send('Error sending emails');
  }
});


export default router;