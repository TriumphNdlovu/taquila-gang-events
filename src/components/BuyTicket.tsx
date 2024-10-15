import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';

interface BuyTicketProps {
  eventId: string;
  title: string;
  price: number;
  date: string;
  time: string;
}

const BuyTicket: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  
  const [quantity, setQuantity] = useState<number>(1);
  const [buyerEmail, setBuyerEmail] = useState<string>('');
  const [buyerName, setBuyerName] = useState<string>('');
  const [buyerPhoneNumber, setBuyerPhoneNumber] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuyTicket = async () => {
    setLoading(true);
    setError(null);

    try {
      const tickets = Array.from({ length: quantity }, () => ({
        event_id: eventId,
        buyer_email: buyerEmail,
        buyer_name: buyerName,
        buyer_phone_number: buyerPhoneNumber,
      }));

      const { error } = await supabase.from('tickets').insert(tickets);

      if (error) {
        setError('Failed to purchase tickets. Please try again.');
        console.error(error);
      } else {
        navigate('/my-tickets');
      }
    } catch (error) {
      console.error('Error purchasing tickets:', error);
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Purchase Tickets</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleBuyTicket();
        }} 
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={buyerEmail}
            onChange={(e) => setBuyerEmail(e.target.value)}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            type="text"
            value={buyerPhoneNumber}
            onChange={(e) => setBuyerPhoneNumber(e.target.value)}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min={1}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Buy Tickets'}
        </button>
      </form>
    </div>
  );
};

export default BuyTicket;