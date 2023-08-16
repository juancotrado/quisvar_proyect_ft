import { DetailsSubtasks } from '../../../../types/types';
import './subtaskDetailsPrice.css';
interface SubtaskDetailsPriceProps {
  className?: string;
  subTasks: DetailsSubtasks[];
}
const SubtaskDetailsPrice = ({
  className,
  subTasks,
}: SubtaskDetailsPriceProps) => {
  return (
    <div className="subtask-deatils-container-main">
      <ul className={`${className} subtask-details-price-grid-container-title`}>
        <li>Item</li>
        <li className="project-grid-col-span-2">Nombre</li>
        <li>Saldo</li>
        <li>Precio</li>
        <li>Porcentaje</li>
        <li>Estado</li>
        <li className="project-grid-col-span-2">Usuario Asignado</li>
      </ul>
      {subTasks.map(subtask => (
        <ul key={subtask.id} className="subtask-details-price-grid-container">
          <li className="subtask-deatils-price-item">{subtask.item} </li>
          <li className="project-grid-col-span-2 subtask-deatils-price-item ">
            {subtask.name}
          </li>
          <li className="subtask-deatils-price-item">S./ {subtask.balance} </li>
          <li className="subtask-deatils-price-item">S./ {subtask.price} </li>
          <li className="subtask-deatils-price-item">
            {subtask.users.reduce((a, c) => a + c.percentage, 0)}%
          </li>
          <li className="subtask-deatils-price-item">
            {subtask.status === 'DONE'
              ? 'HECHO'
              : subtask.status === 'PROCESS'
              ? 'PROCESO'
              : subtask.status === 'UNRESOLVED'
              ? 'SIN ASIGNAR'
              : subtask.status === 'LIQUID'
              ? 'LIQUIDADO'
              : subtask.status === 'INREVIEW'
              ? 'REVISIÓN'
              : 'CORRECCIÓN'}
          </li>
          <li className="project-grid-col-span-2 subtask-deatils-price-item ">
            <ul>
              {subtask.users.map(({ user, percentage }, i) => (
                <li key={i}>
                  <span>
                    {i + 1}. {user.profile.firstName} {user.profile.lastName}{' '}
                  </span>
                  <span>{percentage}% </span>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      ))}
    </div>
  );
};

export default SubtaskDetailsPrice;
