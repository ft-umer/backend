const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./Routes/userRoutes');
// const cors = require('cors');


const app = express();
// app.use(cors());
app.use(express.json());

app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies

const MONGODB_URI = 'mongodb+srv://ft-umer:naipta123@cluster0.hktwnj3.mongodb.net/?retryWrites=true&w=majority'; // Replace 'mydatabase' with your actual database name



// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', () => {
  console.log('Connected to MongoDB database.');
});

// Parse JSON request body
app.use(express.json());

// Set up user routes
app.use('/api', router);

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
