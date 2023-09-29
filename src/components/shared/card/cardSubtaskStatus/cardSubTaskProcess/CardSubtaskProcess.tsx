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
import SubtaskInfoHistory from '../../../../subtasks/subtaskInfoHistory/SubtaskInfoHistory';
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
          <div className="cardSubtask-models-contain">
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
          </div>
        )}
        {isAuthorizedMod && status === 'INREVIEW' && (
          <SubtaskInfoHistory
            feedBack={subTask?.feedBacks?.[subTask?.feedBacks?.length - 1]}
            authorize={{ isAuthorizedMod, isAuthorizedUser }}
            getDataFeedback={getDataFeedback}
          />
        )}
        {isAuthorizedMod && status !== 'INREVIEW' && (
          <LoaderText text="Esperando entregables..." />
        )}
        {isAuthorizedUser && status === 'INREVIEW' && (
          <LoaderText text="Esperando aprobación..." />
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
                  className={`cardSubtask-add-btn  cardSubtask-decline-btn`}
                  option="DENY"
                  subtaskId={subTask.id}
                  subtaskStatus={status}
                  dataFeedback={dataFeedback}
                  type="deprecated"
                  text="Declinar"
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
