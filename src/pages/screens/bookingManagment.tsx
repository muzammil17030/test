import React, { useState } from 'react';
import { getDatabase, ref, push } from 'firebase/database';
import styled from 'styled-components';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  TextField, 
  Select, 
  MenuItem, 
  Button, 
  Snackbar, 
  Alert,
  Typography,
  SelectChangeEvent,
  IconButton,
  CircularProgress,
  FormControl,
  InputLabel
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a73e8',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

interface BookingData {
  customerName: string;
  email: string;
  phoneNumber: string;
  numberOfRooms: number;
  roomTypes: string[];
  totalAdults: number;
  totalChildren: number;
  totalSeniors: number;
  checkIn: string;
  checkOut: string;
  checkInTime: string;
}

const FormContainer = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 30px;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled(Typography)`
  color: #1a73e8;
  text-align: center;
  margin-bottom: 30px;
  font-weight: bold;
`;

const StyledForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FullWidthField = styled.div`
  grid-column: 1 / -1;
`;

const StyledButton = styled(Button)`
  margin-top: 20px;
`;

const LoadingSpinner = styled(CircularProgress)`
  display: block;
  margin: 0 auto;
`;

const BreakdownField = styled(TextField)`
  && {
    grid-column: 1 / -1;
    background-color: #e3f2fd; /* Light blue background */
    border: 1px solid #1a73e8; /* Blue border */
    border-radius: 4px;
    color: #0d47a1; /* Darker blue text color */
    font-weight: bold;
    font-size: 1rem;
    margin-top: 10px;
  }
`;

const ROOM_TYPE_OPTIONS = [
  { value: 'single', label: 'Single' },
  { value: 'double', label: 'Double' },
  { value: 'other', label: 'Other' },
];

export default function Booking() {
  const [bookingData, setBookingData] = useState<BookingData>({
    customerName: '',
    email: '',
    phoneNumber: '',
    numberOfRooms: 1,
    roomTypes: ['single'],
    totalAdults: 1,
    totalChildren: 0,
    totalSeniors: 0,
    checkIn: '',
    checkOut: '',
    checkInTime: '',
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle TextField changes
  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle room type changes
  const handleRoomTypeChange = (index: number, event: SelectChangeEvent<string>) => {
    const newRoomTypes = [...bookingData.roomTypes];
    newRoomTypes[index] = event.target.value;
    setBookingData(prevData => ({
      ...prevData,
      roomTypes: newRoomTypes,
    }));
  };

  // Add a new room type field
  const addRoomTypeField = () => {
    setBookingData(prevData => ({
      ...prevData,
      roomTypes: [...prevData.roomTypes, 'single'],
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const db = getDatabase();
    const bookingsRef = ref(db, 'BookingDetails');
    
    try {
      await push(bookingsRef, bookingData);
      setOpenSnackbar(true);
      setBookingData({
        customerName: '',
        email: '',
        phoneNumber: '',
        numberOfRooms: 1,
        roomTypes: ['single'],
        totalAdults: 1,
        totalChildren: 0,
        totalSeniors: 0,
        checkIn: '',
        checkOut: '',
        checkInTime: '',
      });
    } catch (error) {
      console.error('Error adding booking: ', error);
      alert('Failed to add booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <FormContainer>
        <FormTitle variant="h4">New Booking</FormTitle>
        <StyledForm onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Customer Name"
            name="customerName"
            value={bookingData.customerName}
            onChange={handleTextFieldChange}
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={bookingData.email}
            onChange={handleTextFieldChange}
            required
          />
          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            type="tel"
            value={bookingData.phoneNumber}
            onChange={handleTextFieldChange}
            required
          />
          <TextField
            fullWidth
            label="Number of Rooms"
            name="numberOfRooms"
            type="number"
            value={bookingData.numberOfRooms}
            onChange={e => setBookingData(prevData => ({
              ...prevData,
              numberOfRooms: Number(e.target.value),
              roomTypes: Array(Number(e.target.value)).fill('single'),
            }))}
            InputProps={{ inputProps: { min: 1 } }}
            required
          />
          {bookingData.roomTypes.map((roomType, index) => (
            <FormControl fullWidth key={index}>
              <InputLabel>Room Type {index + 1}</InputLabel>
              <Select
                value={roomType}
                onChange={event => handleRoomTypeChange(index, event)}
                required
              >
                {ROOM_TYPE_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}
          <Button onClick={addRoomTypeField} variant="outlined" color="primary">
            Add Another Room Type
          </Button>
          <TextField
            fullWidth
            label="Total Adults"
            name="totalAdults"
            type="number"
            value={bookingData.totalAdults}
            onChange={handleTextFieldChange}
            InputProps={{ inputProps: { min: 0 } }}
            required
          />
          <TextField
            fullWidth
            label="Total Children"
            name="totalChildren"
            type="number"
            value={bookingData.totalChildren}
            onChange={handleTextFieldChange}
            InputProps={{ inputProps: { min: 0 } }}
          />
          <TextField
            fullWidth
            label="Total Seniors"
            name="totalSeniors"
            type="number"
            value={bookingData.totalSeniors}
            onChange={handleTextFieldChange}
            InputProps={{ inputProps: { min: 0 } }}
          />
          <BreakdownField
            fullWidth
            label="Total Members Breakdown"
            value={`Adults: ${bookingData.totalAdults}, Children: ${bookingData.totalChildren}, Seniors: ${bookingData.totalSeniors}`}
            InputProps={{ readOnly: true }}
          />
          <TextField
            fullWidth
            label="Check-in Date"
            name="checkIn"
            type="date"
            value={bookingData.checkIn}
            onChange={handleTextFieldChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            fullWidth
            label="Check-out Date"
            name="checkOut"
            type="date"
            value={bookingData.checkOut}
            onChange={handleTextFieldChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            fullWidth
            label="Check-in Time"
            name="checkInTime"
            type="time"
            value={bookingData.checkInTime}
            onChange={handleTextFieldChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <FullWidthField>
            <StyledButton type="submit" variant="contained" color="primary" fullWidth>
              {loading ? <LoadingSpinner size={24} /> : 'Create Booking'}
            </StyledButton>
          </FullWidthField>
        </StyledForm>
      </FormContainer>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          sx={{ width: '100%', bgcolor: '#4caf50', color: '#fff' }}
          action={
            <IconButton 
              size="small" 
              aria-label="close" 
              color="inherit" 
              onClick={handleCloseSnackbar}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          Booking successfully added!
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
