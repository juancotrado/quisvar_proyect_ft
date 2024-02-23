import { SubtaskInfoHistory } from '..';
import { DataFeedback, Feedback } from '../../../../../../../../../../types';
import './subtasksShippingHistory.css';

interface SubtasksShippingHistoryProps {
  feedBacks: Feedback[];
  getDataFeedback?: (data: DataFeedback) => void;
  authorize?: {
    isAuthorizedMod: boolean;
    isAuthorizedUser: boolean;
  };
  viewComentary?: boolean;
}

const SubtasksShippingHistory = ({
  feedBacks,
  getDataFeedback,
  authorize,
  viewComentary = false,
}: SubtasksShippingHistoryProps) => {
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
          viewComentary={viewComentary}
        />
      ))}
    </div>
  );
};

export default SubtasksShippingHistory;
