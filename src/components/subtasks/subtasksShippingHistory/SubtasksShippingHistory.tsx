import { TextArea } from '../..';
import { DataFeedback, Feedback } from '../../../types/types';
import SubtaskFile from '../subtaskFiles/SubtaskFile';
import './subtasksShippingHistory.css';

interface SubtasksShippingHistoryProps {
  feedBacks: Feedback[];
  getDataFeedback?: (data: DataFeedback) => void;
  isAuthorizedUser?: boolean;
  isAuthorizedMod?: Boolean;
}

const SubtasksShippingHistory = ({
  feedBacks,
  getDataFeedback,
  isAuthorizedUser,
  isAuthorizedMod,
}: SubtasksShippingHistoryProps) => {
  const getDatetimeCreated = (dateTime: string) => {
    const date = new Date(dateTime);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const localeDate = date.toLocaleDateString('es-PE', options);
    const localeTime = date.toLocaleTimeString('en-US');

    return `Enviado el ${localeDate} a las ${localeTime}`;
  };
  const firstId = feedBacks[0].id;
  const isStatusDone = !getDataFeedback;
  return (
    <div className="SubtasksShippingHistory-review-contain">
      {feedBacks.map((feedBack: Feedback) => (
        <div
          key={feedBack.id}
          className={`SubtasksShippingHistory-review-card ${
            isStatusDone &&
            firstId === feedBack.id &&
            'SubtasksShippingHistory-files-accept'
          }`}
        >
          <h3 className="SubtasksShippingHistory-review-card-time">
            {getDatetimeCreated(feedBack.createdAt)}:
          </h3>
          <SubtaskFile files={feedBack.files} showDeleteBtn={false} />
          {getDataFeedback &&
            ((isAuthorizedUser && feedBack.comment) || isAuthorizedMod) && (
              <TextArea
                label={!feedBack.comment ? 'Agregar Comentario' : 'Comentario'}
                onBlur={e =>
                  getDataFeedback({
                    comment: e.target.value.trim(),
                    id: feedBack.id,
                  })
                }
                defaultValue={feedBack.comment || ''}
                disabled={feedBack.comment ? true : false}
              />
            )}
        </div>
      ))}
    </div>
  );
};

export default SubtasksShippingHistory;
