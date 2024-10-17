export interface Ticket {
  ticketid: string;
  orderId: string; 
  quantity: number; 
  buyer_email: string;
  buyer_name: string;
  buyer_phone_number: string;
  is_redeemed: boolean;
};