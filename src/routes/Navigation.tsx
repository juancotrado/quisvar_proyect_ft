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
import ProjectsList from '../pages/specialities/ProjectsList';
import ProjectDetailsPage from '../pages/specialities/projectDetails/ProjectDetailsPage';

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
              <Route path="/especialidades/:id" element={<ProjectsList />}>
                <Route
                  path="/especialidades/:id/proyecto/:projectId"
                  element={<ProjectDetailsPage />}
                />
              </Route>
            </Route>
            <Route path="/mis-tareas" element={<ListPersonalTask />} />
            <Route path="/lista-de-usuarios" element={<UsersList />} />
            <Route path="/reportes" element={<CommingSoon />} />
            <Route
              path="/lista-de-notificaciones"
              element={<NotificationsList />}
            />
          </Route>
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </>
  );
};

export default Navigation;
