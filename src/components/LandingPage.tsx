import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Event } from '../models/event';
import { fetchEventServices } from '../services/eventService';
import { LoadingSpinner } from './LoadingSpinner';

const LandingPage: React.FC = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // reset localhost storage
    localStorage.removeItem('buyerEmail');
    localStorage.removeItem('ticketId');
    localStorage.removeItem('quantity');
    localStorage.removeItem('buyerName');
    localStorage.removeItem('buyerPhoneNumber');
    
    const getEvent = async () => {
      try {
        const eventsData = await fetchEventServices();
        if (eventsData.length > 0) {
          setEvent(eventsData[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };

    getEvent();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-black">
      <header className="text-center text-4xl font-bold my-6 text-white">
        <h1>Welcome to TQG Ticket Shop</h1>
      </header>

      <main className='bg-black'>
        <p className='text-2xl font-bold text-white h-full'>Events</p>
        {event ? (
          <div className="border rounded-lg p-6 shadow-md bg-white">
            {/* Event Poster */}
            <img
              src="/EventPoster.jpeg" 
              alt={`${event.title} poster`}
              className="w-full h-auto rounded-lg mb-4" 
            />
            <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
            <p>Venue: {event.venue}</p> 
            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
            <p>Time: {event.time}</p>
            <p>Price: R{event.price.toFixed(2)}</p>
            <p>Available Tickets: {event.available_tickets} left</p>
            <Link to={`/buy-ticket/${event.eventid}`}>
              <button className="mt-4 px-6 py-2 bg-white text-black w-full border border-black rounded hover:bg-black hover:text-white transition">
                Buy Ticket
              </button>
            </Link>
          </div>
        ) : (
          <p className="text-gray-500">No events available right now.</p>
        )}
      </main>

      <footer className="text-center mt-8 text-gray-600">
        <p>&copy; 2024 TEQUILA GANG. All rights reserved.</p>
        <p>Follow us on social media for the latest updates.</p>
        
      </footer>
    </div>
  );
};

export default LandingPage;
