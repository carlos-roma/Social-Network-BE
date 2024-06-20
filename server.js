const express = require('express');
const db = require('./config/connection');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const thoughtRoutes = require('./routes/thoughtRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(bodyParser.json());

// Debugging middleware
app.use((req, res, next) => {
  console.log('Request Method:', req.method);
  console.log('Request URL:', req.originalUrl);
  console.log('Request Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Request Body:', JSON.stringify(req.body, null, 2));
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/thoughts', thoughtRoutes);

// Error handling middleware for JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Bad JSON', err);
    return res.status(400).send({ message: 'Invalid JSON' });
  }
  next();
});

// Connect to the database and start the server
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
