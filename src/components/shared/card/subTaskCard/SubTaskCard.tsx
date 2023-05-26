import icon_done from '/svg/task_done.svg';
import icon_unresolved from '/svg/task_unresolved.svg';
import icon_process from '/svg/task_process.svg';
import { SubTask } from '../../../../types/types';
import './subTaskCard.css';

interface SubTaskCardProps {
  subTask: SubTask;
}

const SubTaskCard = ({ subTask }: SubTaskCardProps) => {
  return (
    <div className="subTask">
      <span className={`subTask-icon subTask-${subTask.status}`}>
        <img
          src={
            subTask.status === 'DONE'
              ? icon_done
              : subTask.status === 'PROCESS'
              ? icon_process
              : icon_unresolved
          }
          alt={subTask.status}
        />
      </span>

      <div className="subTask-container">
        <h3 className="subTask-name">{subTask.name}</h3>
        <div className="subTask-info">
          <p className="subTask-owner">Jhon Doe</p>

          <p className="subTask-price-container">
            - Precio:{' '}
            <span className="subTask-price">S/.{subTask.price}.00</span>
          </p>
          <p className="subTask-more"> ver más</p>
        </div>
      </div>
    </div>
  );
};

export default SubTaskCard;
