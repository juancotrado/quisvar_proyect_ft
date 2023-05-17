import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Dashboard, Home, Login, NotFound, Task } from '../pages';
import WorkArea from '../pages/workArea/WorkArea';
import Projects from '../pages/projects/Projects';
import { ProtectedRoute } from '../components';
import ListPersonalTask from '../pages/listPersonalTask/ListPersonalTask';

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
            <Route path="/tareas/:id" element={<Task />} />
            <Route path="/proyectos/:id" element={<Projects />} />
            <Route path="/areas" element={<WorkArea />} />
            <Route path="/mis-tareas" element={<ListPersonalTask />} />
          </Route>
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Navigation;
