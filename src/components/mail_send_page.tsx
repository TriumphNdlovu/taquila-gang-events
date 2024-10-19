import React, { useState } from 'react';
import { generateTicketPDF } from '../services/ticketgenarator';
import { sendTicketEmail } from '../emails/nodemailer';

export const MailSendPage: React.FC = () => {
    const [email, setEmail] = useState('');

    const send = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const pdf_Array = await generateTicketPDF("917f9c1e-4a46-4253-84e1-05dc9cd8cc7d"); // Just for testing
            const pdf_ticket = pdf_Array[0];
            await sendTicketEmail(email, pdf_ticket);
            alert('Email sent successfully!');
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Failed to send the email.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-black">
            <header className="text-center text-4xl font-bold my-6 text-white">
                <h1>Send Mail</h1>
            </header>

            <main className="bg-black">
                <form className="bg-white p-4 rounded-lg shadow-lg" onSubmit={send}>
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
                        className="bg-yellow-500 text-white px-4 py-2 mt-4 rounded hover:bg-yellow-600"
                    >
                        Send Mail
                    </button>
                </form>
            </main>
        </div>
    );
};

export default MailSendPage;


