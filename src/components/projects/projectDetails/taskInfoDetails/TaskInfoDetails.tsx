import { TypeTaskInfoDetails } from '../../../../types/types';
import './taskInfoDetails.css';

interface TaskInfoDetailsProps {
  task: TypeTaskInfoDetails;
}

const TaskInfoDetails = ({ task }: TaskInfoDetailsProps) => {
  return (
    <ul className="task-info-details-container">
      <li className="task-info-details-unresolved">S.A: {task.UNRESOLVED}</li>
      <li className="task-info-details-process">A: {task.PROCESS}</li>
      <li className="task-info-details-inreview">E.R: {task.INREVIEW}</li>
      <li className="task-info-details-denied">E.C: {task.DENIED}</li>
      <li className="task-info-details-done">H: {task.DONE} </li>
      <li className="task-info-details-liquidation">L: {task.LIQUIDATION}</li>
      {/* <li className=" col-span-3">Total de Tareas: {task.TOTAL}</li> */}
    </ul>
  );
};

export default TaskInfoDetails;
