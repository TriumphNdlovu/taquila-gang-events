// src/pages/TicketValidPage.tsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TicketValidPage: React.FC = () => {
  const location = useLocation();
  const { ticketId } = location.state as { ticketId: string };



  return (
    <div className="min-h-screen bg-green-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4 text-green-500">Ticket Valid</h1>
      <p className="text-gray-800 mb-4">The scanned ticket is valid.</p>
      <p className="text-gray-600">Ticket ID: {ticketId}</p>
      {/* redeem and scan again */}
        <button
            onClick={() => window.location.href = '/abottleofbread'}
            className="mt-4 px-6 py-2 bg-white text-black w-full border border-black rounded hover:bg-black hover:text-white transition duration-300 ease-in-out"
        >
            Reedeem Ticket & Scan Again
        </button>
      <button
        onClick={() => window.location.href = '/abottleofbread'}
        className="mt-4 px-6 py-2 bg-white text-black w-full border border-black rounded hover:bg-black hover:text-white transition duration-300 ease-in-out"
      >
        Scan Again
      </button>
    </div>
  );
};

export default TicketValidPage;
