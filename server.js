const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ MongoDB connection using environment variable
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/beauty_parlour';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB error:', err));

// ✅ Schema & Model
const appointmentSchema = new mongoose.Schema({
    name: String,
    phone: String,
    service: String,
    date: Date,
    time: String
});
const Appointment = mongoose.model('Appointment', appointmentSchema);

// ✅ Serve frontend
const frontendPath = __dirname; // This is correct based on your repo
app.use(express.static(frontendPath));

// ✅ API route
app.post('/api/appointments', (req, res) => {
    const appointmentData = req.body;
    const newAppointment = new Appointment(appointmentData);

    newAppointment.save()
        .then(() => res.json({ message: 'Appointment booked successfully!', data: appointmentData }))
        .catch(err => {
            console.error('❌ Error saving appointment:', err);
            res.status(500).json({ message: 'Error booking appointment.' });
        });
});

// ✅ Wildcard route for SPA support
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// ✅ Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
