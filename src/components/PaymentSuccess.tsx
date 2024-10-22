import React, { useEffect, useState, useRef } from 'react';
import { generateTicketPDF } from '../services/ticketgenarator';
import { addTicket } from '../services/ticketService';
import { useLocation, useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';
import { sendTicketEmail } from '../emails/nodemailer';

const PaymentSuccess: React.FC = () => {
    const [ticketId, setTicketId] = useState<string | null>(null);
    const location = useLocation();
    const sendMailCalled = useRef(false); 
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const ticketIdParam = params.get('ticketId');

        if (ticketIdParam ) {
            localStorage.setItem('ticketId', ticketIdParam);
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
                        setTimeout(() => {
                            navigate('/thanks');
                        }, 2000);
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

        
            const pdfArray = await generateTicketPDF(ticketId);
            const pdf = pdfArray[1]; 
            const blob = new Blob([pdf], { type: 'application/pdf' });
            saveAs(blob, 'Tropical_Summer_Splash_Ticket.pdf');
        
    };

    const addingTicket = async () => {
        try {
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

        const ticketId = localStorage.getItem('ticketId');
        const buyerEmail = localStorage.getItem('buyerEmail');

        if(!ticketId) {
            console.error('Ticket ID not found');
            return;
        }
            const pdfArray = await generateTicketPDF(ticketId!);
            const pdf = pdfArray[0]; 
            const response = await sendTicketEmail(buyerEmail!, pdf);
            console.log('Email response:', response);
    }

    return (
        <div className="bg-gray-100 flex justify-center items-center h-screen">
            Redirecting...
        </div>
    );
};

export default PaymentSuccess;
