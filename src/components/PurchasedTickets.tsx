import React, { useEffect, useState } from 'react';
import { fetchAllTickets } from '../services/ticketService';
import { Ticket } from '../models/ticket';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PurchasedTickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const ticketsPerPage = 10;

 useEffect(() => {
  const fetchTickets = async () => {
    try {
      const data = await fetchAllTickets();
      // Sort tickets by date (newest first)
      const sortedData = data.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setTickets(sortedData);
      setFilteredTickets(sortedData);
    } catch (err) {
      setError('Failed to fetch tickets.');
    } finally {
      setLoading(false);
    }
  };
  fetchTickets();
}, []);

 useEffect(() => {
  const filtered = tickets
    .filter(
      (ticket) =>
        ticket.buyer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.buyer_email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    .sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  setFilteredTickets(filtered);
}, [searchQuery, tickets]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.REACT_APP_SECRET_PASS) {
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const downloadCSV = () => {
    const headers = [
      'FullName',
      'Email Address',
      'Phone Number',
      'Date & Time',
      'Redeemed',
    ];
    const rows = filteredTickets.map((ticket) => [
      ticket.buyer_name,
      ticket.buyer_email,
      ticket.buyer_phone_number,
      formatDateTime(ticket.created_at),
      ticket.is_redeemed ? 'Yes' : 'No',
    ]);

    const csvContent =
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tickets_${new Date().toISOString()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      'FullName',
      'Email Address',
      'Phone Number',
      'Date & Time',
      'Redeemed',
    ];
    const tableRows: string[][] = [];

    // Populate table rows
    filteredTickets.forEach((ticket) => {
      const ticketData = [
        ticket.buyer_name,
        ticket.buyer_email,
        ticket.buyer_phone_number,
        formatDateTime(ticket.created_at),
        ticket.is_redeemed ? 'Yes' : 'No',
      ];
      tableRows.push(ticketData);
    });

    // Add the title
    doc.text('TQG_TICKET_SHOP_Purchased_TICKETS', 14, 10);

    // Generate the table
    autoTable(doc, {
      startY: 20,
      head: [tableColumn],
      body: tableRows,
    });

    // Accessing lastAutoTable after autoTable is called
    const summaryStartY = (doc as any).lastAutoTable.finalY + 10;

    // Calculate totals
    const totalSoldTickets = tickets.length;
    const totalRevenue = totalSoldTickets * 300; // Assuming each ticket costs 300
    const totalRedeemedTickets = tickets.filter((ticket) => ticket.is_redeemed).length;

    // Add summary section
    doc.setFontSize(12);
    doc.text(`Total Sold Tickets: ${totalSoldTickets}`, 14, summaryStartY);
    doc.text(`Total Redeemed Tickets: ${totalRedeemedTickets}`, 14, summaryStartY + 6);
    doc.text(`Total Revenue: R ${totalRevenue}`, 14, summaryStartY + 12);

    // Save the PDF
    doc.save(`tickets_${new Date().toISOString()}.pdf`);
  };

  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * ticketsPerPage,
    currentPage * ticketsPerPage
  );

  return (
    <div className="bg-black text-white p-4 sm:p-6 min-h-screen">
      {isAuthenticated ? (
        <>
          <div className="text-center text-2xl sm:text-4xl font-bold my-4 sm:my-6">
            <h1>All Purchased Tickets</h1>
          </div>

          <div className="flex justify-center mb-4">
            <input
              type="text"
              placeholder="Search by buyer name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 border border-gray-700 rounded bg-gray-800 text-white w-full sm:w-1/2"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-800 text-white rounded p-4 mb-4">
            <p className="text-lg font-medium">
              Total Sold Tickets: <span className="font-bold">{tickets.length}</span>
            </p>
            <div className="flex gap-2 flex-wrap mt-2 sm:mt-0">
              <button
                onClick={downloadCSV}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Download CSV
              </button>
              <button
                onClick={downloadPDF}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Download PDF
              </button>
            </div>
          </div>

          {loading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-700 text-white text-left">
                    <th className="p-2">FullName</th>
                    <th className="p-2">Email Address</th>
                    <th className="p-2">Phone Number</th>
                    <th className="p-2">Date & Time</th>
                    <th className="p-2">Redeemed</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTickets.map((ticket) => (
                    <tr key={ticket.ticketid} className="text-left">
                      <td className="p-2 whitespace-nowrap">{ticket.buyer_name}</td>
                      <td className="p-2 whitespace-nowrap">{ticket.buyer_email}</td>
                      <td className="p-2 whitespace-nowrap">{ticket.buyer_phone_number}</td>
                      <td className="p-2 whitespace-nowrap">{formatDateTime(ticket.created_at)}</td>
                      <td className="p-2 whitespace-nowrap">{ticket.is_redeemed ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
                            <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 bg-gray-700 text-white rounded ${
                    currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'
                  }`}
                >
                  Previous
                </button>
                <p>
                  Page {currentPage} of {totalPages}
                </p>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 bg-gray-700 text-white rounded ${
                    currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
          <form onSubmit={handlePasswordSubmit} className="w-full sm:w-1/2">
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 border border-gray-700 rounded bg-gray-800 text-white w-full"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full mt-4"
            >
              Login
            </button>
          </form>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default PurchasedTickets;

