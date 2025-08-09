const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // ✅ Use dynamic port for Render

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ MongoDB connection string — from environment variable
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/beauty_parlour';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ Error connecting to MongoDB:', err));

// ✅ Schema & Model
const appointmentSchema = new mongoose.Schema({
    name: String,
    phone: String,
    service: String,
    date: Date,
    time: String
});
const Appointment = mongoose.model('Appointment', appointmentSchema);

// ✅ Static frontend serving — from current directory (all files are here)
app.use(express.static(__dirname)); // 👈 Since everything (HTML, CSS, JS) is in root

// ✅ API Route
app.post('/api/appointments', (req, res) => {
    const appointmentData = req.body;
    console.log('📅 Appointment Data Received:', appointmentData);

    const newAppointment = new Appointment(appointmentData);

    newAppointment.save()
        .then(() => {
            res.json({
                message: 'Appointment booked successfully!',
                data: appointmentData
            });
        })
        .catch(err => {
            console.error('❌ Error saving appointment:', err);
            res.status(500).json({ message: 'Error booking appointment.' });
        });
});

// ✅ Fallback for SPA — send index.html on unmatched routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
