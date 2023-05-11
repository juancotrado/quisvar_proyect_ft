import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Dashboard, Home, Login, NotFound } from '../pages';
import { ProtectedRoute } from '../components/ProtectedRoute/ProtectedRoute';

const Navigation = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Navigation;
