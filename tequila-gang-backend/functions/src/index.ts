import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';
import * as cors from 'cors';
import * as express from 'express';

const app = express();
const corsOptions = {
    origin: "*", 
    methods: "POST",
    allowedHeaders: ["Content-Type"],
    optionsSuccessStatus: 200,
    
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.post('/sendTicket', async (req, res) => {
    const { buyer_email, pdf_ticket } = req.body;

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
        const pdfBuffer = Buffer.from(pdf_ticket, 'base64');
        const mailOptions = {
            from: process.env.REACT_APP_EMAIL_USER,
            to: buyer_email,
            subject: 'Your Ticket for Tropical Summer Slash',
            text: 'Hi ;),\n\nThank you for your purchase! Please find your ticket for Tropical Summer Slash attached.\n\nBest regards,\nTQG Team',
            attachments: [
                {
                    filename: 'Tropical_Summer_Slash_Ticket.pdf',
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

// Export the app as a Cloud Function
export const sendTicket = functions.https.onRequest(app);
