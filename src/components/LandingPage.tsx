import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Event } from '../models/event';
import { fetchEventServices } from '../services/eventService';
import {LoadingSpinner} from './LoadingSpinner';

const LandingPage: React.FC = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEvent = async () => {
      try {
        const eventsData = await fetchEventServices();
        if (eventsData.length > 0) {
          setEvent(eventsData[0]); // Display the first event for simplicity.
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
    <div className="max-w-4xl mx-auto p-6">
      <header className="text-center text-4xl font-bold my-6">
        <h1>Welcome to TeekShop</h1>
        <p>Your gateway to amazing events!</p>
      </header>

      <main>
        {event ? (
          <div className="border rounded-lg p-6 shadow-md bg-white">
            <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
            <p>Time: {event.time}</p>
            <p>Price: ZAR {event.price.toFixed(2)}</p>
            <Link to={`/buy-ticket/${event.eventId}`}>
              <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                Buy Ticket
              </button>
            </Link>
          </div>
        ) : (
          <p className="text-gray-500">No events available right now.</p>
        )}
      </main>

      <footer className="text-center mt-8 text-gray-600">
        <p>&copy; 2024 TeekShop. All rights reserved.</p>
        <p>Follow us on social media for the latest updates.</p>
      </footer>
    </div>
  );
};

export default LandingPage;