import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard, Home, Login } from './pages/index';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

// function Navigation(){

// }

export default App;
