import { AreaDetailsPrice } from '../../../../types/types';
import TemplateDetail from '../templateDetail/TemplateDetail';

interface AreaDetailsProps {
  area: AreaDetailsPrice;
}

const AreaDetails = ({ area }: AreaDetailsProps) => {
  return (
    <div className="project-grid-col-span-total ">
      <ul key={area.id} className="project-grid-container project-grid-area">
        <TemplateDetail data={area} />
        {/* <li className="project-grid-col-span-total ">
        {area.indexTasks.map(indextask => (
            <ul
            key={area.id}
            className="project-grid-container project-grid-area"
            >
            <li>{area.item}</li>
            <li className="project-grid-col-span-2">{area.name}</li>
            <li>S./ {area.balance.toFixed(2)}</li>
            <li>S./ {area.spending.toFixed(2)}</li>
            <li>S./ {area.price.toFixed(2)}</li>
            <li className="project-grid-col-span-2">
              <TaskInfoDetails task={area.taskInfo} />
            </li>
            <li className="project-grid-col-span-total "></li>
          </ul>
        ))}
      </li> */}
      </ul>
    </div>
  );
};

export default AreaDetails;
