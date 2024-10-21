import express from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

// CORS middleware for all routes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://tequila-gang-events.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    next();
});


app.get("/", (req, res) => res.send("Express on Vercel"));

// POST route for sending email
app.post('/index', async (req, res) => {
    const { buyer_email, pdf } = req.body;

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
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));

export default app;
