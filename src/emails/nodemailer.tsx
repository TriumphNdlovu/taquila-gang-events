import axios from 'axios';

export const sendTicketEmail = async (email: string, pdf_ticket: string | Uint8Array) => {
    const response = await axios.post('https://tequila-gang-events.vercel.app/api/sendTicket', {
        buyer_email: email,
        pdf_ticket: pdf_ticket,
    });
    return response.data;
};
