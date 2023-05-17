import { useState } from 'react';
import { CardRegisterArea } from '../../components';
// import Input from '../../components/shared/Input/Input';
import './dashboard.css';
const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="content-area">
      <button onClick={handleOpen}>Test</button>
      <CardRegisterArea
        isOpen={isOpen}
        onChangeStatus={handleOpen}
        // dataWorkArea={{ id: 6, name: 'awas23', description: 'asdasd' }}
      />
    </div>
  );
};

export default Dashboard;
