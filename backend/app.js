const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const auth0Routes = require('./routes/auth0');
const usersRoutes = require('./routes/users'); // Import the users route
const photosRoutes = require('./routes/photos'); // Import the photos route
const searchRoutes = require('./routes/search');
const pool = require('./config/db'); 
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 300, // limit each IP to 300 requests per windowMs
  message: 'Too many requests, please try again later.', // response message when limit is reached
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse incoming JSON requests 
app.use(limiter);

const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes
app.use('/auth0', auth0Routes);
app.use('/users', usersRoutes);  // Attach users route
app.use('/photos', photosRoutes); // Attach photos route
app.use('/search', searchRoutes);


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