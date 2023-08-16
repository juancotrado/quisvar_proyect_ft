import TaskInfoDetails from '../taskInfoDetails/TaskInfoDetails';
import { DetailsPrice } from '../../../../types/types';
import './templateDetails.css';
interface TemplateDetailsProps {
  data: DetailsPrice;
}
const TemplateDetail = ({ data }: TemplateDetailsProps) => {
  return (
    <>
      <li className="template-detail-name">{data.item}</li>
      <li className="template-details-grid-col-span-2 template-detail-name">
        {data.name}
      </li>
      <li className="template-detail-price">S./ {data.balance.toFixed(2)}</li>
      <li className="template-detail-price">S./ {data.spending.toFixed(2)}</li>
      <li className="template-detail-price">S./ {data.price.toFixed(2)}</li>
      <li className="template-details-grid-col-span-2 ">
        <TaskInfoDetails task={data.taskInfo} />
      </li>
    </>
  );
};

export default TemplateDetail;
