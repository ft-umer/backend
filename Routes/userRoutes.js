const express = require('express');
const router = express.Router();
const User = require('../Models/userModel');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Create a new user

router.post('/createUsers', async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Check if the email already exists in the database
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }
  
      let hashpass = await bcrypt.hash(password, 10)
      // If the email is unique, create a new user
      const newUser = new User({ name, email, password: hashpass });
      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Error creating user' });
    }
  });
// Update a user by ID
router.put('/updateUsers/:id', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { name, email, password }, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Error updating user' });
  }
});

// Delete a user by ID
router.delete('/deleteUsers/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error deleting user' });
  }
});

router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      // Find the user by email in the database
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      // Compare the provided password with the hashed password stored in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      // Generate a JWT token
      const token = jwt.sign({ id: user._id }, 'secretkey', { expiresIn: '1h' });
      // Return the token to the front-end
      res.json({ token });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Error logging in' });
    }
  });
  

module.exports = router;
