const express = require('express');
const mongoose = require('mongoose');
const userPrefRoutes = require('./userprefroutes');
const cors = require('cors');  

const app = express();
const port = process.env.PORT || 3000;

// Configure CORS to allow requests from your frontend's origin
app.use(cors({
    origin: 'http://localhost:3001'
}));

// Update the mongoose connection settings
mongoose.connect('mongodb://localhost/sample', {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB', error);
});

app.use(express.json());
app.use(userPrefRoutes);

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
