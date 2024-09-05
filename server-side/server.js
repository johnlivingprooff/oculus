const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const fieldRoutes = require('./routes/fieldRoutes');
const dashboardRoutes = require('./routes/dashRoutes');
const marketRoutes = require('./routes/marketRoutes');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const auth = require('./middlewares/authMiddleware');
const cors = require('cors');


// dotenv to auto load environment variables
require('dotenv').config();

// Get port fromm environment variable
const port = process.env.PORT || 3000;

// Connecting to Database
connectDB();

// Create an instance of express application
const app = express();

//CORS options
const corsOptions = {
  origin: ['https://oculus-6zg7.onrender.com', 'http://localhost:3000', 'https://oculus-ochre-omega.vercel.app', 'https://oak.johnlivingprooff.tech'],
  credentials: true,
  optionsSuccessStatus: 200
}

// MIddlewares
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/weather', weatherRoutes);
app.use('/api/v1/fields', fieldRoutes);
app.use('/api/v1', dashboardRoutes);
app.use('/api/v1', marketRoutes);

app.get('/', (req, res) => {
  res.send('HomePage');
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`['green']);
})