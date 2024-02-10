import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

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
  DetailsContracts,
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
  GeneralData,
  UserCenter,
  Procedure,
  RolesAndPermissions,
  GroupAttendanceFilter,
  GroupMeetingFilter,
} from '../pages';
import { ProtectedRole, ProtectedRoute } from '../guards';

const Navigation = () => {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}

            <Route element={<ProtectedRole menuAccess="centro-de-usuarios" />}>
              <Route path="/centro-de-usuarios" element={<UserCenter />}>
                <Route
                  index
                  element={<Navigate to="lista-de-usuarios" replace />}
                />
                <Route path="lista-de-usuarios" element={<UsersList />} />
                <Route
                  path="roles-y-permisos"
                  element={<RolesAndPermissions />}
                />
              </Route>
            </Route>

            <Route element={<ProtectedRole menuAccess="tramites" />}>
              <Route path="/tramites" element={<Procedure />}>
                <Route path="salidas" element={<LicensePage />} />
                <Route path="tramite-de-pago" element={<MailPage />}>
                  <Route path=":paymessageId" element={<MessagePage />} />
                </Route>
              </Route>
            </Route>

            <Route element={<ProtectedRole menuAccess="especialidades" />}>
              <Route path="/especialidades" element={<Specialities />}>
                <Route path="proyecto/:projectId" element={<Stage />}>
                  <Route path="etapa/:stageId" element={<Project />}>
                    <Route
                      index
                      element={<Navigate to="presupuestos" replace />}
                    />
                    <Route path="detalles" element={<GeneralData />} />
                    <Route path="basicos" element={<BasicsPage />} />
                    <Route path="presupuestos" element={<BudgetsPage />}>
                      <Route path="tarea/:taskId" element={<Task />} />
                    </Route>
                  </Route>
                </Route>
              </Route>
            </Route>

            <Route element={<ProtectedRole menuAccess="asistencia" />}>
              <Route path="/asistencia" element={<Attendance />} />
            </Route>

            <Route element={<ProtectedRole menuAccess="empresas" />}>
              <Route path="/empresas" element={<Company />}>
                <Route
                  path="informacion/:infoId"
                  element={<CompanyInformation />}
                />
                <Route path="consorcio/:id" element={<Consortium />} />
              </Route>
            </Route>

            <Route element={<ProtectedRole menuAccess="especialistas" />}>
              <Route path="/especialistas" element={<Specialist />}>
                <Route
                  path="informacion/:infoId"
                  element={<SpecialistInformation />}
                />
              </Route>
            </Route>

            <Route element={<ProtectedRole menuAccess="grupos" />}>
              <Route path="/grupos" element={<Group />}>
                <Route
                  path="resumen/reuniones"
                  element={<GroupMeetingFilter />}
                ></Route>
                <Route
                  path="resumen/asistencias"
                  element={<GroupAttendanceFilter />}
                ></Route>
                <Route
                  path="contenido/:groupId/:name"
                  element={<GroupContent />}
                >
                  <Route
                    path="proyectos/:groupId"
                    element={<GroupProjects />}
                  />
                  <Route path="reuniones/:groupId" element={<GroupDaily />} />
                  <Route path="semanal/:groupId" element={<GroupWeekend />} />
                </Route>
              </Route>
            </Route>

            <Route element={<ProtectedRole menuAccess="indice-general" />}>
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

            <Route>
              <Route
                path="/lista-de-notificaciones"
                element={<NotificationsList />}
              />
            </Route>
          </Route>
          <Route path="/mis-tareas" element={<ListPersonalTask />} />
          <Route path="/reportes" element={<CommingSoon />} />
          <Route path="/factura" element={<CustomizableInvoice />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </>
  );
};

export default Navigation;
