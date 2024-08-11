import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Signup from '../pages/signup.tsx';
import Login from '../pages/login.tsx';
import Dashboard from '../pages/Dashboard.tsx';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="dashboard/*" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;