const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/users'); // Import the users route
const photosRoutes = require('./routes/photos'); // Import the photos route
const pool = require('./config/db'); 
// const profileRoutes = require('./routes/profile'); // Import the profile route

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse incoming JSON requests
 
// Routes
app.use('/users', usersRoutes);  // Attach users route
app.use('/photos', photosRoutes); // Attach photos route
// app.use('/profile', profileRoutes); // Attach profile route

// Serve static files (for profile photos, etc.)l
app.use('/images', express.static('public/images'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Test the database connection
pool.connect((err) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err.stack);
  } else {
    console.log('Connected to PostgreSQL');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;