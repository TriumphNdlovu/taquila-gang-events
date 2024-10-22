import React, { useEffect, useState } from 'react';
import { generateTicketPDF } from '../services/ticketgenarator';
import { sendTicketEmail } from '../emails/nodemailer';
import { addTicket } from '../services/ticketService';
import { redirect } from 'react-router-dom';

export const MailSendPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [ticketId, setTicketId] = useState<string | null>(null);
    
    useEffect(() => {
        const localemail = localStorage.getItem('buyerEmail');
        const localticketId = localStorage.getItem('ticketId');
        if (localemail) {
            setEmail(localemail);
        }
        if (localticketId) {
            setTicketId(localticketId);
        }
    }
    , []);
        

    const send = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const pdf_Array = await generateTicketPDF(ticketId!); 
            const pdf_ticket = pdf_Array[0];
            const hey = await sendTicketEmail(email, pdf_ticket);
            const tso = await addTicket(ticketId!); 
            // clear localhost storage
            localStorage.removeItem('buyerEmail');
            localStorage.removeItem('ticketId');

            redirect('/thanks');
            // alert('Email sent successfully!' + hey);
        } catch (error) {
            redirect('https://www.tequilagangsa.com/');
            alert('Failed to send the email. You need to buy a Ticket First');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-black">
            <header className="text-center text-4xl font-bold my-6 text-white">
                <h1>Send Ticket</h1>
                <p>Please enter an Email you want to receive your Ticket on</p>
            </header>

            <main className="bg-black">
                <form className="bg-white p-4 rounded-lg shadow-lg" onSubmit={send}>
                <p className='text-red-600 text-sm'>Make sure the email address is correct or you won't receive the email</p>
                    <label className="block text-lg font-bold">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-400 rounded px-4 py-2"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-yellow-500 text-white px-4 py-2 mt-4 rounded hover:bg-green-600"
                    >
                        Send Ticket 
                    </button>
                </form>
            </main>
        </div>
    );
};

export default MailSendPage;


