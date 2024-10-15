import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import BuyTicket from './components/BuyTicket';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  return (
    <Router>
      <div className='bg-[#0c0c0d] h-full'>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/buy-ticket/:eventId" element={<BuyTicket />} />
        </Routes>
      </div>
       
    </Router>
  );
};

export default App;