import { Resend } from 'resend';

const resend = new Resend('re_123456789');


export const sendEmail = async () => {

await resend.emails.send({
  from: 'Tequila Gang <onboarding@resend.dev>',
  to: ['realtriumphndlovu@gmail.com'],
  subject: 'hello world',
  html: '<p>Fuck yeah it works</p>',
});

};



