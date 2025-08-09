const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 3000;

// ✅ CORS — sab origin allow
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ MongoDB connection
const url = 'mongodb://localhost:27017/beauty_parlour';
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

// ✅ Static files serve from frontend
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// ✅ Optional: Redirect old URL (/frontend/index.html) to new root
app.get('/frontend/index.html', (req, res) => {
    res.redirect('/index.html');
});

// ✅ Appointment Booking API
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

// ✅ Fallback Route (Fix for Express 5 / Node v22+)
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
