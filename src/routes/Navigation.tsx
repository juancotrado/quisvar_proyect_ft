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
  CompanyInformation,
  GeneralIndex,
  Contracts,
  MailPage,
  MessagePage,
  Stage,
  Project,
  BasicsPage,
  Task,
  CustomizableInvoice,
} from '../pages';
import { ProtectedRoute } from '../components';
import ProtectedRole from '../components/protected/ProtectedRole/ProtectedRole';
import {
  attendance_perms,
  rolThirdLevel,
  rolsFirstLevel,
} from '../utils/roles';
import DetailsContracts from '../pages/generalIndex/contracts/detailsContracts/DetailsContracts';
import ContractsLevels from '../pages/generalIndex/contracts/contractsLevels/ContractsLevels';

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
          </Route>
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </>
  );
};

export default Navigation;
