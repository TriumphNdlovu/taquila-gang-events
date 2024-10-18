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
  const { data, error } = await supabase
    .from('events')
    .update({ available_tickets: { 'action': 'decrement', 'value': 1 } })
    .eq('eventid', eventId);

  if (error) {
    throw new Error('Error decrementing ticket: ' + error.message);
  }

  return data;
}