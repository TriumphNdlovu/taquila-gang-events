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