import icon_done from '/svg/task_done.svg';
import icon_unresolved from '/svg/task_unresolved.svg';
import icon_process from '/svg/task_process.svg';
import { SubTask } from '../../../../types/types';
import './subTaskCard.css';

interface SubTaskCardProps {
  subTask: SubTask;
  getSubtask: (value: SubTask) => void;
}

const textInfo = {
  INREVIEW: 'Por Revisar',
  DENIED: 'Revisado, por corregir',
  DONE: 'Sin liquidar',
  LIQUIDATION: 'Liquidado',
};

const SubTaskCard = ({ subTask, getSubtask }: SubTaskCardProps) => {
  const hanldeViewMore = () => {
    getSubtask(subTask);
  };

  const usersAsigned = subTask.users?.map(user => user.user.profile.firstName);
  const { status } = subTask;
  const proccessInfoShow = status !== 'UNRESOLVED' && status !== 'PROCESS';
  const formatted = (+subTask.price).toFixed(2);
  return (
    <div
      className={` subTask ${
        subTask.status === 'DENIED' && 'subTask-inreview'
      }`}
    >
      {proccessInfoShow && (
        <span className="subTask-proccess-info">{textInfo[status]}</span>
      )}
      <span className={`subTask-icon subTask-${status}`}>
        <img
          src={
            status === 'DONE'
              ? icon_done
              : status === 'PROCESS'
              ? icon_process
              : icon_unresolved
          }
          alt={status}
        />
      </span>

      <div className="subTask-container">
        <div className="subTask-title">
          <span> {subTask.item}</span>
          <h3 className="subTask-name">{subTask.name}</h3>
        </div>
        <div className="subTask-info">
          <p className="subTask-owner">
            {usersAsigned &&
              (usersAsigned.length === 0 ? 'Libre' : usersAsigned.join(', '))}
          </p>
          <span className="subTask-price">S/. {formatted}</span>
          <p className="subTask-more" onClick={hanldeViewMore}>
            Ver más
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubTaskCard;
