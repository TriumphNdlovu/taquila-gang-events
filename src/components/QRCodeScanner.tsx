// src/pages/QRCodeScannerPage.tsx
import React, { useState } from 'react';
import { useZxing } from 'react-zxing';
import { is_redeemed, validateTicket } from '../services/ticketService';
import { useNavigate } from 'react-router-dom';

const QRCodeScannerPage: React.FC = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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

        if(isRedeemed){
          setError('Ticket has already been redeemed');
        }
        else{
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-6">QR Code Scanner</h1>
      <div className="w-full max-w-md p-4 bg-white shadow rounded-lg">
        <div className="mb-4">
          <h2 className="text-l font-semibold text-red-600 items-center">Authorised User Only!!</h2>
          <p className="text-gray-600">Align the QR code within the frame to scan.</p>
        </div>
        <div className="border rounded-md overflow-hidden mb-4">
          <video ref={ref} className="w-full" />
        </div>
        {scanResult && (
          <div className="bg-green-100 p-3 rounded text-green-800 mb-4">
            <p className="font-semibold">Scan Result:</p>
            <p>{scanResult}</p>
          </div>
        )}
        {error && (
          <div className="bg-red-100 p-3 rounded text-red-800">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}
      </div>
      <button
        onClick={() => setScanResult(null)}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Scan Again
      </button>
    </div>
  );
};

export default QRCodeScannerPage;
