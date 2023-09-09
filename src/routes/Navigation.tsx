import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import {
  Dashboard,
  Home,
  Login,
  NotFound,
  Tasks,
  Specialities,
  UsersList,
  NotificationsList,
  ListPersonalTask,
  CommingSoon,
} from '../pages';
import { ProtectedRoute } from '../components';
import Project from '../pages/specialities/project/Project';
import ProtectedRole from '../components/protected/ProtectedRole/ProtectedRole';
import { assitant_perms, rolThirdLevel } from '../utils/roles';
import Stage from '../pages/stage/Stage';

const Navigation = () => {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tareas/:id" element={<Tasks />} />
            <Route path="/especialidades" element={<Specialities />}>
              <Route path="etapa/:stageId" element={<Stage />}>
                <Route path="proyecto/:id" element={<Project />} />
              </Route>
            </Route>
            <Route path="/mis-tareas" element={<ListPersonalTask />} />
            <Route path="/reportes" element={<CommingSoon />} />
            <Route element={<ProtectedRole rols={assitant_perms} />}>
              <Route path="/lista-de-usuarios" element={<UsersList />} />
            </Route>
            <Route element={<ProtectedRole rols={rolThirdLevel} />}>
              <Route
                path="/lista-de-notificaciones"
                element={<NotificationsList />}
              />
            </Route>
          </Route>
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </>
  );
};

export default Navigation;
