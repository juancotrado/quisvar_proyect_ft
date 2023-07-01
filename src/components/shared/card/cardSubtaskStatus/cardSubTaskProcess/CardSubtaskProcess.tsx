import { useContext } from 'react';
import { axiosInstance } from '../../../../../services/axiosInstance';
import { SocketContext } from '../../../../../context/SocketContex';
import Button from '../../../button/Button';
import { SubTask } from '../../../../../types/types';
import { isOpenModal$ } from '../../../../../services/sharingSubject';
import SubtaskFile from '../../../../subtasks/subtaskFiles/SubtaskFile';
import SubtaskUploadFiles from '../../../../subtasks/subtaskUploadFiles/SubtaskUploadFiles';
import SubtaskChangeStatusBtn from '../../../../subtasks/subtaskChangeStatusBtn/SubtaskChangeStatusBtn';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store';
import './cardSubTaskProcess.css';
import SubTaskStatusLabel from '../../../../subtasks/subTaskStatusLabel/SubTaskStatusLabel';
import { InputRange } from '../../../..';
import { useForm } from 'react-hook-form';

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
  getTimeOut();
  return (
    <div className="cardSubtaskProcess">
      <section className="cardSubtaskProcess-left-details">
        <div className="cardSubtaskProcess-files-content">
          {((status !== 'INREVIEW' && isAuthorizedUser) ||
            (isAuthorizedMod && status === 'INREVIEW')) && (
            <SubtaskUploadFiles id={subTask.id} type="REVIEW" />
          )}
          <div className="cardSubtaskProcess-files-view">
            <h2 className="cardSubtaskProcess-files-title">Archivos:</h2>
            <SubtaskFile
              showDeleteBtnByUserAuth={true}
              subTask={subTask}
              typeFile="REVIEW"
            />
          </div>
        </div>

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
                requirePdf={true}
              />
            )}
            {status === 'INREVIEW' && isAuthorizedMod && (
              <>
                <SubtaskChangeStatusBtn
                  option="DENY"
                  subtaskId={subTask.id}
                  subtaskStatus={status}
                  // percentageRange={percentage || subTask.percentage}
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
            <SubtaskFile
              subTask={subTask}
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