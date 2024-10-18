import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src="/TEQUILA_LOGO.jpeg" alt="Logo" className="h-8 w-8 mr-2" />
          <span className="text-xl font-bold">TICKET SHOP</span>
        </Link>
        <a
          href="https://www.Tequilagangsa.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white p-1 text-black px-4 rounded-md hover:bg-black hover:text-white transition duration-300 border border-black"
        >
          Home
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
