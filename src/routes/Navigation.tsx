import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import {
  Dashboard,
  Home,
  Login,
  NotFound,
  Task,
  UserList,
  Specialities,
  $Speciality,
} from '../pages';
import WorkArea from '../pages/workArea/WorkArea';
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
            <Route path="/areas" element={<WorkArea />} />
            <Route path="/especialidades" element={<Specialities />} />
            <Route path="/especialidades/:id" element={<$Speciality />} />
            <Route path="/mis-tareas" element={<ListPersonalTask />} />
            <Route path="/lista-de-usuarios" element={<UserList />} />
          </Route>
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Navigation;
