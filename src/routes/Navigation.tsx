import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import {
  Dashboard,
  Home,
  Login,
  NotFound,
  Specialities,
  UsersList,
  NotificationsList,
  ListPersonalTask,
  CommingSoon,
  Attendance,
  DetailsPage,
  BudgetsPage,
  LicensePage,
  Company,
  Specialist,
  SpecialistInformation,
  SpecialistExperience,
} from '../pages';
import { ProtectedRoute } from '../components';
import Project from '../pages/specialities/project/Project';
import ProtectedRole from '../components/protected/ProtectedRole/ProtectedRole';
import { assitant_perms, rolThirdLevel } from '../utils/roles';
import Stage from '../pages/stage/Stage';
import Task from '../pages/task/Task';
import MailPage from '../pages/mail/MailPage';
import MessagePage from '../pages/mail/message/MessagePage';
import BasicsPage from '../pages/specialities/project/basics/BasicsPage';

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
            <Route path="/tramites" element={<MailPage />}>
              <Route path=":messageId" element={<MessagePage />} />
              <Route path="licencia/:id" element={<LicensePage />} />
            </Route>
            <Route path="/asistencia" element={<Attendance />} />
            <Route path="/especialidades" element={<Specialities />}>
              <Route path="proyecto/:projectId" element={<Stage />}>
                <Route path="etapa/:stageId" element={<Project />}>
                  <Route path="detalles" element={<DetailsPage />} />
                  <Route path="basicos" element={<BasicsPage />} />
                  <Route path="presupuestos" element={<BudgetsPage />}>
                    <Route path="tarea/:taskId" element={<Task />} />
                  </Route>
                </Route>
              </Route>
            </Route>
            <Route path="/mis-tareas" element={<ListPersonalTask />} />
            <Route path="/reportes" element={<CommingSoon />} />
            <Route path="/empresas" element={<Company />} />
            <Route path="/especialistas" element={<Specialist />}>
              {/* <Route path="experiencia" element={<SpecialistExperience />} /> */}
              <Route
                path="informacion/:infoId"
                element={<SpecialistInformation />}
              />
            </Route>
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
