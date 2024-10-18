import supabase from '../supabaseClient';
import { Event } from '../models/event';

export const fetchEventServices = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*');

  if (error) {
    throw new Error('Error fetching events: ' + error.message);
  }

  return data as Event[];
};

export const fetchEventById = async (eventId: string): Promise<Event | null> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('eventid', 'f1cf3ba3-7d76-48bd-bd46-5ea8d3321bdd') // will unhard code this later on
    .single();

  if (error) {
    throw new Error('Error fetching event: ' + error.message);
  }

  return data as Event | null;
}

export const event_ticket_decrement = async (eventId: string) => {

  const { data: event, error: fetchError } = await supabase
    .from('events')
    .select('available_tickets')
    .eq('eventid', eventId)
    .single(); 

  if (fetchError) {
    throw new Error('Error fetching event: ' + fetchError.message);
  }

  const newAvailableTickets = event.available_tickets - 1;


  const { data, error: updateError } = await supabase
    .from('events')
    .update({ available_tickets: newAvailableTickets })
    .eq('eventid', eventId);

  if (updateError) {
    throw new Error('Error decrementing ticket: ' + updateError.message);
  }

  return data;
};
