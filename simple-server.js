const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

app.get('/', (req, res) => {
  res.send(`
    <h1>Skin Gym Manager Test</h1>
    <p>Server is running on port ${PORT}</p>
    <a href="/test">Test API endpoint</a>
  `);
});

const server = app.listen(PORT, () => {
  console.log(`Simple server running on http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop');
});

process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.close(() => {
    console.log('Server stopped');
    process.exit(0);
  });
});