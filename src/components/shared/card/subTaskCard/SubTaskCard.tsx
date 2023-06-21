import icon_done from '/svg/task_done.svg';
import icon_unresolved from '/svg/task_unresolved.svg';
import icon_process from '/svg/task_process.svg';
import { SubTask } from '../../../../types/types';
import './subTaskCard.css';
import { isOpenModal$ } from '../../../../services/sharingSubject';

interface SubTaskCardProps {
  subTask: SubTask;
  getSubtask: (value: SubTask) => void;
}

const SubTaskCard = ({ subTask, getSubtask }: SubTaskCardProps) => {
  const hanldeViewMore = () => {
    getSubtask(subTask);
  };

  const usersAsigned = subTask.users?.map(user => user.user.profile.firstName);
  const { status } = subTask;
  const proccessInfoShow =
    status !== 'UNRESOLVED' && status !== 'DONE' && status !== 'PROCESS';
  const formatted = (+subTask.price).toFixed(2);
  return (
    <div className="subTask">
      {proccessInfoShow && (
        <span className="subTask-proccess-info">
          {status === 'INREVIEW' ? 'Por Revisar' : 'Revisado, por corregir'}
        </span>
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
        <h3 className="subTask-name">{subTask.name}</h3>
        <div className="subTask-info">
          <p className="subTask-owner">
            {usersAsigned &&
              (usersAsigned.length === 0 ? 'Libre' : usersAsigned.join(', '))}
          </p>
          <p className="subTask-price-container">
            - Precio:
            <span className="subTask-price">S/. {formatted}</span>
          </p>
          <p className="subTask-more" onClick={hanldeViewMore}>
            ver más
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubTaskCard;
