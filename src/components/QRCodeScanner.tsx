// src/pages/QRCodeScannerPage.tsx
import React, { useState, useEffect } from 'react';
import { useZxing } from 'react-zxing';
import { is_redeemed, validateTicket } from '../services/ticketService';
import { useNavigate } from 'react-router-dom';

const QRCodeScannerPage: React.FC = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  // Check localStorage for the 'isAuthenticated' flag when the component mounts
  useEffect(() => {
    const storedAuthStatus = localStorage.getItem('isAuthenticated');
    if (storedAuthStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Use the useZxing hook to set up the scanner
  const { ref } = useZxing({
    onDecodeResult(result) {
      const scannedData = result.getText();
      setScanResult(scannedData);
      handleValidation(scannedData);
      setError(null);
    },
    onError(err) {
      setError('An error occurred while scanning. Please try again.');
      console.error(err);
    },
  });

  const handleValidation = async (scannedData: string) => {
    try {
      const isValid = await validateTicket(scannedData);

      if (isValid) {
        const isRedeemed = await is_redeemed(scannedData);

        if (isRedeemed) {
          setError('Ticket has already been redeemed');
        } else {
          navigate('/validticket', { state: { ticketId: scannedData } });
        }
      } else {
        setError('Invalid ticket. Please try again.');
      }
    } catch (validationError) {
      console.error('Error during validation:', validationError);
      setError('An error occurred while validating the ticket.');
    }
  };

  const handlePasswordSubmit = () => {
    const correctPassword = process.env.REACT_APP_SECRET_PASS;
    if (password === correctPassword) {
      setIsAuthenticated(true);
      // Store authentication status in localStorage
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      {!isAuthenticated ? (
        <div className="max-w-md w-full bg-black border border-white p-6 rounded-lg shadow-lg text-center">
          <h1 className="text-3xl font-semibold text-red-600 mb-6">Authentication Required</h1>
          <div className="mb-6">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="px-4 py-2 w-full border border-white rounded mb-4 text-white bg-transparent focus:outline-none"
            />
            {error && <p className="text-red-600">{error}</p>}
            <button
              onClick={handlePasswordSubmit}
              className="px-6 py-2 bg-white text-black w-full border border-black rounded hover:bg-black hover:text-white transition duration-300 ease-in-out"
            >
              Submit
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-md w-full bg-black border border-white p-6 rounded-lg shadow-lg text-center">
          <h1 className="text-3xl font-semibold text-green-600 mb-6">QR Code Scanner</h1>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-red-600">Authorised User Only!!</h2>
            <p className="text-white">Align the QR code within the frame to scan.</p>
          </div>

          {/* QR Scanner Video */}
          <div className="border rounded-md overflow-hidden mb-6">
            <video ref={ref} className="w-full" />
          </div>

          {/* Scan Result Display */}
          {scanResult && (
            <div className="bg-green-100 p-3 rounded text-green-800 mb-4">
              <p className="font-semibold">Scan Result:</p>
              <p>{scanResult}</p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-100 p-3 rounded text-red-800 mb-4">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {/* Scan Again Button */}
          <button
            onClick={() => setScanResult(null)}
            className="px-6 py-2 bg-white text-black w-full border border-black rounded hover:bg-black hover:text-white transition duration-300 ease-in-out"
          >
            Scan Again
          </button>
        </div>
      )}
    </div>
  );
};

export default QRCodeScannerPage;
