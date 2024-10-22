const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB Atlas connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.log('MongoDB connection error:', err));

// Define the form schema
const formSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String, // Add this line
  message: String
});

const Form = mongoose.model('Form', formSchema);

// Handle form submissions
app.post('/api/form', async (req, res) => {
    const { name, email, subject, message } = req.body; // Add subject here

    const newForm = new Form({ name, email, subject, message }); // Include subject

    try {
        await newForm.save();
        res.status(201).send('Form data saved successfully');
    } catch (error) {
        res.status(400).send('Error saving form data');
    }
});
