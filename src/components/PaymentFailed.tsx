import React from 'react';
import { Link } from 'react-router-dom';

const PaymentFailed: React.FC = () => {
    return (
        <div className="bg-gray-100 flex justify-center items-center h-screen">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <h1 className="text-2xl font-bold mb-4 text-red-500">Payment Failed</h1>
                <p>Unfortunately, your payment could not be processed. Please try again.</p>
                <Link to="/" className="bg-gray-500 text-white px-4 py-2 mt-4 rounded hover:bg-gray-600">
                    Go Home
                </Link>
            </div>
        </div>
    );
};

export default PaymentFailed;
