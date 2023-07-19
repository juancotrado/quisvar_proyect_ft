import { useSelector } from 'react-redux';
import { TextArea } from '../..';
import { DataFeedback, Feedback, Profile } from '../../../types/types';
import SubtaskFile from '../subtaskFiles/SubtaskFile';
import './subtasksShippingHistory.css';
import { RootState } from '../../../store';

interface SubtasksShippingHistoryProps {
  feedBacks: Feedback[];
  getDataFeedback?: (data: DataFeedback) => void;
  isAuthorizedUser?: boolean;
}

const SubtasksShippingHistory = ({
  feedBacks,
  getDataFeedback,
  isAuthorizedUser,
}: SubtasksShippingHistoryProps) => {
  const { modAuth } = useSelector((state: RootState) => state);
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

    return ` ${localeDate} a las ${localeTime}`;
  };

  const getUserName = (profile: Profile) => {
    const { firstName, lastName } = profile;
    return firstName + ' ' + lastName;
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
            Enviado por{' '}
            <strong>{getUserName(feedBack.files[0].user.profile)}</strong>
            {' el'}
            {getDatetimeCreated(feedBack.createdAt)}:
          </h3>
          <SubtaskFile files={feedBack.files} showDeleteBtn={false} />
          {getDataFeedback &&
            ((isAuthorizedUser && feedBack.comment) || modAuth) && (
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
