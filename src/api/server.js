const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    // Handle CORS preflight request
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.status(200).end(); // Respond OK to OPTIONS requests
        return;
    }

    // Check if the request method is POST
    if (req.method === 'POST') {
        res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust to specific origin if needed

        const { buyer_email , pdf } = req.body;

        // Configure the Nodemailer transporter
        const transporter = nodemailer.createTransport({
            host: 'da16.domains.co.za', 
            port: 587, 
            secure: false, 
            auth: {
                user: process.env.REACT_APP_EMAIL_USER,
                pass: process.env.REACT_APP_EMAIL_PASSWORD,
            },
        });

        try {
            await transporter.verify();

            const pdfBuffer = Buffer.from(pdf, 'base64');

            const mailOptions = {
                from: process.env.REACT_APP_EMAIL_USER,
                to: buyer_email,
                subject: 'Your Ticket for Tropical Summer Slash',
                text: 'Hi ;),\n\nThank you for your purchase! Please find your ticket for Tropical Summer Slash attached.\n\nBest regards,\nTQG Team',
                attachments: [
                    {
                        filename: 'Tropical_Summer_slash_Ticket.pdf',
                        content: pdfBuffer,
                        encoding: 'base64',
                    },
                ],
            };

            await transporter.sendMail(mailOptions);
            res.status(200).send('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).send('Error sending email');
        }
    } else {
        // Respond with 405 if not a POST request
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};
