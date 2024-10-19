import  supabase  from "../supabaseClient";
import { event_ticket_decrement } from "./eventService";


export const addTicket = async (ticketId: string) => {
    try {

     
        const { error: insertError } = await supabase.from('tickets').insert([
            {
                eventid: 'f1cf3ba3-7d76-48bd-bd46-5ea8d3321bdd', 
                ticketid: ticketId,
                orderid: 'f1cf3ba3-7d76-48bd-bd46-5ea8d3321bdd', 
                buyer_email: localStorage.getItem('buyerEmail'),
                buyer_name: localStorage.getItem('buyerName'),
                buyer_phone_number: localStorage.getItem('buyerPhoneNumber'),
                quantity: localStorage.getItem('quantity'),

            },
        ]);

        if (insertError) {
            console.error('Error adding ticket:', insertError.message);
            return;
        }

        console.log('Ticket added successfully');
        //Todo: Take of the hard coded event id and take care of what happens when tickets reach zero
        const left = await event_ticket_decrement('f1cf3ba3-7d76-48bd-bd46-5ea8d3321bdd');
        return ticketId ;

    } catch (error) {
        console.error('An unexpected error occurred:', error);
    }
};



export const redeemticket = async (ticketId : string) =>
{
    try {
        const { error: updateError } = await supabase.from('tickets').update({
            is_redeemed: true,
        }).eq('ticketid', ticketId);

        if (updateError) {
            console.error('Error updating ticket:', updateError.message);
            return;
        }

        console.log('Ticket redeemed successfully');
    } catch (error) {
        console.error('An unexpected error occurred:', error);
    }
}

export const is_redeemed = async (ticketId : string) =>
{
    try {
        const { data, error } = await supabase
            .from('tickets')
            .select('is_redeemed')
            .eq('ticketid', ticketId)
            .single();

        if (error) {
            console.error('Error fetching ticket:', error.message);
            return false;
        }

        if (!data) {
            console.error('Ticket not found');
            return false;
        }

        return data.is_redeemed;
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return false;
    }
}

export const validateTicket = async (ticketId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('ticketid', ticketId)
      .single(); 

    if (error) {
      console.error('Error fetching ticket:', error.message);
      return false; 
    }

    if (!data) {
      console.error('Ticket not found');
      return false; 
    }

    return true; 
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return false; 
  }
};

export const fetchAllTickets = async () => {
    try {
        const { data, error } = await supabase
            .from('tickets')
            .select('*');

        if (error) {
            console.error('Error fetching tickets:', error.message);
            return [];
        }

        return data;
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return [];
    }
}

export const genarateTicketId = async () => {
    try {
        const ticketId = crypto.randomUUID();
        return ticketId;
    } catch (error) {
        console.error('An unexpected error occurred:', error);
    }
}

