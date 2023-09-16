import { DataFeedback, Feedback } from '../../../types/types';
import SubtaskInfoHistory from '../subtaskInfoHistory/SubtaskInfoHistory';
import './subtasksShippingHistory.css';

interface SubtasksShippingHistoryProps {
  feedBacks: Feedback[];
  getDataFeedback?: (data: DataFeedback) => void;
  authorize?: {
    isAuthorizedMod: boolean;
    isAuthorizedUser: boolean;
  };
}

const SubtasksShippingHistory = ({
  feedBacks,
  getDataFeedback,
  authorize,
}: SubtasksShippingHistoryProps) => {
  //
  const firstId = feedBacks[0].id;
  const isStatusDone = !getDataFeedback;

  return (
    <div className="SubtasksShippingHistory-review-contain">
      {feedBacks.map((feedBack: Feedback) => (
        <SubtaskInfoHistory
          key={feedBack.id}
          feedBack={feedBack}
          className={`SubtasksShippingHistory-review-card ${
            isStatusDone &&
            firstId === feedBack.id &&
            'SubtasksShippingHistory-files-accept'
          }`}
          getDataFeedback={getDataFeedback}
          authorize={authorize}
        />
      ))}
    </div>
  );
};

export default SubtasksShippingHistory;
