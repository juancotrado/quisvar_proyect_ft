import { SubTask } from '../../../types/types';
import { _date } from '../../../utils/formatDate';
import StatusText from '../../shared/statusText/StatusText';
import './subtasksMoreInfo.css';
interface SubtasksMoreInfoProps {
  task: SubTask;
}
const SubtasksMoreInfo = ({ task }: SubtasksMoreInfoProps) => {
  return (
    <div className="subtasksMoreInfo">
      <div className="subtasksMoreInfo-item">
        <h3 className="subtasksMoreInfo-item-title">FECHA DE INICIO</h3>
        <div className="subtasksMoreInfo-item-text">
          <figure className="subtasksMoreInfo-item-icon">
            <img src="/svg/date-icon.svg" alt="W3Schools" />
          </figure>
          {_date(task?.createdAt || new Date())}
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
        <h3 className="subtasksMoreInfo-item-title">TIEMPO RESTANTE</h3>
        <div className="subtasksMoreInfo-item-text">
          <figure className="subtasksMoreInfo-item-icon">
            <img src="/svg/hours-icon.svg" alt="W3Schools" />
          </figure>
          {task.price}
        </div>
      </div>
      <div className="subtasksMoreInfo-item">
        <h3 className="subtasksMoreInfo-item-title">TOTAL DE HORAS</h3>
        <div className="subtasksMoreInfo-item-text">
          <figure className="subtasksMoreInfo-item-icon">
            <img src="/svg/timer-icon.svg" alt="W3Schools" />
          </figure>
          {task.days * 24}
        </div>
      </div>
    </div>
  );
};

export default SubtasksMoreInfo;
