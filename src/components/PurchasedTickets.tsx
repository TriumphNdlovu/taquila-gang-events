import React, { useEffect, useState } from 'react';
import { fetchAllTickets } from '../services/ticketService'; // Make sure this function fetches tickets correctly
import { Ticket } from '../models/ticket';
import { LoadingSpinner } from './LoadingSpinner';

const PurchasedTickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getTickets = async () => {
      try {
        const fetchedTickets = await fetchAllTickets();
        setTickets(fetchedTickets);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch tickets. Please try again later.');
        setLoading(false);
      }
    };

    getTickets();
  }, []);


  return (
    <div className="bg-black text-white p-6 min-h-screen">
      <div className="text-center text-4xl font-bold my-6">
        <h1>All Purchased Tickets</h1>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-black border border-gray-700 text-white">
            <thead>
              <tr className="bg-gray-800">
                <th className="px-4 py-2 text-left">Ticket ID</th>
                <th className="px-4 py-2 text-left">Buyer Name</th>
                <th className="px-4 py-2 text-left">Buyer Email</th>
                <th className="px-4 py-2 text-left">Phone Number</th>
                <th className="px-4 py-2 text-left">Transaction time</th>
                <th className="px-4 py-2 text-left">Redeemed</th>
                {/* <th className="px-4 py-2 text-left">Quantity</th> */}
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.ticketid} className="border-t border-gray-700">
                  <td className="px-4 py-2">{ticket.ticketid}</td>
                  <td className="px-4 py-2">{ticket.buyer_name}</td>
                  <td className="px-4 py-2">{ticket.buyer_email}</td>
                  <td className="px-4 py-2">{ticket.buyer_phone_number}</td>
                <td className="px-4 py-2">{ticket.created_at}</td>
                  {/* <td className="px-4 py-2">{ticket.quantity}</td> */}
                  <td className="px-4 py-2">
                    {ticket.is_redeemed ? (
                      <span className="text-green-500">Yes</span>
                    ) : (
                      <span className="text-red-500">No</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PurchasedTickets;
