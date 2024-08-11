import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, remove, update } from 'firebase/database';
import styled from 'styled-components';

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

interface Booking {
  id: string;
  customerName: string;
  email: string;
  phoneNumber: string;
  numberOfRooms: number;
  roomType: string;
  totalAdults: number;
  totalChildren: number;
  totalSeniors: number;
  checkIn: string;
  checkOut: string;
}

const BookingDetails: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const bookingsRef = ref(database, 'BookingDetails');
    onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const bookingsList = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as Omit<Booking, 'id'>),
        }));
        setBookings(bookingsList);
      } else {
        setBookings([]);
      }
    });
  }, []);

  const handleDelete = (id: string) => {
    const bookingRef = ref(database, `BookingDetails/${id}`);
    remove(bookingRef);
  };

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking);
  };

  const handleSave = () => {
    if (editingBooking) {
      const bookingRef = ref(database, `BookingDetails/${editingBooking.id}`);
      update(bookingRef, editingBooking);
      setEditingBooking(null);
    }
  };

  const handleDetail = (booking: Booking) => {
    alert(JSON.stringify(booking, null, 2));
  };

  return (
    <Container>
      <Title>Booking Details</Title>
      {bookings.map((booking) => (
        <BookingCard key={booking.id}>
          <BookingField>
            <Label>Customer Name:</Label>
            {editingBooking?.id === booking.id ? (
              <Input
                value={editingBooking.customerName}
                onChange={(e) => setEditingBooking({ ...editingBooking, customerName: e.target.value })}
              />
            ) : (
              <Value>{booking.customerName}</Value>
            )}
          </BookingField>
          <BookingField>
            <Label>Email:</Label>
            {editingBooking?.id === booking.id ? (
              <Input
                value={editingBooking.email}
                onChange={(e) => setEditingBooking({ ...editingBooking, email: e.target.value })}
              />
            ) : (
              <Value>{booking.email}</Value>
            )}
          </BookingField>
          <BookingField>
            <Label>Phone Number:</Label>
            {editingBooking?.id === booking.id ? (
              <Input
                value={editingBooking.phoneNumber}
                onChange={(e) => setEditingBooking({ ...editingBooking, phoneNumber: e.target.value })}
              />
            ) : (
              <Value>{booking.phoneNumber}</Value>
            )}
          </BookingField>
          <BookingField>
            <Label>Number of Rooms:</Label>
            {editingBooking?.id === booking.id ? (
              <Input
                type="number"
                value={editingBooking.numberOfRooms}
                onChange={(e) => setEditingBooking({ ...editingBooking, numberOfRooms: parseInt(e.target.value) })}
              />
            ) : (
              <Value>{booking.numberOfRooms}</Value>
            )}
          </BookingField>
          <BookingField>
            <Label>Check-in:</Label>
            {editingBooking?.id === booking.id ? (
              <Input
                type="date"
                value={editingBooking.checkIn}
                onChange={(e) => setEditingBooking({ ...editingBooking, checkIn: e.target.value })}
              />
            ) : (
              <Value>{booking.checkIn}</Value>
            )}
          </BookingField>
          <BookingField>
            <Label>Check-out:</Label>
            {editingBooking?.id === booking.id ? (
              <Input
                type="date"
                value={editingBooking.checkOut}
                onChange={(e) => setEditingBooking({ ...editingBooking, checkOut: e.target.value })}
              />
            ) : (
              <Value>{booking.checkOut}</Value>
            )}
          </BookingField>
          <MembersBreakdown>
            Adults: {booking.totalAdults}, Children: {booking.totalChildren}, Seniors: {booking.totalSeniors}
          </MembersBreakdown>
          <ButtonGroup>
            {editingBooking?.id === booking.id ? (
              <Button onClick={handleSave}>Save</Button>
            ) : (
              <Button onClick={() => handleEdit(booking)}>Edit</Button>
            )}
            <Button onClick={() => handleDelete(booking.id)}>Delete</Button>
            <Button onClick={() => handleDetail(booking)}>Details</Button>
          </ButtonGroup>
        </BookingCard>
      ))}
    </Container>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 24px;
  color: #007bff;
  text-align: center;
  margin-bottom: 20px;
`;

const BookingCard = styled.div`
  background-color: white;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 15px;
`;

const BookingField = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const Label = styled.span`
  font-weight: bold;
  width: 150px;
`;

const Value = styled.span`
  flex: 1;
`;

const Input = styled.input`
  flex: 1;
  padding: 5px;
  border: 1px solid #ced4da;
  border-radius: 4px;
`;

const MembersBreakdown = styled.div`
  background-color: #e9ecef;
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 8px 12px;
  margin-left: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

export default BookingDetails;