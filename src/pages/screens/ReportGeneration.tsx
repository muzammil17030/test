import  { useState } from 'react';
import { db } from '../../config/firebaseConfig'; // Ensure you have this file set up
import { collection, addDoc } from 'firebase/firestore';
import styled from 'styled-components';

const ReportContainer = styled.div`
  max-width: 500px;
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
`;

const Input = styled.input`
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid #add8e6;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid #add8e6;
  border-radius: 4px;
  resize: vertical;
`;

const SubmitButton = styled.button`
  background-color: #4169e1;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #1e90ff;
  }
`;

export default function Report() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'reports'), {
        title,
        description,
        createdAt: new Date()
      });
      alert('Report submitted successfully!');
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Error submitting report. Please try again.');
    }
  };

  return (
    <ReportContainer>
      <Title>Submit a Report</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Report Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextArea
          placeholder="Report Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <SubmitButton type="submit">Submit Report</SubmitButton>
      </Form>
    </ReportContainer>
  );
}