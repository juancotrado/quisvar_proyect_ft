import { useEffect, useState } from 'react';
// import Input from '../../components/shared/Input/Input';
import './dashboard.css';
import SubtaskDetail from '../../components/subtasks/SubtaskDetail';
import { axiosInstance } from '../../services/axiosInstance';
import { ReviewList } from '../../types/types';
const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => {
    setIsOpen(!isOpen);
  };
  const [subTasks, setSubTasks] = useState<ReviewList[]>();
  useEffect(() => {
    axiosInstance.get('/workareas/5/review').then(res => setSubTasks(res.data));
  }, []);

  return (
    <div
      className="content-area"
      style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
    >
      {subTasks &&
        subTasks.map(subtask => (
          <SubtaskDetail key={subtask.id} subtask={subtask} />
        ))}
    </div>
  );
};

export default Dashboard;
