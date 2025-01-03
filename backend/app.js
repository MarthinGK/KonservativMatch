const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const auth0Routes = require('./routes/auth0');
const usersRoutes = require('./routes/users'); // Import the users route
const photosRoutes = require('./routes/photos'); // Import the photos route
const searchRoutes = require('./routes/search');
const likesRoutes = require('./routes/likes');
const permissionsRoutes = require('./routes/permissions');
const messagesRoutes = require('./routes/messages');
const subscriptionRoutes = require('./routes/subscription');
const pool = require('./db'); // Import the database pool configuration
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config(); // Load environment variables


const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 300, // Limit each IP to 300 requests per windowMs
  message: 'Too many requests, please try again later.', // Response message when limit is reached
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// CORS configuration
const corsOptions = {
  origin: ['https://konservativmatch.no', 'https://www.konservativmatch.no', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  credentials: true, // Enable cookies if needed
};

// Middleware
app.use(cors(corsOptions)); // Enable CORS
app.options('*', cors(corsOptions)); // Allow preflight requests for all routes
app.use(bodyParser.json()); // Parse incoming JSON requests 
app.use(limiter); // Apply rate limiting middleware
app.use('/images', express.static(path.join(__dirname, 'images'))); // Serve static files

// Routes
app.use('/auth0', auth0Routes);
app.use('/users', usersRoutes); // Attach users route
app.use('/photos', photosRoutes); // Attach photos route
app.use('/search', searchRoutes);
app.use('/likes', likesRoutes);
app.use('/permissions', permissionsRoutes);
app.use('/messages', messagesRoutes);
app.use('/subscription', subscriptionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Test the database connection
(async () => {
  try {
    const res = await pool.query('SELECT NOW()'); // Test query
    console.log('Connected to PostgreSQL:', res.rows[0]);
  } catch (err) {
    console.error('Error connecting to PostgreSQL:', err.stack);
  }
})();

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;




// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const auth0Routes = require('./routes/auth0');
// const usersRoutes = require('./routes/users'); // Import the users route
// const photosRoutes = require('./routes/photos'); // Import the photos route
// const searchRoutes = require('./routes/search');
// const likesRoutes = require('./routes/likes');
// const permissionsRoutes = require('./routes/permissions');
// const messagesRoutes = require('./routes/messages');
// const pool = require('./db'); 
// const rateLimit = require('express-rate-limit');

// const limiter = rateLimit({
//   windowMs: 60 * 1000, // 1 minute
//   max: 300, // limit each IP to 300 requests per windowMs
//   message: 'Too many requests, please try again later.', // response message when limit is reached
//   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// });

// const app = express();
// const PORT = process.env.PORT || 5000;

// // const corsOptions = {
// //   origin: ['https://konservativmatch.no', 'http://localhost:3000'], // Add allowed domains
// //   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
// //   credentials: true // Enable cookies if needed
// // };

// // Middleware
// //app.use(cors(corsOptions)); // Enable CORS
// app.use(cors()); // Enable CORS
// app.use(bodyParser.json()); // Parse incoming JSON requests 
// app.use(limiter);

// const path = require('path');
// app.use('/images', express.static(path.join(__dirname, 'images')));

// // Routes
// app.use('/auth0', auth0Routes);
// app.use('/users', usersRoutes);  // Attach users route
// app.use('/photos', photosRoutes); // Attach photos route
// app.use('/search', searchRoutes);
// app.use('/likes', likesRoutes);
// app.use('/permissions', permissionsRoutes);
// app.use('/messages', messagesRoutes);


// // Serve static files (for profile photos, etc.)l
// app.use('/images', express.static('public/images'));

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });

// // Test the database connection
// pool.connect((err) => {
//   if (err) {
//     console.error('Error connecting to PostgreSQL:', err.stack);
//   } else {
//     console.log('Connected to PostgreSQL');
//   }
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// module.exports = app;