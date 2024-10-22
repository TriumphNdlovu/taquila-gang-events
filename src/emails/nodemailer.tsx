// import axios from 'axios';

// export const sendTicketEmail = async (email: string, pdf_ticket: string | Uint8Array) => {
//     const response = await axios.post('https://tequila-gang-events.vercel.app/api/sendTicket', {
//         buyer_email: email,
//         pdf_ticket: pdf_ticket,
//     });
//     return response.data;
// };


export const sendTicketEmail = async (email: string, pdf_ticket_base64: any) => {

    fetch('https://widgets-xgwr73lm2a-uc.a.run.app/hello', {
  method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        buyer_email: email,
        pdf_ticket: pdf_ticket_base64,
    }),
})
  .then(response => response.text())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));



// const response = await fetch('https://sendmail-xgwr73lm2a-uc.a.run.app');

// const result = await response.json();
// alert(result);


// return result;
}