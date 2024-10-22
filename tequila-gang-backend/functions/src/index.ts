import * as nodemailer from 'nodemailer';
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.get('/hello', (req :any, res :any) => {
  res.end("Received GET request!");  
});

app.post('/hello', (req: any, res : any) => {
    const buyer_email = req.body.buyer_email;
    const pdf_ticket = req.body.pdf_ticket;


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

        transporter.sendMail(mailOptions);
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
    }

  res.end("Buyer email: " + buyer_email + " PDF ticket: " + pdf_ticket);  
});



// Expose Express API as a single Cloud Function:
exports.widgets = functions.https.onRequest(app)


// import * as v2 from 'firebase-functions/v2';

// export const sendmail = v2.https.onRequest((request, response) => {

//     response.send("Hello from Firebase!");
// });

// import * as functions from 'firebase-functions';
// import * as nodemailer from 'nodemailer';
// import * as cors from 'cors';
// import * as express from 'express';

// const app = express();
// const corsOptions = {
//     origin: "*", 
//     methods: "POST",
//     allowedHeaders: ["Content-Type"],
//     optionsSuccessStatus: 200,
    
// };

// // Middleware
// app.use(cors(corsOptions));
// app.use(express.json()); 
// app.use()
// app.use(express.urlencoded({ extended: true })); 

// app.post('/sendTicket', async (req, res) => {
//     const { buyer_email, pdf_ticket } = req.body;

//     const transporter = nodemailer.createTransport({
//         host: 'da16.domains.co.za',
//         port: 587,
//         secure: false,
//         auth: {
//             user: process.env.REACT_APP_EMAIL_USER,
//             pass: process.env.REACT_APP_EMAIL_PASSWORD,
//         },
//     });

//     try {
//         const pdfBuffer = Buffer.from(pdf_ticket, 'base64');
//         const mailOptions = {
//             from: process.env.REACT_APP_EMAIL_USER,
//             to: buyer_email,
//             subject: 'Your Ticket for Tropical Summer Slash',
//             text: 'Hi ;),\n\nThank you for your purchase! Please find your ticket for Tropical Summer Slash attached.\n\nBest regards,\nTQG Team',
//             attachments: [
//                 {
//                     filename: 'Tropical_Summer_Slash_Ticket.pdf',
//                     content: pdfBuffer,
//                     encoding: 'base64',
//                 },
//             ],
//         };

//         await transporter.sendMail(mailOptions);
//         res.status(200).send('Email sent successfully');
//     } catch (error) {
//         console.error('Error sending email:', error);
//         res.status(500).send('Error sending email');
//     }
// });

// // Export the app as a Cloud Function
// export const sendTicket = functions.https.onRequest(app);
