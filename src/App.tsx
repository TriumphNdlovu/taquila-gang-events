import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import BuyTicket from './components/BuyTicket';
import Navbar from './components/Navbar';
import PaymentSuccess from './components/PaymentSuccess';
import PaymentFailed from './components/PaymentFailed';
import PaymentCanceled from './components/PaymentCanceled';

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
        </Routes>
      </div>
       
    </Router>
  );
};

export default App;