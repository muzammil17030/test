// CustomerManagement.tsx
import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push } from 'firebase/database';
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

const CustomerManagement: React.FC = () => {
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'id'>>({
    name: '',
    email: '',
    checkIn: '',
    checkOut: '',
    roomNumber: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const customersRef = ref(database, 'customers');
    try {
      await push(customersRef, newCustomer);
      setNewCustomer({
        name: '',
        email: '',
        checkIn: '',
        checkOut: '',
        roomNumber: '',
      });
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error("Error adding customer:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Title>Customer Management System</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          value={newCustomer.name}
          onChange={handleInputChange}
          placeholder="Name"
          required
        />
        <Input
          type="email"
          name="email"
          value={newCustomer.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
        />
        <Input
          type="date"
          name="checkIn"
          value={newCustomer.checkIn}
          onChange={handleInputChange}
          required
        />
        <Input
          type="date"
          name="checkOut"
          value={newCustomer.checkOut}
          onChange={handleInputChange}
          required
        />
        <Input
          type="text"
          name="roomNumber"
          value={newCustomer.roomNumber}
          onChange={handleInputChange}
          placeholder="Room Number"
          required
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Customer'}
        </Button>
      </Form>
      {showAlert && <Alert>Customer added successfully!</Alert>}
    </Container>
  );
};

const Container = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 30px;
  font-family: 'Arial', sans-serif;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #1e90ff;
  text-align: center;
  margin-bottom: 30px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #87cefa;
  border-radius: 6px;
  font-size: 16px;
  background-color: #ffffff;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #1e90ff;
  }
`;

const Button = styled.button`
  padding: 12px;
  background-color: #1e90ff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e3f2fd;
  }

  &:disabled {
    background-color:#e3f2fd;
    cursor: not-allowed;
  }
`;

const Alert = styled.div`
  margin-top: 20px;
  padding: 10px;
  background-color: #e3f2fd;
  color: #e3f2fd;
  border-radius: 6px;
  text-align: center;
  font-weight: bold;
`;

export default CustomerManagement;