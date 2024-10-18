import React from 'react';

const PaymentCanceled: React.FC = () => {
    return (
        <div className="bg-black flex justify-center items-center h-screen">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <h1 className="text-2xl font-bold mb-4 text-yellow-500">Payment Canceled</h1>
                <p>Unfortunately, your payment could not be processed. Please try again</p>
                <button
                    onClick={() => window.location.href = '/'}
                    className="bg-yellow-500 text-white px-4 py-2 mt-4 rounded hover:bg-yellow-600"
                >
                    Go back home
                </button>
            </div>
        </div>
    );
};

export default PaymentCanceled;