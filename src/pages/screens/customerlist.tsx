import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import styled from 'styled-components';

// Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

interface Customer {
  id: string;
  name: string;
  email: string;
  checkIn: string;
  checkOut: string;
  roomNumber: string;
}

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const customersRef = ref(database, 'customers');
    onValue(customersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const customerList = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as Omit<Customer, 'id'>),
        }));
        setCustomers(customerList);
      }
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <LoadingIndicator>Loading customers...</LoadingIndicator>;
  }

  return (
    <Container>
      <Title>Customer List</Title>
      {customers.length === 0 ? (
        <NoCustomers>No customers found.</NoCustomers>
      ) : (
        <CustomerGrid>
          {customers.map((customer) => (
            <CustomerCard key={customer.id}>
              <CustomerName>{customer.name}</CustomerName>
              <CustomerInfo>Email: {customer.email}</CustomerInfo>
              <CustomerInfo>Check-in: {customer.checkIn}</CustomerInfo>
              <CustomerInfo>Check-out: {customer.checkOut}</CustomerInfo>
              <CustomerInfo>Room: {customer.roomNumber}</CustomerInfo>
            </CustomerCard>
          ))}
        </CustomerGrid>
      )}
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  font-family: 'Arial', sans-serif;
`;

const Title = styled.h1`
  color: #2196f3;
  text-align: center;
  margin-bottom: 30px;
`;

const LoadingIndicator = styled.div`
  text-align: center;
  font-size: 18px;
  color: #2196f3;
  margin-top: 50px;
`;

const NoCustomers = styled.div`
  text-align: center;
  font-size: 18px;
  color: #757575;
  margin-top: 50px;
`;

const CustomerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const CustomerCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CustomerName = styled.h2`
  color: #2196f3;
  font-size: 20px;
  margin-bottom: 10px;
`;

const CustomerInfo = styled.p`
  color: #757575;
  font-size: 14px;
  margin: 5px 0;
`;

export default CustomerList;