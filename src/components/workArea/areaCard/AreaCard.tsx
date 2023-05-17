import { useNavigate } from 'react-router-dom';
import './areaCard.css';
import { useEffect, useState } from 'react';

interface AreaCardProps {
  name: string;
  id: number;
  total?: number;
  onClick?: () => void;
}
const AreaCard = ({ name, id, total, onClick }: AreaCardProps) => {
  const navigate = useNavigate();
  const [role, setRole] = useState('EMPLOYEE');

  const handleNext = () => {
    navigate(`/proyectos/${id}`);
  };

  useEffect(() => {
    const userInfo = localStorage.getItem('personalData');
    if (typeof userInfo !== 'string') return;
    const _user = JSON.parse(userInfo);
    setRole(_user.role);
  }, []);

  return (
    <div className="area-card" onClick={handleNext}>
      {role !== 'EMPLOYEE' && (
        <span className="edit-icon" onClick={e => e.stopPropagation()}>
          <div className="" onClick={onClick}>
            <img src="/svg/pencil.svg" alt="pencil" />
          </div>
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
