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

const App: React.FC = () => {
  return (
    <Router>
      <div className='bg-[#0c0c0d] h-full'>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/buy-ticket/:eventId" element={<BuyTicket />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
          <Route path="/payment-cancel" element={<PaymentCanceled />} />
          <Route path="/abottleofbread" element={<QRCodeScanner />} />
          <Route path="/validticket" element={<TicketValidPage />} />
          <Route path="/thanks" element={<Thanks/>} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </div>
       
    </Router>
  );
};

export default App;