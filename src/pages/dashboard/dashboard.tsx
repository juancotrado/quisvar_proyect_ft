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

  return <div></div>;
};

export default Dashboard;
