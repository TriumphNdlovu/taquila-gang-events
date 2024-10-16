import axios from 'axios';
// Create a transporter
// const transporter = nodemailer.createTransport({
//     host: 'da16.domains.co.za', // Custom SMTP host
//     port: 465, // Port, usually 465 for secure connections, or 587 for TLS
//     secure: true, // Use true for port 465, false for other ports
//     auth: {
//         user: process.env.REACT_APP_EMAIL_USER, // Your email address
//         pass: process.env.REACT_APP_EMAIL_PASS, // Your email password or app-specific password
//     },
// });

// Function to send email
export const sendTicketEmail = async (buyer_email: string, pdf_ticket: any) => {


    // const response = await fetch('/api/sendTicket', {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify({
    //                     buyer_email: 'realtriumphndlovu@gmail.com',
    //                     pdf_ticket: pdf_ticket,
    //                     eventTitle: 'Tropical Summer Slash',
    //                 }),
    //             });

    // console.log(response);

    try {
        const response = await axios.post('https://tequila-gang-events.vercel.app/sendTicket', {
            buyer_email,
            pdf_ticket
        });
        console.log('Email sent:', response.data);
    } catch (error) {
        console.error('Error sending email:', error);
    }

    // try {
    //     // Create mail options
    //     const mailOptions = {
    //         from: process.env.REACT_APP_EMAIL_USER, // Your email address
    //         to: "realtriumphndlovu@gmail.com", // Recipient's email address
    //         // to: buyer_email, // Recipient's email address
    //         subject: `Your Ticket for Tropical Summer Slash`,
    //         text: `Hi, \n\nThank you for your purchase! Please find your ticket for Tropical Summer Slash attached.\n\nBest regards,\nYour Event Team`,
    //         attachments: [
    //             {
    //                 filename: `Tropical_Summer_Slash_Ticket.pdf`,
    //                 content: pdf_ticket,
    //                 contentType: 'application/pdf',
    //             },
    //         ],
    //     };

    //     // Send the email
    //     const info = await transporter.sendMail(mailOptions);
    //     console.log('Email sent: ', info.response);
    // } catch (error) {
    //     console.error('Error sending email: ', error);
    // }
};
