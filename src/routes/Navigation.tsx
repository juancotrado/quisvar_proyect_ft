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
  Attendance,
} from '../pages';
import { ProtectedRoute } from '../components';
import Project from '../pages/specialities/project/Project';
import ProtectedRole from '../components/protected/ProtectedRole/ProtectedRole';
import { assitant_perms, rolThirdLevel } from '../utils/roles';
import Stage from '../pages/stage/Stage';
import Task from '../pages/task/Task';
import MailPage from '../pages/mail/MailPage';
import MessagePage from '../pages/mail/message/MessagePage';

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
            <Route path="/tramites" element={<MailPage />}>
              <Route path=":messageId" element={<MessagePage />} />
            </Route>
            <Route path="/asistencia" element={<Attendance />} />
            <Route path="/especialidades" element={<Specialities />}>
              <Route path="proyecto/:projectId" element={<Stage />}>
                <Route path="etapa/:stageId" element={<Project />}>
                  <Route path="tarea/:taskId" element={<Task />} />
                </Route>
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
