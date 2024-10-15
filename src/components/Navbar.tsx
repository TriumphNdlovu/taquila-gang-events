// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const handleSignOut = async () => {
    // Implement your sign-out logic
  };

  return (
    <nav className="bg-white shadow p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src="/TEQUILA_LOGO.jpeg" alt="Logo" className="h-10 mr-2" />
          <span className="text-xl font-bold">TEQUILA GANG TICKET SHOP</span>
        </Link>
        

      </div>
    </nav>
  );
};


export default Navbar;
