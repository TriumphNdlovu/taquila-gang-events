import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Event } from '../models/event';
import { fetchEventServices } from '../services/eventService';
import { LoadingSpinner } from './LoadingSpinner';

const LandingPage: React.FC = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reset localStorage
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
    setLoading(false);
    // getEvent();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col min-h-[90vh] bg-black text-white">
      <header className="text-center text-4xl font-bold my-6 sm:text-5xl">
        <h1>Welcome to TQG Ticket Shop</h1>
      </header>

      <main className="max-w-4xl mx-auto p-6 sm:p-8 flex-1">
        <p className="text-2xl font-bold mb-4">Events</p>
        {event ? (
          <div className="border rounded-lg p-6 shadow-md bg-white text-black">
            {/* Event Poster */}
            <img
              src="/EventPoster.jpeg"
              alt={`${event.title} poster`}
              className="w-full h-auto rounded-lg mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
            <p>Venue: {event.venue}</p>
            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
            <p>Price: R{event.price.toFixed(2)}</p>
            <p>Available Tickets: Sold Out</p>
            <Link to={`/buy-ticket/${event.eventid}`}>
              <button
                className="mt-4 px-6 py-2 bg-gray-400 text-gray-700 w-full border border-gray-700 rounded cursor-not-allowed sm:text-lg"
                disabled
              >
                Sold Out
              </button>
            </Link>
          </div>
        ) : (
          <p className="text-gray-500">No events available right now.</p>
        )}
      </main>

      <footer className="text-center mt-8 text-gray-600 sm:mt-12">
        <p>&copy; 2024 TEQUILA GANG. All rights reserved.</p>
        <p>Follow us on social media for the latest updates.</p>
        <p>
          Designed by{' '}
          <a
            href="https://triumph-portfolio-seven.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:animate-pulse transition-colors underline"
          >
            Triumph
          </a>
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
