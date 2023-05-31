import { useEffect, useState } from 'react';
// import Input from '../../components/shared/Input/Input';
import './dashboard.css';
import SubtaskDetail from '../../components/subtasks/SubtaskDetail';
import { axiosInstance } from '../../services/axiosInstance';
import { ReviewList } from '../../types/types';
import CardRegisterSubTask from '../../components/shared/card/cardRegisterSubTask/CardRegisterSubTask';
import InputFile from '../../components/shared/Input/InputFile';
const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <CardRegisterSubTask subTaskId={1} />
      {/* <InputFile /> */}
    </div>
  );
};

export default Dashboard;
