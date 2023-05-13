import { useNavigate } from 'react-router-dom';
import './areaCard.css';

interface AreaCardProps {
  name: string;
  id: number;
}
const AreaCard = ({ name, id }: AreaCardProps) => {
  const navigate = useNavigate();
  const handleNext = () => {
    console.log('este es el id', id);
    navigate(`/proyectos/${id}`);
  };
  return (
    <div className="area-card" onClick={handleNext}>
      <h2 className="area-card-title">{name}</h2>
      <div className="area-card-icon-container">
        <img
          className="area-card-icon"
          src="/svg/work_outline.svg"
          alt="workIcon"
        />
        <p className="area-card-text">Total de proyectos</p>
      </div>
    </div>
  );
};

export default AreaCard;
