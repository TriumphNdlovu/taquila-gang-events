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
    .eq('eventid', eventId)
    .single();

  if (error) {
    throw new Error('Error fetching event: ' + error.message);
  }

  return data as Event | null;
}