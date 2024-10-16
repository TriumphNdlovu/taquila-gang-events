const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();


const app = express();
app.use(cors(
    {
    origin: ["https://tequila-gang-events.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true
}
));
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    host: 'da16.domains.co.za', // Use the SMTP host provided by your email provider
    port: 587, // or the correct port for your SMTP server
    secure: false, // true for port 465, false for other ports like 587
    auth: {
        user: process.env.REACT_APP_EMAIL_USER,
        pass: process.env.REACT_APP_EMAIL_PASSWORD,
    },
});

transporter.verify(function (error, success) {
    if (error) {
        console.error('SMTP connection error:', error);
    } else {
        console.log('SMTP server is ready to take messages');
    }
});


app.post('/sendTicket', async (req, res) => {
    const { buyer_email, pdf_ticket } = req.body;
    const pdfBuffer = Buffer.from(pdf_ticket, 'base64');
    const mailOptions = {
        from: process.env.REACT_APP_EMAIL_USER,
        to: buyer_email, // will take care of it  teeekshop@gmail.com
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
        await transporter.sendMail(mailOptions);
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
