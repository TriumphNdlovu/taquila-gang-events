import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import BuyTicket from './components/BuyTicket';
import Navbar from './components/Navbar';
import PaymentSuccess from './components/PaymentSuccess';
import PaymentFailed from './components/PaymentFailed';
import PaymentCanceled from './components/PaymentCanceled';
import Thanks from './components/Thanks';
import QRCodeScanner from './components/QRCodeScanner';
import TicketValidPage from './components/TicketValidPage';
import PurchasedTickets from './components/PurchasedTickets';

const App: React.FC = () => {
  return (
    <Router>
        <Navbar />
      <div className='bg-red-600 h-screen'>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/buy-ticket/:eventId" element={<BuyTicket />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
          <Route path="/payment-cancel" element={<PaymentCanceled />} />
          <Route path="/abottleofbread" element={<QRCodeScanner />} />
          <Route path="/validticket" element={<TicketValidPage />} />
          <Route path="/allbreads" element={<PurchasedTickets/>} />
          <Route path="/thanks" element={<Thanks/>} />
          <Route path="*" element={<h1 className='text-white min-h-screen flex justify-center items-center'>
            <div>
              <p> Page Not Found :( </p>
          
            <button onClick={() => window.location.href = '/'} className="mt-4 px-6 py-2 bg-white text-black w-full border border-black rounded hover:bg-black hover:text-white transition duration-300 ease-in-out">
              Go Home
            </button>
            </div>
            
              </h1>} />

        </Routes>
      </div>
       
    </Router>
  );
};

export default App;