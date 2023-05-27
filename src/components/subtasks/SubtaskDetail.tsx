import { ReviewList } from '../../types/types';
import './subtaskdetail.css';

interface SubtaskDetail {
  onView?: () => void;
  subtask: ReviewList;
}

const SubtaskDetail = ({ onView, subtask }: SubtaskDetail) => {
  const listUsers = subtask?.users.at(0);
  return (
    <div className="subtask-container-main">
      {subtask && (
        <div className="subtask-container">
          <div className="subtask-details">
            <span className="subtask-area">
              {subtask.task.indexTask.workArea.name}
            </span>
            <h4>{subtask.name} </h4>
            <span className="subtask-project">{subtask.task.name}</span>
          </div>
          <div className="subtask-user">
            <div className="subtask-detail-user">
              {listUsers && (
                <h4>
                  {listUsers.user.profile.firstName}
                  {listUsers.user.profile.lastName}
                </h4>
              )}
              <p>{subtask.task.indexTask.name}</p>
            </div>
            <button className="subtask-icon" onClick={onView}>
              <img src="/svg/menu.svg" alt="subtask-icon" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubtaskDetail;
