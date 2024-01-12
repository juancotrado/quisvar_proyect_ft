import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

import { ProtectedRoute } from '../components';
import ProtectedRole from '../components/protected/ProtectedRole/ProtectedRole';
import {
  attendance_perms,
  rolThirdLevel,
  rolsFirstLevel,
} from '../utils/roles';
import {
  Attendance,
  BasicsPage,
  BudgetsPage,
  CommingSoon,
  Company,
  CompanyInformation,
  Consortium,
  Contracts,
  ContractsLevels,
  CustomizableInvoice,
  Dashboard,
  DetailsContracts,
  DetailsPage,
  GeneralIndex,
  Group,
  GroupContent,
  GroupDaily,
  GroupProjects,
  GroupWeekend,
  Home,
  LicensePage,
  ListPersonalTask,
  Login,
  MailPage,
  MessagePage,
  NotFound,
  NotificationsList,
  Project,
  Specialist,
  SpecialistInformation,
  Specialities,
  Stage,
  Task,
  UsersList,
} from '../pages';

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
            <Route element={<ProtectedRole rols={attendance_perms} />}>
              <Route path="/asistencia" element={<Attendance />} />
            </Route>
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
            <Route path="/factura" element={<CustomizableInvoice />} />
            <Route path="/empresas" element={<Company />}>
              <Route
                path="informacion/:infoId"
                element={<CompanyInformation />}
              />
              <Route path="consorcio/:id" element={<Consortium />} />
            </Route>
            <Route path="/especialistas" element={<Specialist />}>
              <Route
                path="informacion/:infoId"
                element={<SpecialistInformation />}
              />
            </Route>
            <Route element={<ProtectedRole rols={rolsFirstLevel} />}>
              <Route path="/lista-de-usuarios" element={<UsersList />} />
              <Route path="/indice-general" element={<GeneralIndex />}>
                <Route path="contratos" element={<Contracts />}>
                  <Route
                    path="contrato/:contractId"
                    element={<ContractsLevels />}
                  >
                    <Route path="detalles" element={<DetailsContracts />} />
                  </Route>
                </Route>
              </Route>
            </Route>
            <Route element={<ProtectedRole rols={rolThirdLevel} />}>
              <Route
                path="/lista-de-notificaciones"
                element={<NotificationsList />}
              />
            </Route>
            <Route path="/grupos" element={<Group />}>
              <Route path="contenido/:groupId/:name" element={<GroupContent />}>
                <Route path="proyectos/:groupId" element={<GroupProjects />} />
                <Route path="reuniones/:groupId" element={<GroupDaily />} />
                <Route path="semanal/:groupId" element={<GroupWeekend />} />
              </Route>
            </Route>
          </Route>
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </>
  );
};

export default Navigation;
