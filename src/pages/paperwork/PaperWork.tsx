import { useState } from 'react';
import './paperWork.css';
import UserDetailsReport from '../../components/papers/UserDetailsReport';
import UserListReport from '../../components/papers/UserListReport';

const PaperWork = () => {
  const [isUser, setIsUser] = useState(false);
  return (
    <div className="paper-work-container-main">
      <div className="paper-work-container">
        <h2 className="paper-work-title">Trámites</h2>
        {isUser ? (
          <UserDetailsReport className="paper-work-container-cards" />
        ) : (
          <UserListReport className="paper-work-container-cards" />
        )}
      </div>
    </div>
  );
};

export default PaperWork;
