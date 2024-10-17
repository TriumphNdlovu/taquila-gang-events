const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'da16.domains.co.za', 
    port: 587, 
    secure: false, 
    auth: {
        user: process.env.REACT_APP_EMAIL_USER,
        pass: process.env.REACT_APP_EMAIL_PASSWORD,
    },
});

transporter.verify(function (error) {
    if (error) {
        console.error('SMTP connection error:', error);
    } else {
        console.log('SMTP server is ready to take messages');
    }
});

// Define the email sending function
const sendTicketHandler = async (req, res) => {
    if (req.method === 'POST') {
        const { buyer_email, pdf_ticket } = req.body; 

        const pdfBuffer = Buffer.from(pdf_ticket, 'base64'); 

        const mailOptions = {
            from: process.env.REACT_APP_EMAIL_USER,
            to: buyer_email, 
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
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};

// Allow CORS
const allowCors = (fn) => async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    return await fn(req, res);
};

// Export the handler function wrapped with CORS support
module.exports = allowCors(sendTicketHandler);
