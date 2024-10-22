const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Import routes
const userRoutes = require('./routes/users');
const photoRoutes = require('./routes/photos');
const profileRoutes = require('./routes/profiles');

// Create express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static file serving for images (profile photos)
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/profiles', profileRoutes);

// Serve static files from React app (build)
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});