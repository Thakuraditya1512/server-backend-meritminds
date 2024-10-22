const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load .env file

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
  subject: String, // Field for subject
  message: String
});

const Form = mongoose.model('Form', formSchema); // Create the model

// Handle form submissions
app.post('/api/form', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const newForm = new Form({ name, email, subject, message });

  try {
    await newForm.save();
    res.status(201).json({ message: 'Form data saved successfully' });
  } catch (error) {
    console.error('Error saving form data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Set up the server (assuming you want to run it locally as well)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
