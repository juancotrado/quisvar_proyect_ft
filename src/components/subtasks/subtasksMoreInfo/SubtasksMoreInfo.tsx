import { SubTask } from '../../../types/types';
import { _date } from '../../../utils/formatDate';
import StatusText from '../../shared/statusText/StatusText';
import './subtasksMoreInfo.css';
interface SubtasksMoreInfoProps {
  task: SubTask;
}
const SubtasksMoreInfo = ({ task }: SubtasksMoreInfoProps) => {
  const getTimeOut = () => {
    const assignedAt = new Date();
    const untilDate = task.users.at(0)?.untilDate;
    if (!assignedAt || !untilDate) return 0;
    const untilDateTime =
      new Date(untilDate).getTime() - new Date(assignedAt).getTime();
    const transformToDays =
      Math.floor((untilDateTime / 1000 / 60 / 60 / 24) * 10) / 10;
    return transformToDays;
  };

  return (
    <div className="subtasksMoreInfo">
      <div className="subtasksMoreInfo-item">
        <h3 className="subtasksMoreInfo-item-title">FECHA DE CREACION</h3>
        <div className="subtasksMoreInfo-item-text">
          <figure className="subtasksMoreInfo-item-icon">
            <img src="/svg/date-icon.svg" alt="W3Schools" />
          </figure>
          {task?.createdAt ? _date(task?.createdAt) : '-'}
        </div>
      </div>
      <div className="subtasksMoreInfo-item">
        <h3 className="subtasksMoreInfo-item-title">PRECIO</h3>
        <div className="subtasksMoreInfo-item-text">
          <figure className="subtasksMoreInfo-item-icon">
            <img src="/svg/money-icon.svg" alt="W3Schools" />
          </figure>
          {task.price}
        </div>
      </div>
      <div className="subtasksMoreInfo-item">
        <h3 className="subtasksMoreInfo-item-title">ESTADO ACTUAL</h3>
        <StatusText status={task.status} />
      </div>
      <div className="subtasksMoreInfo-item">
        <h3 className="subtasksMoreInfo-item-title">FECHA DE INICIO</h3>
        <div className="subtasksMoreInfo-item-text">
          <figure className="subtasksMoreInfo-item-icon">
            <img src="/svg/date-icon.svg" alt="W3Schools" />
          </figure>
          {task.users.at(0)?.untilDate
            ? _date(task.users.at(0)?.untilDate || new Date())
            : '-'}
        </div>
      </div>
      <div className="subtasksMoreInfo-item">
        <h3 className="subtasksMoreInfo-item-title">TIEMPO RESTANTE</h3>
        <div className="subtasksMoreInfo-item-text">
          <figure className="subtasksMoreInfo-item-icon">
            <img src="/svg/hours-icon.svg" alt="W3Schools" />
          </figure>
          {task.users.length ? getTimeOut() : '-'}
        </div>
      </div>
      <div className="subtasksMoreInfo-item">
        <h3 className="subtasksMoreInfo-item-title">TOTAL DE DIAS</h3>
        <div className="subtasksMoreInfo-item-text">
          <figure className="subtasksMoreInfo-item-icon">
            <img src="/svg/timer-icon.svg" alt="W3Schools" />
          </figure>
          {task.days}
        </div>
      </div>
    </div>
  );
};

export default SubtasksMoreInfo;
