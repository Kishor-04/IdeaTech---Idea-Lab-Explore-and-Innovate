
import express from "express";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import Message from "../models/Message.js";
import Machine from '../models/Machine.js';

const router = express.Router();

mongoose.connect('mongodb+srv://patilkishory04:876775@webdev.0tmazro.mongodb.net/?retryWrites=true&w=majority&appName=webdev', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  // Create indexes for models after successful connection
  Machine.createIndexes();
  Message.createIndexes();
  console.log('Connected to MongoDB and indexes created');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // Using Gmail as the email service
  auth: {
    user: 'patilkrisha04@gmail.com', // Your Gmail email address
    pass: 'cqwr jnru amsr jooz' // Your Gmail password or app-specific password
  }
});

router.post('/send-message', async (req, res) => {
  try {
    const { name, email, message, source } = req.body;

    // Validate message data
    if (!name || !email || !message) {
      return res.status(400).send('Name, email, and message are required');
    }

    console.log('Received message:', { name, email, message });

    // Save message to MongoDB
    const newMessage = new Message({ name, email, message });
    await newMessage.save();

    if (source === 'new') {
      // Redirect to a different page or send a success response
      return res.send('Message sent successfully from the new form!');
    } else {
      // Redirect to display all messages
      return res.redirect('/messages');
    }
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/messages', async (req, res) => {
  try {
    const chats = await Message.find(); // Fetch all messages from MongoDB
    res.render('index', { chats }); // Render 'index.ejs' and pass 'chats' data
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).send('Internal Server Error');
  }
});
// Route to handle replying to a message
router.post('/reply-message', async (req, res) => {
  try {
    const { messageId, email, reply } = req.body;

    // Fetch the original message from the database using the messageId
    const originalMessage = await Message.findById(messageId);

    if (!originalMessage) {
      return res.status(404).send('Message not found');
    }

    // Compose the email
    const mailOptions = {
      from: 'patilkrisha04@gmail.com',
      to: email,
      subject: 'Reply to your message',
      text: reply
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return res.send('Email sent successfully');
  } catch (error) {
    console.error('Error replying to message:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/search-bar',async(req,res)=>{
  try{
    var search=' ';
    if(req.query.search){
      search = req.query.search;

    }
    const userData = await Machine.find({

      $or:[
         {machineName:{ $regex:'.*' + search + '.*',$options:'i'}}
      ]
    });

    res.render('AdminHomepage',{machines:userData});

  }catch(error){
    console.log(error.message);
  }
});

export default router;