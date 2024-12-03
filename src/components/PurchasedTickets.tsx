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
        setTickets(data);
        setFilteredTickets(data);
      } catch (err) {
        setError('Failed to fetch tickets.');
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  useEffect(() => {
    const filtered = tickets.filter(
      (ticket) =>
        ticket.buyer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.buyer_email.toLowerCase().includes(searchQuery.toLowerCase())
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
    doc.text('Purchased Tickets', 14, 10);

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

          <div className="flex justify-between items-center bg-gray-800 text-white rounded p-4 mb-4">
            <p className="text-lg font-medium">
              Total Sold Tickets: <span className="font-bold">{tickets.length}</span>
            </p>
            <div className="flex gap-4">
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
                    <td className="p-2">{ticket.buyer_name}</td>
                    <td className="p-2">{ticket.buyer_email}</td>
                    <td className="p-2">{ticket.buyer_phone_number}</td>
                    <td className="p-2">{formatDateTime(ticket.created_at)}</td>
                    <td className="p-2">{ticket.is_redeemed ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`mx-1 px-3 py-1 ${
                    currentPage === page ? 'bg-blue-600' : 'bg-gray-800'
                  } text-white rounded`}
                >
                  {page}
                </button>
              )
            )}
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center min-h-screen bg-black">
          <form
            onSubmit={handlePasswordSubmit}
            className="bg-black border border-white p-8 rounded-lg shadow-lg max-w-md w-full"
          >
            <h2 className="text-3xl text-center text-red-500 mb-6 font-semibold">
              Authentication Required
            </h2>
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
            {error && <p className="text-center text-red-500 mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PurchasedTickets;
