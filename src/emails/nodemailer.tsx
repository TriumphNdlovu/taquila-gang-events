// import axios from 'axios';

// export const sendTicketEmail = async (email: string, pdf_ticket: string | Uint8Array) => {
//     const response = await axios.post('https://tequila-gang-events.vercel.app/api/sendTicket', {
//         buyer_email: email,
//         pdf_ticket: pdf_ticket,
//     });
//     return response.data;
// };

export const sendTicketEmail = async (email: string, pdf_ticket_base64: any) => {
const response = await fetch('https://us-central1-tequila-gang-tickets.cloudfunctions.net/sendTicket', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        buyer_email: email,
        pdf_ticket: pdf_ticket_base64, // Your base64 encoded PDF
    }),
});

const result = await response.json();
console.log(result);


return result;
}