const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 3000;

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ MongoDB Connection
const url = 'mongodb://localhost:27017/beauty_parlour';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ✅ Appointment Schema
const appointmentSchema = new mongoose.Schema({
    name: String,
    phone: String,
    service: String,
    date: Date,
    time: String
});
const Appointment = mongoose.model('Appointment', appointmentSchema);

// ✅ Feedback Schema
const feedbackSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    submittedAt: { type: Date, default: Date.now }
});
const Feedback = mongoose.model('Feedback', feedbackSchema);

// ✅ Contact Message Schema
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    message: String,
    submittedAt: { type: Date, default: Date.now }
});
const ContactMessage = mongoose.model('ContactMessage', contactSchema);

// ✅ Serve static frontend files
const frontendPath = path.join(__dirname, '../frontend'); // adjust if needed
app.use(express.static(frontendPath));

// ✅ Redirect old frontend URL
app.get('/frontend/index.html', (req, res) => {
    res.redirect('/index.html');
});

// ✅ Appointment Booking API
app.post('/api/appointments', (req, res) => {
    const appointmentData = req.body;
    console.log('📅 Appointment Data Received:', appointmentData);

    if (appointmentData.date) {
        appointmentData.date = new Date(appointmentData.date);
    }

    const newAppointment = new Appointment(appointmentData);

    newAppointment.save()
        .then(savedAppointment => {
            res.json({
                message: 'Appointment booked successfully!',
                data: savedAppointment
            });
        })
        .catch(err => {
            console.error('❌ Error saving appointment:', err);
            res.status(500).json({ message: 'Error booking appointment.' });
        });
});

// ✅ Feedback Submission API (✅ updated)
app.post('/api/feedback', (req, res) => {
    const feedbackData = req.body;
    console.log('📝 Feedback Received:', feedbackData);

    const newFeedback = new Feedback(feedbackData);

    newFeedback.save()
        .then(savedFeedback => {
            res.json({
                message: 'Feedback submitted successfully!',
                data: savedFeedback
            });
        })
        .catch(err => {
            console.error('❌ Error saving feedback:', err);
            res.status(500).json({ message: 'Error saving feedback.' });
        });
});

// ✅ Contact Message API (✅ updated)
app.post('/api/contact', (req, res) => {
    const contactData = req.body;
    console.log('📨 Contact Message Received:', contactData);

    const newContact = new ContactMessage(contactData);

    newContact.save()
        .then(savedContact => {
            res.json({
                message: 'Message sent successfully!',
                data: savedContact
            });
        })
        .catch(err => {
            console.error('❌ Error saving contact message:', err);
            res.status(500).json({ message: 'Error sending message.' });
        });
});

// ✅ Fallback route for all unknown GET requests
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// ✅ Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
