// Send mail test page

import React, { useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { sendTicketEmail } from '../emails/nodemailer';



export const MailSendPage: React.FC = () => {

    const send = async () => {

        

        const sent = await sendTicketEmail('teeekshop@gmail.com', null);
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-black">
            <header className="text-center text-4xl font-bold my-6 text-white">
                <h1>Send Mail</h1>
            </header>

            <main className='bg-black'>
                        <button type="submit" className="bg-black text-white p-2 rounded-lg hover:bg-white hover:text-black transition duration-300"
                        onClick={send}
                        
                        >Send</button>
            </main>
        </div>
    );
}
export default MailSendPage;
