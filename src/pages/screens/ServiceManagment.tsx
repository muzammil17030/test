import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db } from '../../config/firebaseConfig'; 
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// Styled components
const ServiceContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f0f8ff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #1e90ff;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid #add8e6;
  border-radius: 4px;
`;

const Button = styled.button`
  background-color: #4169e1;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-right: 0.5rem;

  &:hover {
    background-color: #1e90ff;
  }
`;

const ServiceList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ServiceItem = styled.li`
  background-color: white;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

// Types
interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
}

export default function ServiceManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const serviceCollection = collection(db, 'services');
    const serviceSnapshot = await getDocs(serviceCollection);
    const serviceList = serviceSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Service));
    setServices(serviceList);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateService(editingId);
    } else {
      await addService();
    }
    clearForm();
    fetchServices();
  };

  const addService = async () => {
    try {
      await addDoc(collection(db, 'services'), {
        name,
        description,
        price: Number(price)
      });
      alert('Service added successfully!');
    } catch (error) {
      console.error('Error adding service: ', error);
      alert('Error adding service. Please try again.');
    }
  };

  const updateService = async (id: string) => {
    try {
      const serviceDoc = doc(db, 'services', id);
      await updateDoc(serviceDoc, {
        name,
        description,
        price: Number(price)
      });
      alert('Service updated successfully!');
      setEditingId(null);
    } catch (error) {
      console.error('Error updating service: ', error);
      alert('Error updating service. Please try again.');
    }
  };

  const deleteService = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteDoc(doc(db, 'services', id));
        alert('Service deleted successfully!');
        fetchServices();
      } catch (error) {
        console.error('Error deleting service: ', error);
        alert('Error deleting service. Please try again.');
      }
    }
  };

  const editService = (service: Service) => {
    setName(service.name);
    setDescription(service.description);
    setPrice(service.price.toString());
    setEditingId(service.id);
  };

  const clearForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setEditingId(null);
  };

  return (
    <ServiceContainer>
      <Title>Service Management</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Service Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Service Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <Input
          type="number"
          placeholder="Service Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <Button type="submit">{editingId ? 'Update' : 'Add'} Service</Button>
        {editingId && <Button type="button" onClick={clearForm}>Cancel</Button>}
      </Form>

      <ServiceList>
        {services.map((service) => (
          <ServiceItem key={service.id}>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <p>Price: ${service.price}</p>
            <Button onClick={() => editService(service)}>Edit</Button>
            <Button onClick={() => deleteService(service.id)}>Delete</Button>
          </ServiceItem>
        ))}
      </ServiceList>
    </ServiceContainer>
  );
}