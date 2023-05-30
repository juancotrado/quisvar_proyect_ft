import { useEffect, useState } from 'react';
// import Input from '../../components/shared/Input/Input';
import './notificationsList.css';
import SubtaskDetail from '../../components/subtasks/SubtaskDetail';
import { axiosInstance } from '../../services/axiosInstance';
import { ReviewList } from '../../types/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const NotificationsList = () => {
  const { userSession } = useSelector((state: RootState) => state);
  const [subTasks, setSubTasks] = useState<ReviewList[]>();

  useEffect(() => {
    if (!userSession.id) return;
    axiosInstance
      .get(`/workareas/${userSession.id}/review`)
      .then(res => setSubTasks(res.data));
  }, [userSession.id]);

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

export default NotificationsList;
