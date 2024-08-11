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

interface StaffMember {
  id?: string;
  name: string;
  position: string;
  contactNumber: string;
  email: string;
  isPresent: boolean;
}

const StaffManagement: React.FC = () => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const staffRef = ref(database, 'staff');
    const unsubscribe = onValue(staffRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const staffArray = Object.entries(data).map(([key, value]) => ({
          ...(value as StaffMember),
          id: key,
        }));
        setStaffList(staffArray);
      } else {
        setStaffList([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const staffData: StaffMember = {
      name,
      position,
      contactNumber,
      email,
      isPresent: false,
    };

    try {
      if (editingStaff?.id) {
        await update(ref(database, `staff/${editingStaff.id}`), staffData);
      } else {
        await push(ref(database, 'staff'), staffData);
      }
      resetForm();
      alert('Staff member saved successfully!');
    } catch (error) {
      console.error('Error saving staff member:', error);
      alert('Error saving staff member. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setPosition('');
    setContactNumber('');
    setEmail('');
    setEditingStaff(null);
  };

  const handleEdit = (staff: StaffMember) => {
    setName(staff.name);
    setPosition(staff.position);
    setContactNumber(staff.contactNumber);
    setEmail(staff.email);
    setEditingStaff(staff);
  };

  const handleDelete = async (staffId?: string) => {
    if (staffId && window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await remove(ref(database, `staff/${staffId}`));
        alert('Staff member deleted successfully!');
      } catch (error) {
        console.error('Error deleting staff member:', error);
        alert('Error deleting staff member. Please try again.');
      }
    }
  };

  const toggleAttendance = async (staff: StaffMember) => {
    try {
      await update(ref(database, `staff/${staff.id}`), {
        isPresent: !staff.isPresent,
      });
    } catch (error) {
      console.error('Error updating attendance:', error);
      alert('Error updating attendance. Please try again.');
    }
  };

  return (
    <Container>
      <FormContainer>
        <h2>{editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}</h2>
        <StaffForm onSubmit={handleSubmit}>
          <InputGroup>
            <label htmlFor="name">Name:</label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <label htmlFor="position">Position:</label>
            <Input
              type="text"
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <label htmlFor="contactNumber">Contact Number:</label>
            <Input
              type="tel"
              id="contactNumber"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <label htmlFor="email">Email:</label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : editingStaff ? 'Update Staff Member' : 'Add Staff Member'}
          </SubmitButton>
        </StaffForm>
      </FormContainer>
      <TableContainer>
        <h2>Staff List</h2>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Attendance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff) => (
              <tr key={staff.id}>
                <td>{staff.name}</td>
                <td>{staff.position}</td>
                <td>{staff.contactNumber}</td>
                <td>{staff.email}</td>
                <td>
                  <AttendanceToggle
                    isPresent={staff.isPresent}
                    onClick={() => toggleAttendance(staff)}
                  >
                    {staff.isPresent ? 'Present' : 'Absent'}
                  </AttendanceToggle>
                </td>
                <td>
                  <ActionButton onClick={() => handleEdit(staff)}>Edit</ActionButton>
                  <ActionButton onClick={() => handleDelete(staff.id)}>Delete</ActionButton>
                  <ActionButton onClick={() => alert(JSON.stringify(staff, null, 2))}>
                    Details
                  </ActionButton>
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
  font-family: 'Arial', sans-serif;
`;

const FormContainer = styled.div`
  background-color: #f0f8ff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const StaffForm = styled.form`
  display: grid;
  gap: 15px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const SubmitButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const TableContainer = styled.div`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th, td {
    text-align: left;
    padding: 12px;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }

  tr:hover {
    background-color: #f5f5f5;
  }
`;

const ActionButton = styled.button`
  background-color: #008cba;
  color: white;
  border: none;
  padding: 5px 10px;
  margin-right: 5px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #007a9e;
  }
`;

const AttendanceToggle = styled.button<{ isPresent: boolean }>`
  background-color: ${(props) => (props.isPresent ? '#4caf50' : '#f44336')};
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => (props.isPresent ? '#45a049' : '#d32f2f')};
  }
`;

export default StaffManagement;