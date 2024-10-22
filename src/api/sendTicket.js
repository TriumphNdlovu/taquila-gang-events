// const nodemailer = require('nodemailer');
// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');

// const app = express();
// const port = process.env.PORT || 3000;

// // Middleware
// app.use(cors({ origin: true }));
// app.use(myMiddleware);
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // API endpoints
// app.post('/api/sendTicket', async (req, res)  => {
//     const { buyer_email, pdf_ticket } = req.body;
// // app.use()/// / // // // // // // // // // // // // // // // // /// / // // // // // // // // // // // // // // ////  
//     console.log('This means i got in buyer_email:', buyer_email);

//         // Set up the nodemailer transporter
//         const transporter = nodemailer.createTransport({
//             host: 'da16.domains.co.za',
//             port: 587,
//             secure: false,
//             auth: {
//                 user: process.env.REACT_APP_EMAIL_USER,
//                 pass: process.env.REACT_APP_EMAIL_PASSWORD,
//             },
//         });

//         try {
//             console.log('This means i got in try');
//             await transporter.verify();
//             console.log('This means i got in try 2');

//             // Prepare the PDF attachment
//             const pdfBuffer = Buffer.from(pdf_ticket, 'base64');
//             const mailOptions = {
//                 from: process.env.REACT_APP_EMAIL_USER,
//                 to: buyer_email,
//                 subject: 'Your Ticket for Tropical Summer Slash',
//                 text: 'Hi ;),\n\nThank you for your purchase! Please find your ticket for Tropical Summer Slash attached.\n\nBest regards,\nTQG Team',
//                 // attachments: [
//                 //     {
//                 //         filename: 'Tropical_Summer_Slash_Ticket.pdf',
//                 //         content: pdfBuffer,
//                 //         encoding: 'base64',
//                 //     },
//                 // ],
//             };
//             console.log('This means i got in try 3');
//             await transporter.sendMail(mailOptions);
//             console.log('This means i got in try 4');
            
//             res.status(200).send('Email sent successfully');
//         } catch (error) {
//             console.error('Error sending email:', error);
//             res.status(500).send('Error sending email');
//         }
//   res.send('Hello from Node.js server!');
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });




// // export default async function handler(req, res) {
    
// //     // Handle CORS preflight requests
// //     if (req.method === 'OPTIONS') {
// //         res.setHeader('Access-Control-Allow-Origin', '*');
// //         res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
// //         res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
// //         res.status(200).end();
// //         return;
// //     }

// //     // Handle POST requests
// //     // if (req.method === 'POST') {
// //         const { buyer_email, pdf_ticket } = req.body;

// //         // Set up the nodemailer transporter
// //         const transporter = nodemailer.createTransport({
// //             host: 'da16.domains.co.za',
// //             port: 587,
// //             secure: false,
// //             auth: {
// //                 user: process.env.REACT_APP_EMAIL_USER,
// //                 pass: process.env.REACT_APP_EMAIL_PASSWORD,
// //             },
// //         });

// //         try {
// //             await transporter.verify();

// //             // Prepare the PDF attachment
// //             const pdfBuffer = Buffer.from(pdf_ticket, 'base64');
// //             const mailOptions = {
// //                 from: process.env.REACT_APP_EMAIL_USER,
// //                 to: buyer_email,
// //                 subject: 'Your Ticket for Tropical Summer Slash',
// //                 text: 'Hi ;),\n\nThank you for your purchase! Please find your ticket for Tropical Summer Slash attached.\n\nBest regards,\nTQG Team',
// //                 attachments: [
// //                     {
// //                         filename: 'Tropical_Summer_Slash_Ticket.pdf',
// //                         content: pdfBuffer,
// //                         encoding: 'base64',
// //                     },
// //                 ],
// //             };

// //             await transporter.sendMail(mailOptions);
// //             res.status(200).send('Email sent successfully');
// //         } catch (error) {
// //             console.error('Error sending email:', error);
// //             res.status(500).send('Error sending email');
// //         }
// //     // } else {
// //     //     // Respond with 405 if not a POST request
// //     //     res.setHeader('Allow', ['POST']);
// //     //     return res.status(405).end(`Method ${req.method} Not Allowed`);
// //     // }
// // };
