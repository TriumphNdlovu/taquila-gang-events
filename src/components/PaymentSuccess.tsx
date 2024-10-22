import React, { useEffect, useState, useRef } from 'react';
import { generateTicketPDF } from '../services/ticketgenarator';
import { addTicket } from '../services/ticketService';
import { useLocation } from 'react-router-dom';
import { saveAs } from 'file-saver';
import { sendTicketEmail } from '../emails/nodemailer';

const PaymentSuccess: React.FC = () => {
    const [ticketId, setTicketId] = useState<string | null>(null);
    const [bEmail, setBEmail] = useState<string | null>(null);
    const location = useLocation();
    const sendMailCalled = useRef(false); 

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const ticketIdParam = params.get('ticketId');
        const buyerEmail = params.get('buyerEmail');

        if (ticketIdParam && buyerEmail) {
            localStorage.setItem('ticketId', ticketIdParam);
            localStorage.setItem('buyerEmail', buyerEmail!);
            setBEmail(buyerEmail);
            setTicketId(ticketIdParam);
        }

        if (ticketIdParam && !sendMailCalled.current) {
            sendMailandDownload();
        }
    }, [location]);


    const sendMailandDownload = async () => {
        sendMailCalled.current = true;
        try {
            const wait = await sending_mail().then(() => {
                addingTicket().then(() => {
                    downloadTicket().then(() => {
                        console.log('Email sent and ticket added');
                        window.location.href = '/thanks'
                    })
                })
            })
            
            console.log('Email sent and ticket added' + wait);
        } catch (error) {
            console.error('Error in sendMailandDownload:', error);
            sendMailCalled.current = false; 
        }
    };

    const downloadTicket = async () => {
        if (!ticketId) {
            console.error('Ticket ID not found');
            return;
        }

        try {
            const pdfArray = await generateTicketPDF(ticketId);
            const pdf = pdfArray[1]; 
            const blob = new Blob([pdf], { type: 'application/pdf' });
            saveAs(blob, 'Tropical_Summer_Slash_Ticket.pdf');
        } catch (error) {
            console.error('Error downloading the ticket:', error);
        }
    };

    const addingTicket = async () => {
        try {
            // const ticketIda = localStorage.getItem('ticketId');

            if (!ticketId) {
                console.error('Ticket ID or Buyer Email is missing');
                return;
            }
            const ticketID = await addTicket(ticketId);
            console.log('Ticket added:', ticketID);
            
        } catch (error) {
            console.error('Error sending email or adding ticket:', error);
        }
    };

    const sending_mail = async () => {

        // const ticketId = localStorage.getItem('ticketId');
        // const buyerEmail = localStorage.getItem('buyerEmail');

        if(!ticketId || !bEmail) {
            console.error('Ticket ID not found');
            return;
        }
            const pdfArray = await generateTicketPDF(ticketId);
            const pdf = pdfArray[0]; 
            const response = await sendTicketEmail(bEmail, pdf);
            console.log('Email response:', response);
    }

    return (
        <div className="bg-gray-100 flex justify-center items-center h-screen">
            Redirecting...
        </div>
    );
};

export default PaymentSuccess;
