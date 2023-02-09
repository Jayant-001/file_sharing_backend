const express = require('express');
const app = express();
const path = require('path');

// Template engine
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')

// to use public folder
app.use(express.static('public'))
app.use(express.json());

// DB connection
const connectDB = require('./config/db')
connectDB();

// routes
app.use('/api/files', require('./routes/files'))
app.use('/files', require('./routes/showfiles'))
app.use('/files/download', require('./routes/download'))



const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log("Listening on port " + port)
});