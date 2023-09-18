import { FocusEvent, useEffect, useState } from 'react';
import { DataFeedback, SubTask } from '../../../../../types/types';
import SubtaskFile from '../../../../subtasks/subtaskFiles/SubtaskFile';
import SubtaskUploadFiles from '../../../../subtasks/subtaskUploadFiles/SubtaskUploadFiles';
import SubtaskChangeStatusBtn from '../../../../subtasks/subtaskChangeStatusBtn/SubtaskChangeStatusBtn';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store';
import './cardSubTaskProcess.css';
import { Input } from '../../../..';
import { motion } from 'framer-motion';
import ButtonDelete from '../../../button/ButtonDelete';
import SubtasksShippingHistory from '../../../../subtasks/subtasksShippingHistory/SubtasksShippingHistory';
import formatDate from '../../../../../utils/formatDate';
interface CardSubtaskProcess {
  subTask: SubTask;
}

const CardSubtaskProcess = ({ subTask }: CardSubtaskProcess) => {
  const adminId = 0;
  const { userSession, modAuthProject } = useSelector(
    (state: RootState) => state
  );

  const { status } = subTask;
  const [files, setFiles] = useState<File[] | null>(null);
  const [dataFeedback, setDataFeedback] = useState<DataFeedback | null>(null);
  const [porcetageForUser, setPorcetageForUser] = useState({});
  useEffect(() => {
    const porcentageForUserFilter = subTask.users.map(
      ({ user, percentage }) => [
        'user' + user.id,
        { userId: user.id, percentage },
      ]
    );
    setFiles(null);
    setPorcetageForUser(Object.fromEntries(porcentageForUserFilter));
  }, [subTask.users]);

  const addFiles = (newFiles: File[]) => {
    if (!files) return setFiles(newFiles);
    const concatFiles = [...files, ...newFiles];
    const uniqueFiles = Array.from(
      new Set(concatFiles.map(file => file.name))
    ).map(name => concatFiles.find(file => file.name === name)) as File[];
    setFiles(uniqueFiles);
  };
  const deleteFiles = (delFiles: File) => {
    if (files) {
      const newFiles = Array.from(files).filter(file => file !== delFiles);
      if (!newFiles) return;
      setFiles(newFiles);
    }
  };

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
  const getDataFeedback = (data: DataFeedback) => setDataFeedback(data);
  return (
    <div className="cardSubtaskProcess">
      <section className="cardSubtaskProcess-left-details">
        {isAuthorizedUser && status !== 'INREVIEW' && (
          <div className="cardSubtaskProcess-files-content">
            <SubtaskUploadFiles
              id={subTask.id}
              type="REVIEW"
              addFiles={addFiles}
            />
            {files && (
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
            )}
          </div>
        )}
        {subTask.feedBacks.length !== 0 && (
          <SubtasksShippingHistory
            feedBacks={subTask.feedBacks}
            authorize={{ isAuthorizedMod, isAuthorizedUser }}
            getDataFeedback={getDataFeedback}
          />
        )}
        {status === 'PROCESS' &&
          isAuthorizedMod &&
          adminId !== subTask.users[0].user.id &&
          subTask.feedBacks.length === 0 && (
            <div className="waiting-screen">
              <motion.img
                animate={{
                  scale: [0.5, 1, 1, 0.5, 0.5],
                  rotate: [0, 0, 180, 180, 0],
                  borderRadius: ['0%', '0%', '50%', '50%', '0%'],
                }}
                transition={{
                  duration: 2,
                  ease: 'easeInOut',
                  times: [0, 0.4, 1, 1.6, 2],
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
                className="waiting-screen-image"
                src="svg/sand_clock.svg"
                alt=""
              />
              <h2>Esperando al envio de archivos...</h2>
            </div>
          )}
        {areAuthorizedUsers && (
          <div className="cardSubtaskProcess-btns">
            {status !== 'INREVIEW' && isAuthorizedUser && (
              <SubtaskChangeStatusBtn
                option="ASIG"
                subtaskId={subTask.id}
                subtaskStatus={status}
                type="sendToReview"
                text={
                  adminId === subTask.users[0].user.id
                    ? 'Enviar'
                    : 'Mandar a Revisar'
                }
                isAssignedAdminTask={adminId === subTask.users[0].user.id}
                isAuthorizedUser={isAuthorizedUser}
                files={files}
                porcentagesForUser={Object.values(porcetageForUser)}
              />
            )}
            {status === 'INREVIEW' && isAuthorizedMod && (
              <>
                <SubtaskChangeStatusBtn
                  option="DENY"
                  subtaskId={subTask.id}
                  subtaskStatus={status}
                  dataFeedback={dataFeedback}
                  type="deprecated"
                  text="Desaprobar"
                  porcentagesForUser={Object.values(porcetageForUser)}
                />
                <SubtaskChangeStatusBtn
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
      <section className="cardSubtaskProcess-details">
        {/* <SubTaskStatusLabel status={status} /> */}
        <div className="cardSubtaskProcess-info">
          <p
            className={`cardSubtaskProcess-info-untilDate ${
              getTimeOut() <= 0 && 'expired-time '
            }`}
          >
            Tiempo restante: {getTimeOut()} hrs
          </p>
          {subTask.createdAt && (
            <p className="cardSubtaskHold-info-date">
              <b>Fecha de inicio: </b>
              {formatDate(new Date(subTask.createdAt), {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}

          <h3 className="cardSubtaskProcess-info-hours">
            <b>Total horas:</b> 24 horas
          </h3>
          <h2 className={'cardSubtaskProcess-info-price'}>
            Precio: S/. {subTask.price}
          </h2>
        </div>
        <div className="cardSubtaskProcess-porcentage-container-main">
          <h4>Lista de porcentaje de avance:</h4>
          {subTask.users.map((user, index) => (
            <div
              key={user.user.id}
              className="cardSubtaskProcess-porcentage-container"
            >
              <span className="cardSubtaskProcess-porcentage-user">
                {index + 1}
                {')'} {user.user.profile.firstName} {user.user.profile.lastName}{' '}
                {user.percentage}
              </span>
              <div className="cardSubtaskProcess-porcentage-input">
                <Input
                  onBlur={handlePorcentage}
                  defaultValue={user.percentage}
                  className="input-percentage-value"
                  disabled={!areAuthorizedUsers}
                />
                %
              </div>
            </div>
          ))}
        </div>
        <div className="cardSubtaskProcess-files-models">
          <h2 className="cardSubtaskProcess-files-models-title">
            Archivos Modelo:
          </h2>
          {status === 'INREVIEW' && isAuthorizedMod && (
            <SubtaskUploadFiles
              id={subTask.id}
              type="MODEL"
              className="cardSubtaskProcess-files-models-upload"
            />
          )}
          <SubtaskFile
            files={subTask.files}
            typeFile="MODEL"
            showDeleteBtn={false}
          />
        </div>

        {isAuthorizedMod && (
          <SubtaskChangeStatusBtn
            option="DENY"
            subtaskId={subTask.id}
            subtaskStatus={status}
            text="Restablecer"
            type="reset"
          />
        )}
      </section>
    </div>
  );
};

export default CardSubtaskProcess;
