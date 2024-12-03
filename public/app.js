const express = require('express');
const mongoose = require('mongoose');
const Content = require('./Content');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
    });

app.use(express.json());

// Save content to the database
app.post('/saveContent', async (req, res) => {
    try {
        const { content } = req.body;
        const newContent = await Content.create({ content });
        res.status(201).json({ message: 'Content saved successfully', content: newContent });
    } catch (err) {
        console.error('Error saving content:', err);
        res.status(500).json({ error: 'An error occurred while saving content' });
    }
});

// Fetch content from the database
app.get('/getContent', async (req, res) => {
    try {
        const latestContent = await Content.findOne().sort({ createdAt: -1 });
        if (latestContent) {
            res.json({ content: latestContent.content });
        } else {
            res.status(404).json({ message: 'No content found' });
        }
    } catch (err) {
        console.error('Error fetching content:', err);
        res.status(500).json({ error: 'An error occurred while fetching content' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
