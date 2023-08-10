import { SubTask } from '../../../../../types/types';
import SubtaskFile from '../../../../subtasks/subtaskFiles/SubtaskFile';
import SubTaskStatusLabel from '../../../../subtasks/subTaskStatusLabel/SubTaskStatusLabel';
import SubtasksShippingHistory from '../../../../subtasks/subtasksShippingHistory/SubtasksShippingHistory';
import './cardSubtaskDone.css';
import formatDate from '../../../../../utils/formatDate';
import SubtaskChangeStatusBtn from '../../../../subtasks/subtaskChangeStatusBtn/SubtaskChangeStatusBtn';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store';
import { Input } from '../../../..';

interface CardSubtaskDone {
  subTask: SubTask;
}

const CardSubtaskDone = ({ subTask }: CardSubtaskDone) => {
  const { status } = subTask;
  const { modAuth } = useSelector((state: RootState) => state);
  const feedBacksReverse = subTask.feedBacks.reverse();
  return (
    <div className="cardSubtaskDone">
      <section className="cardSubtaskDone-left-details ">
        {subTask.feedBacks.length !== 0 && (
          <SubtasksShippingHistory feedBacks={feedBacksReverse} />
        )}
        {status === 'DONE' && modAuth && (
          <SubtaskChangeStatusBtn
            option="ASIG"
            subtaskId={subTask.id}
            subtaskStatus={status}
            text="Liquidar"
            type="liquidate"
          />
        )}
      </section>
      <section className="cardSubtaskDone-details">
        <SubTaskStatusLabel status={status} />
        <div className="cardSubtaskDone-info">
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
          <h2 className={'cardSubtaskProcess-info-price'}>
            Precio: S/. {subTask.price}
          </h2>
          <div className="cardSubtaskProcess-porcentage-container-main">
            <h4>Lista de porcentaje de avance:</h4>
            {subTask.users.map((user, index) => (
              <div
                key={user.user.id}
                className="cardSubtaskProcess-porcentage-container"
              >
                <span className="cardSubtaskProcess-porcentage-user">
                  {index + 1}
                  {')'} {user.user.profile.firstName}{' '}
                  {user.user.profile.lastName}
                </span>
                <div className="cardSubtaskProcess-porcentage-input">
                  <Input
                    name={String(user.user.id)}
                    defaultValue={user.percentage}
                    className="input-percentage-value"
                    readOnly={true}
                  />
                  %
                </div>
              </div>
            ))}
          </div>
          <div className="cardSubtaskDone-files-models">
            <h2 className="cardSubtaskDone-files-models-title">
              Archivos Modelo:
            </h2>
            <SubtaskFile
              files={subTask.files}
              typeFile="MATERIAL"
              showDeleteBtn={false}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default CardSubtaskDone;
