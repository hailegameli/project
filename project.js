// config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
// models/ticketModel.js
const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    passengerName: {
        type: String,
        required: true
    },
    travelDate: {
        type: Date,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    bookingDate: {
        type: Date,
        default: Date.now
    }
});

const Ticket = mongoose.model('Ticket', TicketSchema);
module.exports = Ticket;
// controllers/ticketController.js
const Ticket = require('../models/ticketModel');

// Book a ticket
exports.bookTicket = async (req, res) => {
    try {
        const ticket = new Ticket(req.body);
        await ticket.save();
        res.status(201).json({ message: 'Ticket booked successfully', ticket });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all tickets
exports.getTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find();
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// routes/ticketRoutes.js
const express = require('express');
const router = express.Router();
const { bookTicket, getTickets } = require('../controllers/ticketController');

// POST /api/tickets/book - Book a ticket
router.post('/book', bookTicket);

// GET /api/tickets - Get all booked tickets
router.get('/', getTickets);

module.exports = router;
// app.js
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to the database
connectDB();

// Routes
const ticketRoutes = require('./routes/ticketRoutes');
app.use('/api/tickets', ticketRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
