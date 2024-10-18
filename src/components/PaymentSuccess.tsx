import React, { useEffect, useState, useRef } from 'react';
import { generateTicketPDF } from '../services/ticketgenarator';
import { addTicket } from '../services/ticketService';
import { useLocation } from 'react-router-dom';
import { saveAs } from 'file-saver';
import { sendTicketEmail } from '../emails/nodemailer';

const PaymentSuccess: React.FC = () => {
    const [ticketId, setTicketId] = useState<string | null>(null);
    const location = useLocation();
    const sendMailCalled = useRef(false); // Track if the function has been called

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const ticketIdParam = params.get('ticketId');
        if (ticketIdParam) {
            localStorage.setItem('ticketId', ticketIdParam);
            setTicketId(ticketIdParam);
        }
    }, [location]);

    useEffect(() => {
        // Only call sendMailandDownload when ticketId is set and function hasn't been called
        if (ticketId && !sendMailCalled.current) {
            sendMailandDownload();
        }
    }, [ticketId]);

    const sendMailandDownload = async () => {
        sendMailCalled.current = true;
        try {
            await downloadTicket();
            await sendMailAndAddTicket();
            console.log('Email sent and ticket added');
        } catch (error) {
            console.error('Error in sendMailandDownload:', error);
            sendMailCalled.current = false; // Reset to allow retry if needed
        }
    };

    const downloadTicket = async () => {
        if (!ticketId) {
            console.error('Ticket ID not found');
            return;
        }

        try {
            const pdfArray = await generateTicketPDF(ticketId);
            const pdf = pdfArray[1]; // Assume this is the PDF for download.
            const blob = new Blob([pdf], { type: 'application/pdf' });
            saveAs(blob, 'Tropical_Summer_Slash_Ticket.pdf');
        } catch (error) {
            console.error('Error downloading the ticket:', error);
        }
    };

    const sendMailAndAddTicket = async () => {
        try {
            const ticketId = localStorage.getItem('ticketId');
            const buyerEmail = localStorage.getItem('buyerEmail');

            if (!ticketId || !buyerEmail) {
                console.error('Ticket ID or Buyer Email is missing');
                return;
            }

            const ticketID = await addTicket(ticketId);
            const pdfArray = await generateTicketPDF(ticketId);
            const pdf = pdfArray[0]; // Assume this is the PDF for the email attachment.
            const response = await sendTicketEmail(buyerEmail, pdf);
            console.log('Email response:', response);
        } catch (error) {
            console.error('Error sending email or adding ticket:', error);
        }
    };

    return (
        <div className="bg-gray-100 flex justify-center items-center h-screen">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
                <p className="mb-4 text-sm">Thank you for your purchase. The ticket has been sent to your email.</p>
                <p className='mb-4 text-sm'>The download should start automatically. If not, click below:</p>
                <a 
                    className='mb-4 hover:cursor-pointer border border-black hover:border-blue-600 text-xs'
                    onClick={downloadTicket}
                >
                    Click here for Manual Download
                </a>
            </div>
        </div>
    );
};

export default PaymentSuccess;
