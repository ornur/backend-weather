// server.js
const express = require('express');
const dotenv = require('dotenv');
const weatherRoutes = require('./routes/weather');
const mapRoutes = require('./routes/map');
const googleRoutes = require('./routes/google');
const path = require('path');

dotenv.config();
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Define a route for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.use(express.static('public'));
app.use(express.json());

app.use('/weather', weatherRoutes);
app.use('/map', mapRoutes);
app.use('/google', googleRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
