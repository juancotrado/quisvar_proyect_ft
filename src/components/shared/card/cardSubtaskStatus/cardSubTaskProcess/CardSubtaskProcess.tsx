import { useContext, useState } from 'react';
import { axiosInstance } from '../../../../../services/axiosInstance';
import { SocketContext } from '../../../../../context/SocketContex';
import Button from '../../../button/Button';
import { DataFeedback, Feedback, SubTask } from '../../../../../types/types';
import { isOpenModal$ } from '../../../../../services/sharingSubject';
import SubtaskFile from '../../../../subtasks/subtaskFiles/SubtaskFile';
import SubtaskUploadFiles from '../../../../subtasks/subtaskUploadFiles/SubtaskUploadFiles';
import SubtaskChangeStatusBtn from '../../../../subtasks/subtaskChangeStatusBtn/SubtaskChangeStatusBtn';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store';
import './cardSubTaskProcess.css';
import SubTaskStatusLabel from '../../../../subtasks/subTaskStatusLabel/SubTaskStatusLabel';
import { InputRange, TextArea } from '../../../..';
import { useForm } from 'react-hook-form';
import ButtonDelete from '../../../button/ButtonDelete';
interface CardSubtaskProcess {
  subTask: SubTask;
  isAuthorizedMod: boolean;
}

const CardSubtaskProcess = ({
  subTask,
  isAuthorizedMod,
}: CardSubtaskProcess) => {
  const { watch, register } = useForm();
  const percentage = watch('percentage');
  const socket = useContext(SocketContext);
  const { userSession } = useSelector((state: RootState) => state);
  const { status } = subTask;
  const [files, setFiles] = useState<File[] | null>(null);
  const [dataFeedback, setDataFeedback] = useState<DataFeedback | null>(null);
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

  const handleReloadSubTask = () => {
    axiosInstance
      .patch(`/subtasks/asigned/${subTask.id}?status=decline`)
      .then(res => {
        socket.emit('client:update-subTask', res.data);
        isOpenModal$.setSubject = false;
      });
  };

  const isAuthorizedUser = subTask?.users?.some(
    ({ user }) => user.profile.userId === userSession?.id
  );

  const areAuthorizedUsers = isAuthorizedMod || isAuthorizedUser;

  const getTimeOut = () => {
    const assignedAt = new Date();
    const untilDate = subTask.users.at(0)?.untilDate;

    if (!assignedAt || !untilDate) return 0;
    const untilDateTime =
      new Date(untilDate).getTime() - new Date(assignedAt).getTime();
    const transforToHours = Math.floor(untilDateTime / 1000 / 60 / 60);
    return transforToHours;
  };
  const getDatetimeCreated = (dateTime: string) => {
    const date = new Date(dateTime);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const localeDate = date.toLocaleDateString('es-PE', options);
    const localeTime = date.toLocaleTimeString('en-US');

    return `Enviado el ${localeDate} a las ${localeTime}`;
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
                            icon="trash-red"
                            customOnClick={() => deleteFiles(file)}
                            className="cardSubtaskProcess-files-btn-delete"
                          />
                        </div>
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
          <div className="cardSubtaskProcess-review-contain">
            {subTask.feedBacks.map((feedBack: Feedback) => (
              <div key={feedBack.id} className="cardSubtaskProcess-review-card">
                <h3 className="cardSubtaskProcess-review-card-time">
                  {getDatetimeCreated(feedBack.createdAt)}:
                </h3>
                <SubtaskFile
                  files={feedBack.files}
                  typeFile="REVIEW"
                  showDeleteBtn={false}
                />
                {((isAuthorizedUser && feedBack.comment) ||
                  (status === 'INREVIEW' && isAuthorizedMod)) && (
                  <TextArea
                    label={
                      !feedBack.comment ? 'Agregar Comentario' : 'Comentario'
                    }
                    onBlur={e =>
                      getDataFeedback({
                        comment: e.target.value.trim(),
                        id: feedBack.id,
                      })
                    }
                    defaultValue={feedBack.comment || ''}
                    disabled={feedBack.comment ? true : false}
                  />
                )}
              </div>
            ))}
          </div>
        )}
        {areAuthorizedUsers && (
          <div className="cardSubtaskProcess-btns">
            {status === 'PROCESS' &&
              !isAuthorizedMod &&
              subTask.files.length === 0 && (
                <Button
                  text={'Declinar'}
                  className="btn-declinar"
                  onClick={handleReloadSubTask}
                />
              )}
            {status !== 'INREVIEW' && isAuthorizedUser && (
              <SubtaskChangeStatusBtn
                option="ASIG"
                subtaskId={subTask.id}
                subtaskStatus={status}
                percentageRange={percentage || subTask.percentage}
                type="submit"
                text="Mandar a Revisar"
                files={files}
              />
            )}
            {status === 'INREVIEW' && isAuthorizedMod && (
              <>
                <SubtaskChangeStatusBtn
                  option="DENY"
                  subtaskId={subTask.id}
                  subtaskStatus={status}
                  dataFeedback={dataFeedback}
                  text="Desaprobar"
                />
                <SubtaskChangeStatusBtn
                  option="ASIG"
                  subtaskId={subTask.id}
                  subtaskStatus={status}
                  percentageRange={percentage || subTask.percentage}
                  text="Aprobar"
                />
              </>
            )}
          </div>
        )}
      </section>
      <section className="cardSubtaskProcess-details">
        <SubTaskStatusLabel status={status} />
        <div className="cardSubtaskProcess-info">
          <p className="cardSubtaskProcess-info-date">Creación: 21/01/23</p>
          <p
            className={`cardSubtaskProcess-info-untilDate ${
              getTimeOut() <= 0 && 'expired-time '
            }`}
          >
            Tiempo restante: {getTimeOut()} hrs
          </p>
          {areAuthorizedUsers && (
            <InputRange
              {...register('percentage')}
              maxRange={100}
              newPercentage={percentage}
              defaultValue={subTask.percentage}
              disabled={isAuthorizedMod ? true : false}
            />
          )}
          <div className="cardSubtaskProcess-files-models">
            <h2 className="cardSubtaskProcess-files-models-title">
              Archivos Modelo:
            </h2>
            {status === 'INREVIEW' && isAuthorizedMod && (
              <SubtaskUploadFiles
                id={subTask.id}
                type="MATERIAL"
                className="cardSubtaskProcess-files-models-upload"
              />
            )}
            <SubtaskFile
              files={subTask.files}
              typeFile="MATERIAL"
              showDeleteBtn={false}
            />
          </div>
          <h3 className="cardSubtaskProcess-info-hours">
            Total Horas: 24 horas
          </h3>
          <h2 className={'cardSubtaskProcess-info-price'}>
            Precio: S/. {subTask.price}
          </h2>
        </div>
        {isAuthorizedMod && (
          <Button
            text="RESTABLECER"
            className="btn-declinar"
            onClick={handleReloadSubTask}
          />
        )}
      </section>
    </div>
  );
};

export default CardSubtaskProcess;
