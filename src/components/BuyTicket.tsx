import { Event } from '../models/event';
import { fetchEventById } from '../services/eventService';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { genarateTicketId } from '../services/ticketService';

const BuyTicket: React.FC = () => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();

  const [event, setEvent] = useState<Event | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [buyerEmail, setBuyerEmail] = useState<string>('');
  const [buyerName, setBuyerName] = useState<string>('');
  const [buyerPhoneNumber, setBuyerPhoneNumber] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isPaymentInitiated, setIsPaymentInitiated] = useState<boolean>(false);
  const [ticketId , setTicketId] = useState<string>('');

  useEffect(() => {
    const getEvent = async () => {
      const eventData = await fetchEventById(eventId!);
      const ticketId = await genarateTicketId();
      // Formatting date
      const isoDate = eventData!.date;
      const dateObject = new Date(isoDate);
      const formattedDate = dateObject.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      eventData!.date = formattedDate;

      setEvent(eventData);
      setTicketId(ticketId!);
    };

    getEvent();
  }, [eventId]);

  const handleBuyTicket = () => {
    if (event) {
      setIsPaymentInitiated(true); 
    }
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(Number(event.target.value));
  };

  const validateInputs = (): boolean => {
    if (!buyerName || !buyerEmail || !buyerPhoneNumber) {
      setError('Please fill in all fields.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(buyerEmail)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (!/^\d+$/.test(buyerPhoneNumber)) {
      setError('Please enter a valid phone number.');
      return false;
    }
    setError(null); // Clear any previous errors
    return true;
  };

  const handleSubmit = (eventt: React.FormEvent<HTMLFormElement>) => {
    eventt.preventDefault(); // Prevent form submission
    if (validateInputs()) {
        localStorage.setItem('cartTotal', (event?.price! * quantity).toFixed(2));
        localStorage.setItem('buyerName', buyerName);
        localStorage.setItem('buyerEmail', buyerEmail);
        localStorage.setItem('buyerPhoneNumber', buyerPhoneNumber);
        localStorage.setItem('quantity', quantity.toString());
      eventt.currentTarget.submit();
    }

  };

  return (
    <div className="max-w-md mx-auto p-6 text-white">
      <div className="text-center text-4xl font-bold my-6">
        <h1>Purchase your ticket below!</h1>
      </div>
      {event ? (
        <div className="border border-gray-700 rounded-lg text-white shadow-md p-4 items-center">
          <h2 className="text-2xl font-bold ">{event.title}</h2>
          <p>at {event.venue}</p>
          <p>{event.date}</p>
          <p>ZAR {event.price} each</p>

          {/* Quantity Selector */}
          {/* <div className="my-4">
            <label htmlFor="quantity" className="block text-lg font-semibold mb-2">How many tickets:</label>
            <select 
              id="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              className="w-full p-2 border border-gray-400 rounded-md text-black"
            >
              {[...Array(10).keys()].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div> */}

          {/* Total Price Display */}
          <p className="text-lg font-semibold my-2 text-green-600">Total: ZAR {(event.price * quantity).toFixed(2)}</p>

          {error && <p className="text-red-500">{error}</p>}
          {!isPaymentInitiated ? (
            <button 
              onClick={handleBuyTicket} 
              className="border border-white text-white px-4 py-2 w-full rounded-md hover:bg-black hover:text-white transition"
            >
              Buy
            </button>
          ) : (
            // Render Fastpay form when payment is initiated
            <form
              name="PayFastPayNowForm"
              action="https://payment.payfast.io/eng/process"
              method="post"
              onSubmit={handleSubmit}
            >
              <input type="hidden" name="cmd" value="_paynow" required />
              <input type="hidden" name="receiver" pattern="[0-9]" value="24876753" required />
              <input type="hidden" name="return_url" value={`https://tequila-gang-events.vercel.app/payment-success?ticketId=${ticketId}`}/>
              <input type="hidden" name="cancel_url" value={`https://tequila-gang-events.vercel.app/payment-failed`} />
              <input type="hidden" name="notify_url" value="https://www.NotifyURL.com" />
              <input type="hidden" name="amount" value="5" required />
              {/* <input type="hidden" name="amount" value={(event.price * quantity).toFixed(2)} required /> */}
              <input type="hidden" name="item_name" maxLength={255} value={event.title} required />
              <input type="hidden" name="item_description" maxLength={255} value={'at ' + event.venue} />
              <input type="hidden" name="name_first" value={buyerName}/>
              <input type="hidden" name="email_address" value={buyerEmail}/>
              <input type="hidden" name="cell_number" value={buyerPhoneNumber}/> 

              <div className='text-white'>

              
              <div className="my-4">
                <label htmlFor="buyerName" className="block text-lg font-semibold mb-2">Fullname:</label>
                <input
                  type="text"
                  id="buyerName"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder='e.g John Doe'
                  required
                  className="w-full p-2 border border-gray-400 rounded-md text-black"
                />
              </div>
              <div className="my-4">
                <label htmlFor="buyerEmail" className="block text-lg font-semibold mb-2">Email Address:</label>
                <input
                  type="email"
                  id="buyerEmail"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  placeholder='e.g. tequilagang@gmail.com'
                  required
                  className="w-full p-2 border border-gray-400 rounded-md text-black"
                />
              </div>
              <div className="my-4">
                <label htmlFor="buyerPhoneNumber" className="block text-lg font-semibold mb-2">Phone Number:</label>
                <input
                  type="tel"
                  id="buyerPhoneNumber"
                  value={buyerPhoneNumber}
                  onChange={(e) => setBuyerPhoneNumber(e.target.value)}
                  required
                  placeholder='e.g. 0712345678'
                  className="w-full p-2 border border-gray-400 rounded-md text-black"
                />
              </div>
              
              <div className="text-center">
                <input
                  type="image"
                  src="https://my.payfast.io/images/buttons/PayNow/Dark-Large-PayNow.png"
                  alt="Pay Now"
                  title="Pay Now with Payfast"
                />
              </div>
              </div>
            </form>
          )}
        </div>
      ) : (
        <p className="text-gray-400">Loading...</p>
      )}
    </div>
  );
};

export default BuyTicket;
