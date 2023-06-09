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
    <div className="notify container">
      <div className="notify-head">
        <div>
          <h1 className="main-title">
            LISTA DE <span className="main-title-span">NOTIFICACIONES </span>
          </h1>
        </div>
      </div>
      <div className="notify-card-container">
        {subTasks &&
          subTasks.map(subtask => (
            <SubtaskDetail key={subtask.id} subtask={subtask} />
          ))}
      </div>
    </div>
  );
};

export default NotificationsList;
