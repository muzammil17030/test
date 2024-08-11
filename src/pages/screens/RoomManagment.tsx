import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, remove, update } from 'firebase/database';
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

interface RoomData {
  name: string;
  type: string;
  status: string;
  id?: string;
}

const RoomManagement: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [editingRoom, setEditingRoom] = useState<RoomData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const roomsRef = ref(database, 'rooms');
    const unsubscribe = onValue(roomsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const roomList = Object.entries(data).map(([key, value]) => ({
          ...(value as RoomData),
          id: key,
        }));
        setRooms(roomList);
      } else {
        setRooms([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const roomData: RoomData = {
      name,
      type,
      status,
    };

    try {
      if (editingRoom?.id) {
        await update(ref(database, `rooms/${editingRoom.id}`), roomData);
      } else {
        await push(ref(database, 'rooms'), roomData);
      }
      alert('Room saved successfully!');
      resetForm();
    } catch (error) {
      console.error('Error saving room:', error);
      alert('Error saving room. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setType('');
    setStatus('');
    setEditingRoom(null);
  };

  const handleEdit = (room: RoomData) => {
    setName(room.name);
    setType(room.type);
    setStatus(room.status);
    setEditingRoom(room);
  };

  const handleDelete = async (roomId?: string) => {
    if (roomId && window.confirm('Are you sure you want to delete this room?')) {
      try {
        await remove(ref(database, `rooms/${roomId}`));
        alert('Room deleted successfully!');
      } catch (error) {
        console.error('Error deleting room:', error);
        alert('Error deleting room. Please try again.');
      }
    }
  };

  return (
    <Container>
      <RoomContainer>
        <h2>{editingRoom ? 'Edit Room' : 'Add Room'}</h2>
        <RoomForm onSubmit={handleSubmit}>
          <InputGroup>
            <label htmlFor="name">Room Name:</label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <label htmlFor="type">Room Type:</label>
            <Input
              type="text"
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <label htmlFor="status">Status:</label>
            <Select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="">Select status</option>
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Maintenance">Maintenance</option>
            </Select>
          </InputGroup>
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Saving Room...' : editingRoom ? 'Update Room' : 'Add Room'}
          </SubmitButton>
        </RoomForm>
        {isLoading && <LoadingOverlay>Processing...</LoadingOverlay>}
      </RoomContainer>
      <TableContainer>
        <h2>Rooms List</h2>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map(room => (
              <tr key={room.id}>
                <td>{room.name}</td>
                <td>{room.type}</td>
                <td>{room.status}</td>
                <td>
                  <Button onClick={() => handleEdit(room)}>Edit</Button>
                  <Button onClick={() => handleDelete(room.id)}>Delete</Button>
                  <Button onClick={() => alert(JSON.stringify(room, null, 2))}>Details</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const RoomContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const RoomForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 10px;
    font-weight: bold;
    color: #333;
    font-size: 16px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;

const SubmitButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
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
  font-size: 24px;
`;

const TableContainer = styled.div`
  max-width: 800px;
  margin: 30px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #f2f2f2;
    font-size: 16px;
  }

  tr:hover {
    background-color: #f9f9f9;
  }
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 6px 12px;
  margin: 0 5px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

export default RoomManagement;