import { useNavigate } from 'react-router-dom';
import './taks.css';
const Task = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };
  return (
    <div className="task">
      <span className="close-add-card" onClick={goBack}>
        <img src="/svg/close.svg" alt="pencil" />
      </span>
    </div>
  );
};

export default Task;
