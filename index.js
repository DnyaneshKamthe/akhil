// index.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); 
// Import routes
const authRoutes = require("./routes/auth.route")
const propertyRoutes = require('./routes/property.route');


const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI; 

// Middleware
app.use(bodyParser.json());
app.use(express.json())
app.use(cors());

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.get("/", (req, res) => {
    res.status(200).send('Welcome to Property Management')
})



// Use routes
app.use("/api/auth", authRoutes)
app.use('/api/properties', propertyRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));