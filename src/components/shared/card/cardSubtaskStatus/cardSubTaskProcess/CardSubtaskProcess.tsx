import { FocusEvent, useEffect, useMemo, useState } from 'react';
import { DataFeedback, Files, SubTask } from '../../../../../types/types';
import SubtaskFile from '../../../../subtasks/subtaskFiles/SubtaskFile';
import SubtaskUploadFiles from '../../../../subtasks/subtaskUploadFiles/SubtaskUploadFiles';
import SubtaskChangeStatusBtn from '../../../../subtasks/subtaskChangeStatusBtn/SubtaskChangeStatusBtn';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store';
import './cardSubTaskProcess.css';
import SubtasksShippingHistory from '../../../../subtasks/subtasksShippingHistory/SubtasksShippingHistory';
import SubtasksMoreInfo from '../../../../subtasks/subtasksMoreInfo/SubtasksMoreInfo';
import SubtaskUsers from '../../../../subtasks/subtaskUsers/SubtaskUsers';
import LoaderText from '../../../loaderText/LoaderText';
import useUserPorcetage from '../../../../../hooks/useUserPorcetage';
interface CardSubtaskProcess {
  subTask: SubTask;
}

const CardSubtaskProcess = ({ subTask }: CardSubtaskProcess) => {
  const adminId = 0;
  const { userSession, modAuthProject } = useSelector(
    (state: RootState) => state
  );

  const { status } = subTask;
  const [dataFeedback, setDataFeedback] = useState<DataFeedback | null>(null);
  const [porcetageForUser, setPorcetageForUser] = useState({});
  useEffect(() => {
    const porcentageForUserFilter = subTask.users.map(
      ({ user, percentage }) => [
        'user' + user.id,
        { userId: user.id, percentage },
      ]
    );
    // setFiles(null);
    setPorcetageForUser(Object.fromEntries(porcentageForUserFilter));
  }, [subTask.users]);

  const allFileIds: number[] = useMemo(
    () =>
      subTask.feedBacks.reduce((acc, feedback) => {
        feedback.files.forEach((file: Files) => {
          acc.push(file.id);
        });
        return acc;
      }, []),
    [subTask.feedBacks]
  );
  const filterFiles = useMemo(
    () =>
      subTask.files
        .filter(file => !allFileIds.includes(file.id))
        .filter(({ type }) => type === 'REVIEW'),
    [allFileIds, subTask.files]
  );
  // const addFiles = (newFiles: File[]) => {
  //   if (!files) return setFiles(newFiles);
  //   const concatFiles = [...files, ...newFiles];
  //   const uniqueFiles = Array.from(
  //     new Set(concatFiles.map(file => file.name)),
  //   ).map(name => concatFiles.find(file => file.name === name)) as File[];
  //   setFiles(uniqueFiles);
  // };
  // const deleteFiles = (delFiles: File) => {
  //   if (files) {
  //     const newFiles = Array.from(files).filter(file => file !== delFiles);
  //     if (!newFiles) return;
  //     setFiles(newFiles);
  //   }
  // };

  const isAuthorizedMod =
    modAuthProject || userSession.id === subTask.Levels.userId;
  const isAuthorizedUser = subTask?.users?.some(
    ({ user }) => user.id === userSession?.id
  );
  const areAuthorizedUsers = isAuthorizedMod || isAuthorizedUser;

  const getTimeOut = () => {
    const assignedAt = new Date();
    const untilDate = subTask.users.at(0)?.untilDate;

    if (!assignedAt || !untilDate) return 0;
    const untilDateTime =
      new Date(untilDate).getTime() - new Date(assignedAt).getTime();
    const transformToHours = Math.floor(untilDateTime / 1000 / 60 / 60);
    return transformToHours;
  };

  const handlePorcentage = (e: FocusEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setPorcetageForUser({
      ...porcetageForUser,
      ['user' + name]: { userId: +name, percentage: +value },
    });
  };
  console.log({ filterFiles });
  const { usersData } = useUserPorcetage(subTask.users);
  const getDataFeedback = (data: DataFeedback) => setDataFeedback(data);
  return (
    <div className="cardSubtaskProcess">
      <section className="cardSubtaskProcess-left-details">
        {isAuthorizedMod && (
          <>
            <h4 className="cardSubtask-title-information">
              <figure className="cardSubtask-figure">
                <img src="/svg/paper-clip.svg" alt="W3Schools" />
              </figure>
              Archivos modelos:
            </h4>

            <div className="cardSubtask-files-content">
              <SubtaskUploadFiles id={subTask.id} type="MODEL" />
            </div>
            <SubtaskFile
              files={subTask.files}
              typeFile="MODEL"
              showDeleteBtn={isAuthorizedMod}
              className="cardSubtask-file-conten"
            />
          </>
        )}
        {isAuthorizedUser && status !== 'INREVIEW' && (
          <>
            <h4 className="cardSubtask-title-information">
              <figure className="cardSubtask-figure">
                <img src="/svg/paper-clip.svg" alt="W3Schools" />
              </figure>
              Subir archivos:
            </h4>
            <div className="cardSubtask-files-content">
              <SubtaskUploadFiles
                id={subTask.id}
                type="REVIEW"
                // addFiles={addFiles}
              />
              {/* {files && (
                <div className="cardSubtaskProcess-files-view">
                  <h2 className="cardSubtaskProcess-files-title">
                    Archivos Cargados, listos para enviar:
                  </h2>
                  <div className="cardSubtaskProcess-files-contain">
                    {Array.from(files).map(file => (
                      <div
                        key={file.lastModified + file.name + file.size}
                        className="cardSubtaskProcess-files-name-contain"
                        title={file.name}
                      >
                        <figure className="cardSubtaskProcess-files-icon">
                          <img src="/svg/file-download.svg" alt="W3Schools" />
                          <div className="cardSubtaskProcess-files-btn">
                            <ButtonDelete
                              icon="close"
                              customOnClick={() => deleteFiles(file)}
                              className="cardSubtaskProcess-files-btn-delete"
                            />
                          </div>
                          .
                        </figure>
                        <span className="cardSubtaskProcess-files-name">
                          {file.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )} */}
            </div>
            <SubtaskFile
              files={filterFiles}
              typeFile="REVIEW"
              showDeleteBtnByUserAuth
              showDeleteBtn={isAuthorizedMod}
              className="cardSubtask-file-conten"
            />
          </>
        )}
        {/* <div className="cardSubtaskHold-users-contain">
        <h4 className="cardSubtask-title-information">
          <figure className="cardSubtask-figure">
            <img src="/svg/user-task.svg" alt="W3Schools" />
          </figure>
          Lista de Usuarios Asignados:
        </h4>
        {subTask.users.map((user, index) => (
          <div
            key={user.user.id}
            className="cardSubtaskProcess-porcentage-container"
          >
            <span className="cardSubtaskProcess-porcentage-user">
              {index + 1}
              {')'} {user.user.profile.firstName} {user.user.profile.lastName}{' '}
            </span>
            <div className="cardSubtaskProcess-porcentage-input">
              <Input
                onBlur={handlePorcentage}
                placeholder={String(user.percentage)}
                name={String(user.user.id)}
                className="input-percentage-value"
                disabled={!areAuthorizedUsers}
              />
              %
            </div>
          </div>
        ))}
      </div> */}
        <div className="cardSubtaskProcess-left-details-buttom">
          {subTask.feedBacks.length !== 0 && (
            <SubtasksShippingHistory
              feedBacks={subTask.feedBacks}
              authorize={{ isAuthorizedMod, isAuthorizedUser }}
              getDataFeedback={getDataFeedback}
            />
          )}
          <SubtaskUsers
            usersData={usersData}
            handlePorcentage={handlePorcentage}
            areAuthorizedUsers={areAuthorizedUsers}
          />
        </div>
      </section>
      <section className="cardSubtaskProcess-details">
        <SubtasksMoreInfo task={subTask} />
        {!isAuthorizedMod && (
          <>
            <h4 className="cardSubtask-title-information">
              <figure className="cardSubtask-figure">
                <img src="/svg/paper-clip.svg" alt="W3Schools" />
              </figure>
              Archivos modelos:
            </h4>

            <SubtaskFile
              files={subTask.files}
              typeFile="MODEL"
              showDeleteBtn={isAuthorizedMod}
            />
          </>
        )}
        {isAuthorizedMod && status !== 'INREVIEW' && (
          <LoaderText text="Esperando entregables..." />
        )}
        {isAuthorizedUser && status === 'INREVIEW' && (
          <LoaderText text="Esperando aprovación..." />
        )}

        {areAuthorizedUsers && (
          <div className="cardSubtaskProcess-btns">
            {status !== 'INREVIEW' && isAuthorizedUser && (
              <>
                <div></div>
                <SubtaskChangeStatusBtn
                  option="ASIG"
                  subtaskId={subTask.id}
                  subtaskStatus={status}
                  className={`cardSubtask-add-btn `}
                  type="sendToReview"
                  text={
                    adminId === subTask.users[0].user.id
                      ? 'Enviar'
                      : 'Mandar a Revisar'
                  }
                  isAssignedAdminTask={adminId === subTask.users[0].user.id}
                  isAuthorizedUser={isAuthorizedUser}
                  files={filterFiles}
                  porcentagesForUser={Object.values(porcetageForUser)}
                />
              </>
            )}
            {status === 'INREVIEW' && isAuthorizedMod && (
              <>
                <SubtaskChangeStatusBtn
                  className={`cardSubtask-add-btn `}
                  option="DENY"
                  subtaskId={subTask.id}
                  subtaskStatus={status}
                  dataFeedback={dataFeedback}
                  type="deprecated"
                  text="Desaprobar"
                  porcentagesForUser={Object.values(porcetageForUser)}
                />
                <SubtaskChangeStatusBtn
                  className={`cardSubtask-add-btn `}
                  option="ASIG"
                  type="approved"
                  subtaskId={subTask.id}
                  subtaskStatus={status}
                  porcentagesForUser={Object.values(porcetageForUser)}
                  text="Aprobar"
                />
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default CardSubtaskProcess;
