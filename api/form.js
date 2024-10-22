const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors
require('dotenv').config(); // Load environment variables

const app = express();

// Use CORS middleware
app.use(cors());  // This enables CORS for all requests from all origins

// If you only want to allow specific origins, use this instead:
// app.use(cors({
//     origin: 'http://127.0.0.1:5500'  // Allows requests only from your local development URL
// }));

app.use(bodyParser.json()); // Middleware to parse JSON requests

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.log('MongoDB connection error:', err));

// Define the form schema
const formSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String
});

const Form = mongoose.model('Form', formSchema);

// Handle form submissions
app.post('/api/form', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  // Save form data to MongoDB
  const newForm = new Form({ name, email, subject, message });

  try {
    await newForm.save();
    res.status(201).json({ message: 'Form data saved successfully' });
  } catch (error) {
    console.error('Error saving form data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Export the app so Vercel can handle it as a serverless function
module.exports = app;
