import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Dashboard, Home, Login, NotFound, Task } from '../pages';
import { ProtectedRoute } from '../components/protectedRoute/ProtectedRoute';
import WorkArea from '../pages/workArea/WorkArea';
import Projects from '../pages/projects/Projects';

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
            <Route path="/tareas" element={<Task />} />
            <Route path="/proyectos/:id" element={<Projects />} />
            <Route path="/areas" element={<WorkArea />} />
          </Route>
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Navigation;
