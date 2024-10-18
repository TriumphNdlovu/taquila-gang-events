const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware setup
app.use(cors({
    origin: 'https://tequila-gang-events.vercel.app/sendTicket', // Replace with your frontend URL
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['X-CSRF-Token', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization',
         'Origin', 'Access-Control-Allow-Origin', 
         'Access-Control-Allow-Headers', 'Access-Control-Allow-Methods', 'Access-Control-Allow-Credentials'],

    credentials: true // If you need to send cookies or HTTP Auth headers
}));
app.use(bodyParser.json());



// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: 'da16.domains.co.za', // Use the SMTP host provided by your email provider
    port: 587, // or the correct port for your SMTP server
    secure: false, // true for port 465, false for other ports like 587
    auth: {
        user: process.env.REACT_APP_EMAIL_USER,
        pass: process.env.REACT_APP_EMAIL_PASSWORD,
    },
});

// Verify SMTP connection
transporter.verify(function (error, success) {
    if (error) {
        console.error('SMTP connection error:', error);
    } else {
        console.log('SMTP server is ready to take messages');
    }
});

// Handle sending tickets
app.post('/sendTicket', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    const { buyer_email, pdf_ticket } = req.body; // Extract buyer's email and PDF ticket from the request body

    const pdfBuffer = Buffer.from(pdf_ticket, 'base64'); // Convert base64 string to buffer

    // Set up email options
    const mailOptions = {
        from: process.env.REACT_APP_EMAIL_USER,
        to: buyer_email, // Recipient's email
        subject: `Your Ticket for Tropical Summer Slash`,
        text: `Hi ;), \n\nThank you for your purchase! Please find your ticket for Tropical Summer Slash attached.\n\nBest regards,\nTQG Team`,
        attachments: [
            {
                filename: `Tropical_Summer_Slash_Ticket.pdf`,
                content: pdfBuffer,
                contentType: 'application/pdf',
            },
        ],
    };

    try {
        await transporter.sendMail(mailOptions); // Send the email
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
    }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
