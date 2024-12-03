import express from "express";
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import { dirname } from 'path';
import fs from 'fs';
import bcrypt from 'bcrypt';
import Admin from '../models/Admin.js';
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

// Define the schema for the AdminID model
const adminIdSchema = new mongoose.Schema({
    admin_id: {
        type: String,
        required: true
    }
});

const AdminID = mongoose.model("AdminID", adminIdSchema);


router.post("/signupAdmin",upload.single('image'), async (req, res) => {
    try {
        const { admin_id, Name, userName, email, password, confirmPassword } = req.body;
        

        if (password !== confirmPassword) {
            return res.status(400).send('Passwords do not match');
        }

        const existingAdminId = await AdminID.findOne({ admin_id: admin_id });
        if (!existingAdminId) {
            return res.redirect('/error?error=Admin_id_not_found');
        }

        const spassword = await securePassword(req.body.password);
        const image = '/image/' + req.file.filename;
        const newAdmin = new Admin({
            Name,
            userName,
            email,
            image,
            password: spassword,
            is_admin: 1,
        });
        const AdminData = await newAdmin.save();

        if (AdminData) {
            res.render('Login', { message: "You Successfully Registered as Admin" });
        }
        else {
            res.render('signupAdmin', { message: "You Failed to Register" })
        }
    }
    catch (error) {
        console.log(error.message);
    }
});

router.get('/error', (req, res) => {
    let errorMessage = '';
    if (req.query.error === 'Admin_id_not_found') {
        errorMessage = 'Error: Admin ID not found in the database.';
    }
    // Handle other possible errors here
    res.send(errorMessage);
});

export default router;