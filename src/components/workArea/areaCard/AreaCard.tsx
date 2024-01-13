import { useNavigate } from 'react-router-dom';
import './areaCard.css';
import useRole from '../../../hooks/useRole';
import ButtonDelete from '../../button/ButtonDelete';
import Button from '../../button/Button';

interface AreaCardProps {
  name: string;
  id: number;
  total?: number;
  onClick?: () => void;
  onDelete?: () => void;
}

const AreaCard = ({ name, id, total, onClick, onDelete }: AreaCardProps) => {
  const navigate = useNavigate();
  const { role } = useRole();
  const handleNext = () => {
    navigate(`/proyectos/${id}`);
  };

  return (
    <div className="area-card" onClick={handleNext}>
      {role !== 'EMPLOYEE' && (
        <span className="area-edit" onClick={e => e.stopPropagation()}>
          <ButtonDelete
            icon="trash"
            url={`/workareas/${id}`}
            className="area-delete-icon"
            onSave={onDelete}
          />
          <Button icon="pencil" className="area-edit-icon" onClick={onClick} />
        </span>
      )}
      <h2 className="area-card-title">{name}</h2>
      <div className="area-card-icon-container">
        <img
          className="area-card-icon"
          src="/svg/work_outline.svg"
          alt="workIcon"
        />
        <p className="area-card-text">{`Total de proyectos: ${total}`} </p>
      </div>
    </div>
  );
};

export default AreaCard;
