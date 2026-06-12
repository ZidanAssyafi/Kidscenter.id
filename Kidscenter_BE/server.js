require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://kidscenter.id',
    'https://www.kidscenter.id',
  ],
  credentials: true,
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'ALHAMDULILLAH SERVER IS RUNNING',
  });
});

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});