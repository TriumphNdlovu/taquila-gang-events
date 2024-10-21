import axios from 'axios';

export const sendTicketEmail = async (buyer_email: string , pdf_ticket: any) => {

    try {
        const response = await axios.post('https://tequila-gang-events.vercel.app/api/index',
        {
            buyer_email,
            pdf_ticket
        },
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
        console.log('Email sent:', response.data);
    } catch (error) {
        
        console.error('Error sending email:', error);
    }

};