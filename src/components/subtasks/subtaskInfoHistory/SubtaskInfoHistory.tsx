import { useState } from 'react';
import { DataFeedback, Feedback, Profile } from '../../../types/types';
import { motion } from 'framer-motion';
import { TextArea } from '../..';
import SubtaskFile from '../subtaskFiles/SubtaskFile';
import './subtaskInfoHistory.css';
import { container } from '../../../animations/animations';
import { _date } from '../../../utils/formatDate';
interface SubtaskInfoHistoryProps {
  feedBack: Feedback;
  className?: string;
  getDataFeedback?: (data: DataFeedback) => void;
  authorize?: {
    isAuthorizedMod: boolean;
    isAuthorizedUser: boolean;
  };
}

const SubtaskInfoHistory = ({
  feedBack,
  className,
  authorize,
  getDataFeedback,
}: SubtaskInfoHistoryProps) => {
  const [isActive, setIsActive] = useState(false);
  const toggleIsActive = () => setIsActive(!isActive);

  const getUserName = (profile: Profile) => {
    const { firstName, lastName } = profile;
    return firstName + ' ' + lastName;
  };
  const getDatetimeCreated = (dateTime: string) => {
    const date = new Date(dateTime);
    const localeDate = _date(date);
    const localeTime = date.toLocaleTimeString();

    return ` ${localeDate} a las ${localeTime}`;
  };
  return (
    <div className={`SubtaskInfoHistory-review-card ${className}`}>
      <h3
        className="SubtaskInfoHistory-title-information"
        onClick={toggleIsActive}
      >
        <figure className="cardSubtask-figure">
          <img src="/svg/person-blue.svg" alt="W3Schools" />
        </figure>
        {getUserName(feedBack.files[0].user.profile)}
        <span className="SubtaskInfoHistory-send-file">Envió un archivo</span>
        <span className="SubtaskInfoHistory-send-date">
          {getDatetimeCreated(feedBack.createdAt)}
        </span>
      </h3>
      {isActive && (
        <motion.div
          className="SubtaskInfoHistory-container-feedback"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <div
            className={`${
              !getDataFeedback
                ? 'SubtaskInfoHistory-container-feedback-files-container'
                : 'SubtaskInfoHistory-no-feedback '
            }`}
          >
            <SubtaskFile files={feedBack.files} showDeleteBtn={false} />
          </div>
          {getDataFeedback &&
            ((authorize?.isAuthorizedUser && feedBack.comment) ||
              authorize?.isAuthorizedMod) && (
              <TextArea
                rows={2}
                className="SubtaskInfoHistory-container-feedback-textarea"
                onBlur={e =>
                  getDataFeedback({
                    comment: e.target.value.trim(),
                    id: feedBack.id,
                  })
                }
                placeholder={
                  !feedBack.comment ? 'Añadir Comentario' : 'Comentario'
                }
                defaultValue={feedBack.comment || ''}
                disabled={feedBack.comment ? true : false}
              />
            )}
        </motion.div>
      )}
    </div>
  );
};

export default SubtaskInfoHistory;
