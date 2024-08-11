import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, update } from 'firebase/database';
import styled from 'styled-components';

// Initialize Firebase (replace with your own config)
const firebaseConfig = {
  apiKey: "AIzaSyBCRlaLVUuCvPCpu1Np-K9vnrInzLMrxek",
  authDomain: "react-test-ed722.firebaseapp.com",
  databaseURL: "https://react-test-ed722-default-rtdb.firebaseio.com",
  projectId: "react-test-ed722",
  storageBucket: "react-test-ed722.appspot.com",
  messagingSenderId: "1032537159804",
  appId: "1:1032537159804:web:ec1b14a202238094d5b1f9",
  measurementId: "G-1WXFTY2K5T"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

interface BookingDetail {
  id: string;
  customerName: string;
  customerEmail: string;
}

interface PaymentData {
  amount: number;
  description: string;
  date: string;
  booking: BookingDetail;
  id?: string;  // Marking id as optional
}

const Payment: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedBooking, setSelectedBooking] = useState<string>('');
  const [bookings, setBookings] = useState<BookingDetail[]>([]);
  const [bookingDetails, setBookingDetails] = useState<BookingDetail | null>(null);
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [editingPayment, setEditingPayment] = useState<PaymentData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Fetch booking details from Firebase
    const bookingsRef = ref(database, 'BookingDetails');
    onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const bookingList = Object.keys(data).map((key) => ({
          id: key,
          customerName: data[key].customerName,
          customerEmail: data[key].customerEmail,
        }));
        setBookings(bookingList);
      }
    });
  }, []);

  useEffect(() => {
    // Fetch payment details from Firebase
    const paymentsRef = ref(database, 'payments');
    onValue(paymentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const paymentList = Object.keys(data).map((key) => ({
          ...data[key],
          id: key,
        }));
        setPayments(paymentList);
      }
    });
  }, []);

  useEffect(() => {
    // Update booking details when selected booking changes
    if (selectedBooking) {
      const booking = bookings.find(b => b.id === selectedBooking);
      setBookingDetails(booking || null);
    }
  }, [selectedBooking, bookings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Ensure bookingDetails is not null before proceeding
    if (!bookingDetails) {
      alert('Please select a booking.');
      setIsLoading(false);
      return;
    }

    const paymentData: PaymentData = {
      amount: parseFloat(amount),
      description,
      date: new Date().toISOString(),
      booking: bookingDetails,
      id: editingPayment?.id // Include id only if editing
    };

    try {
      if (editingPayment) {
        // Update existing payment
        await update(ref(database, `payments/${editingPayment.id}`), paymentData);
      } else {
        // Add new payment
        await push(ref(database, 'payments'), paymentData);
      }
      alert('Payment saved successfully!');
      setAmount('');
      setDescription('');
      setSelectedBooking('');
      setEditingPayment(null);
    } catch (error) {
      alert('Error saving payment. Please try again.');
      console.error('Error saving payment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (payment: PaymentData) => {
    setAmount(payment.amount.toString());
    setDescription(payment.description);
    setSelectedBooking(payment.booking.id);
    setEditingPayment(payment);
  };


  return (
    <div>
      <PaymentContainer>
        <h2>{editingPayment ? 'Edit Payment' : 'Add Payment'}</h2>
        <PaymentForm onSubmit={handleSubmit}>
          <InputGroup>
            <label htmlFor="amount">Amount:</label>
            <Input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <label htmlFor="description">Description:</label>
            <Input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <label htmlFor="booking">Booking:</label>
            <Select
              id="booking"
              value={selectedBooking}
              onChange={(e) => setSelectedBooking(e.target.value)}
              required
            >
              <option value="">Select a booking</option>
              {bookings.map(booking => (
                <option key={booking.id} value={booking.id}>
                  {booking.customerName}
                </option>
              ))}
            </Select>
          </InputGroup>
          {bookingDetails && (
            <BookingDetails>
              <h3>Booking Details:</h3>
              <p><strong>Customer Name:</strong> {bookingDetails.customerName}</p>
              <p><strong>Customer Email:</strong> {bookingDetails.customerEmail}</p>
            </BookingDetails>
          )}
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Saving Payment...' : editingPayment ? 'Update Payment' : 'Add Payment'}
          </SubmitButton>
        </PaymentForm>
        {isLoading && <LoadingOverlay>Processing...</LoadingOverlay>}
      </PaymentContainer>
      <TableContainer>
        <h2>Payments List</h2>
        <Table>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Description</th>
              <th>Booking</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.id}>
                <td>{payment.amount}</td>
                <td>{payment.description}</td>
                <td>{payment.booking.customerName}</td>
                <td>{new Date(payment.date).toLocaleDateString()}</td>
                <td>
                  <Button onClick={() => handleEdit(payment)}>Edit</Button>
                  <Button onClick={() => alert(JSON.stringify(payment, null, 2))}>Details</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </div>
  );
};

const PaymentContainer = styled.div`
  max-width: 600px; /* Increased width */
  margin: 0 auto;
  padding: 30px; /* Increased padding */
  background-color: #f0f8ff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Increased shadow */
`;

const PaymentForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputGroup = styled.div`
  margin-bottom: 20px; /* Increased margin-bottom */

  label {
    display: block;
    margin-bottom: 10px; /* Increased margin-bottom */
    font-weight: bold;
    color: #333;
    font-size: 18px; /* Increased font size */
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px; /* Increased padding */
  border: 1px solid #ccc;
  border-radius: 6px; /* Slightly increased border-radius */
  font-size: 18px; /* Increased font size */
`;

const Select = styled.select`
  width: 100%;
  padding: 12px; /* Increased padding */
  border: 1px solid #ccc;
  border-radius: 6px; /* Slightly increased border-radius */
  font-size: 18px; /* Increased font size */
`;

const SubmitButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 12px 20px; /* Increased padding */
  border: none;
  border-radius: 6px; /* Slightly increased border-radius */
  font-size: 18px; /* Increased font size */
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 24px; /* Increased font size */
`;

const BookingDetails = styled.div`
  margin-top: 20px; /* Increased margin-top */
  padding: 15px; /* Increased padding */
  border: 1px solid #ccc;
  border-radius: 6px; /* Slightly increased border-radius */
  background-color: #fff;
  font-size: 18px; /* Increased font size */
`;

const TableContainer = styled.div`
  max-width: 800px; /* Increased width */
  margin: 30px auto; /* Added margin for spacing */
  padding: 20px; /* Added padding */
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Increased shadow */
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #f2f2f2;
    font-size: 18px; /* Increased font size */
  }

  tr:hover {
    background-color: #f1f1f1;
  }
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  margin: 0 5px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

export default Payment;
