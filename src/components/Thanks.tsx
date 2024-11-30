import React from 'react';

const Thanks: React.FC = () => {
    return (
        <div className="bg-gray-100 flex flex-col justify-center items-center h-screen p-4">
            <h1 className="text-3xl font-bold text-center mb-4">Payment Successful! 🥳</h1>
            <p className="text-lg text-center mb-4">
                Thank you for your purchase! Your ticket has been downloaded and sent to your email.
                <span className="text-red-400">Please check your spam folder if you don't see it in your inbox.</span>
            </p>
            <button
                onClick={() => window.location.replace('https://www.tequilagangsa.com')}
                className="mt-4 px-6 py-2 bg-white text-black w-full border border-black rounded hover:bg-black hover:text-white transition duration-300 ease-in-out"
            >
                Back to Home
            </button>
        </div>
    );
};

export default Thanks;
