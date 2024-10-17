import  supabase  from "../supabaseClient";


export const addTicket = async (ticketId: string) => {
    try {

     
        const { error: insertError } = await supabase.from('tickets').insert([
            {
                eventid: 'f1cf3ba3-7d76-48bd-bd46-5ea8d3321bdd', // will unhard code this later on
                ticketid: localStorage.getItem('ticketId') ,
                orderid: 'f1cf3ba3-7d76-48bd-bd46-5ea8d3321bdd', // will unhard code this later on
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
        return ticketId ;

    } catch (error) {
        console.error('An unexpected error occurred:', error);
    }
};

export const validateTicket = async (ticketId: string) => {
    try {
        const { data, error } = await supabase
            .from('tickets')
            .select('*')
            .eq('ticketid', ticketId)
            .single();

        if (error) {
            console.error('Error fetching ticket:', error.message);
            return null;
        }

        if(data.size() == 0) {
            console.error('Ticket not found');
            return false;
        }

        return true;

    } catch (error) {
        console.error('An unexpected error occurred:', error);
    }
};

export const genarateTicketId = async () => {
    try {
        const ticketId = crypto.randomUUID();
        return ticketId;
    } catch (error) {
        console.error('An unexpected error occurred:', error);
    }
}

