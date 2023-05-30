import { useEffect, useState } from 'react';
// import Input from '../../components/shared/Input/Input';
import './notificationsList.css';
import SubtaskDetail from '../../components/subtasks/SubtaskDetail';
import { axiosInstance } from '../../services/axiosInstance';
import { ReviewList } from '../../types/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const NotificationsList = () => {
  //   const [isOpen, setIsOpen] = useState(false);
  //   const handleOpen = () => {
  //     setIsOpen(!isOpen);
  //   };

  const { userSession } = useSelector((state: RootState) => state);
  const [subTasks, setSubTasks] = useState<ReviewList[]>();
  useEffect(() => {
    getNotification();
  }, [userSession]);
  const getNotification = async () => {
    await axiosInstance
      .get(`/workareas/${userSession.id}/review`)
      .then(res => setSubTasks(res.data));
  };
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
