import React, { useEffect, useState } from 'react';
import { fetchAllTickets } from '../services/ticketService';
import { Ticket } from '../models/ticket';
import { LoadingSpinner } from './LoadingSpinner';

const PurchasedTickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const ticketsPerPage = 11;
  

  // Function to handle password submission
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const spassword = process.env.REACT_APP_SECRET_PASS;
    if (password === spassword) {
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  useEffect(() => {
    const getTickets = async () => {
      try {
        const fetchedTickets = await fetchAllTickets();
        const sortedTickets = fetchedTickets.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setTickets(sortedTickets);
        setFilteredTickets(sortedTickets);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch tickets. Please try again later.');
        setLoading(false);
      }
    };

    getTickets();
  }, []);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = tickets.filter(
      (ticket) =>
        ticket.buyer_name.toLowerCase().includes(query) ||
        ticket.buyer_email.toLowerCase().includes(query)
    );
    setFilteredTickets(filtered);
    setCurrentPage(1);
  }, [searchQuery, tickets]);

  const startIndex = (currentPage - 1) * ticketsPerPage;
  const paginatedTickets = filteredTickets.slice(
    startIndex,
    startIndex + ticketsPerPage
  );
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  return (
    <div className="bg-black text-white p-4 sm:p-6 min-h-screen">
      {isAuthenticated ? (
        <>
          <div className="text-center text-2xl sm:text-4xl font-bold my-4 sm:my-6">
            <h1>All Purchased Tickets</h1>
          </div>

          {/* Search Input */}
          <div className="flex justify-center mb-4">
            <input
              type="text"
              placeholder="Search by buyer name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 border border-gray-700 rounded bg-gray-800 text-white w-full sm:w-1/2"
            />
          </div>
          {/* Summary Section */}
          <div className="flex justify-between items-center bg-gray-800 text-white rounded p-4 mb-4">
            <p className="text-lg font-medium">
              Total Sold Tickets: <span className="font-bold">{tickets.length}</span>
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center text-red-500">
              {error}
              <button
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  const getTickets = async () => {
                    try {
                      const fetchedTickets = await fetchAllTickets();
                      setTickets(fetchedTickets);
                      setFilteredTickets(fetchedTickets);
                      setLoading(false);
                    } catch (error) {
                      setError('Failed to fetch tickets. Please try again later.');
                      setLoading(false);
                    }
                  };
                  getTickets();
                }}
                className="mt-4 px-6 py-2 bg-white text-black w-full border border-black rounded hover:bg-black hover:text-white transition"
              >
                fetch tickets
              </button>
            </div>
          ) : filteredTickets.length === 0 ? (
            <p className="text-gray-500 text-center mt-4">No tickets available to display.</p>
          ) : (
            <div className="overflow-x-auto">
              <div className="hidden sm:block">
                {/* Desktop Table */}
                <table className="min-w-full bg-black border border-gray-700 text-white">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className="px-4 py-2 text-left">Buyer Name</th>
                      <th className="px-4 py-2 text-left">Buyer Email</th>
                      <th className="px-4 py-2 text-left">Phone Number</th>
                      <th className="px-4 py-2 text-left">Date & Time</th>
                      <th className="px-4 py-2 text-left">Redeemed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTickets.map((ticket) => (
                      <tr
                        key={ticket.ticketid}
                        className={`border-t border-gray-700 hover:bg-gray-800`}
                      >
                        <td className="px-4 py-2">{ticket.buyer_name}</td>
                        <td className="px-4 py-2">{ticket.buyer_email}</td>
                        <td className="px-4 py-2">{ticket.buyer_phone_number}</td>
                        <td className="px-4 py-2">{formatDateTime(ticket.created_at)}</td>
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

              {/* Mobile Table */}
              <div className="block sm:hidden space-y-4">
                {paginatedTickets.map((ticket) => (
                  <div
                    key={ticket.ticketid}
                    className={`border border-gray-700 rounded-lg p-4 `}
                  >
                    <div className="mb-2">
                      <strong>Buyer Name:</strong> {ticket.buyer_name}
                    </div>
                    <div className="mb-2">
                      <strong>Buyer Email:</strong> {ticket.buyer_email}
                    </div>
                    <div className="mb-2">
                      <strong>Phone Number:</strong> {ticket.buyer_phone_number}
                    </div>
                    <div className="mb-2">
                      <strong>Date & Time:</strong> {formatDateTime(ticket.created_at)}
                    </div>
                    <div>
                      <strong>Redeemed:</strong>{' '}
                      {ticket.is_redeemed ? (
                        <span className="text-green-500">Yes</span>
                      ) : (
                        <span className="text-red-500">No</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pagination */}
          {filteredTickets.length > ticketsPerPage && (
            <div className="flex justify-center mt-4 space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-800 text-white">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex justify-center items-center min-h-screen bg-black">
  <form onSubmit={handlePasswordSubmit} className="bg-black border border-white p-8 rounded-lg shadow-lg max-w-md w-full">
    <h2 className="text-3xl text-center text-red-500 mb-6 font-semibold">Authentification Required</h2>
    
    <div className="mb-6">
      
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-3 border border-white rounded-lg bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Password"
      />
    </div>

    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
    
    <button type="submit" className="mt-4 px-6 py-2 bg-black text-white w-full border border-white rounded hover:bg-white hover:text-black transition">
      Submit
    </button>
  </form>
</div>

      )}
    </div>
  );
};

export default PurchasedTickets;
