import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import { dirname } from 'path';
import fs from 'fs';
import Machine from '../models/Machine.js';
import { fileURLToPath } from "url";

// files import
import Newsletter from "../models/Newsletter.js";
import {event_id} from './StudentUpdates.js';
import {student_event_id} from './StudentUpdates.js';
import {rsvp_id} from './StudentUpdates.js';
import {details} from './StudentUpdates.js';

const app = express.Router();

const __dirname = dirname(fileURLToPath(import.meta.url));

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/public', express.static(__dirname + "/public"));
// Middleware to handle form data
app.use(express.urlencoded({ extended: true }));
// // Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));


// Ensure 'public/image' directory exists for uploads
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
    fieldSize: 1000 * 1024 * 1024 // 1000MB 
  }
});

// Routes
app.get('/AdminSandbox', (req, res) => {
  // Pass error message (if any) to the template
  const error = req.query.error; // Check for error message in query params

  // res.render('AdminSandbox');
  res.render('AdminSandbox', { error });
});

app.post('/upload', upload.single('machineImage'), async (req, res) => {
  try {
    const { machineName, description } = req.body;
    const imageUrl = '/image/' + req.file.filename;

    const newMachine = new Machine({
      machineName,
      description,
      imageUrl
    });

    await newMachine.save();
    res.redirect('AdminHomepage');
  } catch (error) {
    console.error(error);
    // Redirect to home page with error message
    res.redirect('/?error=Failed to upload machine details');
  }
});

app.get('/TeacherSandbox', (req, res) => {
  // Pass error message (if any) to the template
  const error = req.query.error; // Check for error message in query params

  // res.render('AdminSandbox');
  res.render('TeacherSandbox', { error });
});

app.post('/upload', upload.single('machineImage'), async (req, res) => {
  try {
    const { machineName, description } = req.body;
    const imageUrl = '/image/' + req.file.filename;

    const newMachine = new Machine({
      machineName,
      description,
      imageUrl
    });

    await newMachine.save();
    res.redirect('TeacherHomepage');
  } catch (error) {
    console.error(error);
    // Redirect to home page with error message
    res.redirect('/?error=Failed to upload machine details');
  }
});

app.get('/AdminHomepage', async (req, res) => {
  try {
    const machines = await Machine.find();
    const newsletters = await Newsletter.find({});
    res.render('AdminHomepage', { machines, error: null, newsletters }); // Pass 'error' as null
  } catch (error) {
    console.error(error);
    res.render('AdminHomepage', { machines: [], error: 'Failed to retrieve machines' });
    console.error("Error fetching newsletters:", error);
  }
});

app.get('/StudentHomepage', async (req, res) => {
  try {
    const machines = await Machine.find();
    const newsletters = await Newsletter.find();

    res.render('StudentHomepage', { machines, error: null ,newsletters: newsletters || [] }); // Pass 'error' as null
  } catch (error) {
    console.error(error);
    res.render('StudentHomepage', { machines: [], error: 'Failed to retrieve machines' });
    res.status(500).send('Server Error');
  }
});

//routes from StudentUpdates

app.get("/event-details/:id",event_id);
app.get("/StudentHomepage/event-details/:id",student_event_id);
app.post("/rsvp/:id", rsvp_id);
app.get('/details',details);

app.get('/TeacherHomepage', async (req, res) => {
  try {
    const machines = await Machine.find();
    res.render('TeacherHomepage', { machines, error: null }); // Pass 'error' as null
  } catch (error) {
    console.error(error);
    res.render('TeacherHomepage', { machines: [], error: 'Failed to retrieve machines' });
  }
});

app.get('/machine/:id', async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id);
    res.render('AdminManualDisplay', { machine });
  } catch (error) {
    console.error(error);
    res.render('AdminManualDisplay', { error: 'Machine not found' });
  }
});

app.get('/machine/:id', async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id);
    res.render('StudentManualDisplay', { machine });
  } catch (error) {
    console.error(error);
    res.render('StudentManualDisplay', { error: 'Machine not found' });
  }
});

app.get('/machine/:id', async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id);
    res.render('TeacherManualDisplay', { machine });
  } catch (error) {
    console.error(error);
    res.render('TeacherManualDisplay', { error: 'Machine not found' });
  }
});

//routes that handels Admin edit
app.get("/edit/:id", async (req, res) => {
  let machine = await Machine.findById(req.params.id);
  res.render('edit', { machine: machine });
});

// app.post('/editMachine', upload.single('machineImage'), async (req, res) => {
//   try {
//     const { machineName, description } = req.body;
//     const imageUrl = '/image/' + req.file.filename;

//     const newMachine = new Machine({
//       machineName,
//       description,
//       imageUrl
//     });

//     await newMachine.save();
//     res.redirect('AdminHomepage');
//   } catch (error) {
//     console.error(error);
//     // Redirect to home page with error message
//     res.redirect('/?error=Failed to upload machine details');
//   }
// });

app.post('/editMachine', upload.single('machineImage'), async (req, res) => {
  try {
    const { machineName, description } = req.body;
    let imageUrl = req.body.imageUrl; // Use existing imageUrl from form

    // Check if a file was uploaded and update imageUrl accordingly
    if (req.file) {
      imageUrl = '/image/' + req.file.filename;
    }

    // Find the machine by ID and update its details
    const newMachine = new Machine({
      machineName,
      description,
      imageUrl
    }); // Set {new: true} to return the updated document

    // Redirect to AdminHomepage after successful update
    await newMachine.save();
    res.redirect('/AdminHomepage');
  } catch (error) {
    console.error(error);
    // Redirect to home page with error message
    res.redirect('/?error=Failed to update machine details');
  }
});

// app.put("/:id", async (req, res) => {
//   req.machine = await Machine.findById(req.params.id);
//   let machine = req.machine;
//   machine.machineName = req.body.machineName;
//   machine.description = req.body.description;
//   machine.imageUrl = req.body.imageUrl;

//   try {
//     machine = await machine.save();
//     //redirect to view route
//     res.redirect('AdminHomepage');
//   } catch (error) {
//     console.log(error);
//     res.redirect(`/edit/$(machine.id)`, { machine: machine });
//   }
// });

app.delete('/delete/:id', async (req, res) => {
  try {
    // Find the machine by ID and delete it
    await Machine.findByIdAndDelete(req.params.id);
    res.redirect('/AdminHomepage');
  } catch (error) {
    console.error(error);
    res.redirect('/AdminHomepage?error=Failed to delete machine');
  }
});


export default app;

