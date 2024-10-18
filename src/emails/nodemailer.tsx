import axios from 'axios';

// export const sendTicketEmail = async (buyer_email: string , pdf_ticket: any) => {
export const sendTicketEmail = async (buyer_email: string , pdf_ticket: any) => {

    try {
        const response = await axios.post('https://tequila-gang-events.vercel.app/api/server', {
            buyer_email,
            pdf_ticket
        });
        console.log('Email sent:', response.data);
    } catch (error) {
        
        console.error('Error sending email:', error);
    }

};
