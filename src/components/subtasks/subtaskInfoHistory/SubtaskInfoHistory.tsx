import { useState } from 'react';
import { DataFeedback, Feedback, Profile } from '../../../types/types';
import { motion } from 'framer-motion';
import { TextArea } from '../..';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import SubtaskFile from '../subtaskFiles/SubtaskFile';
import './subtaskInfoHistory.css';
import { container } from '../../../animations/animations';
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
  console.log(authorize?.isAuthorizedMod);
  return (
    <div className={`SubtaskInfoHistory-review-card ${className}`}>
      <motion.h3
        className="SubtaskInfoHistory-review-card-time"
        onClick={toggleIsActive}
      >
        Enviado por{' '}
        <strong>{getUserName(feedBack.files[0].user.profile)}</strong>
        {' el '}
        <strong>{getDatetimeCreated(feedBack.createdAt)}</strong>
      </motion.h3>
      {isActive && (
        <motion.div
          className="SubtaskInfoHistory-container-feedback"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {getDataFeedback &&
            ((authorize?.isAuthorizedUser && feedBack.comment) ||
              authorize?.isAuthorizedMod) && (
              <TextArea
                label={!feedBack.comment ? 'Agregar Comentario' : 'Comentario'}
                className="SubtaskInfoHistory-container-feedback-textarea"
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
          <div
            className={`${
              !getDataFeedback
                ? 'SubtaskInfoHistory-container-feedback-files-container'
                : 'SubtaskInfoHistory-no-feedback '
            }`}
          >
            <h3>Archivos Enviados:</h3>
            <SubtaskFile
              files={feedBack.files}
              showDeleteBtn={false}
              className="SubtaskInfoHistory-container-feedback-files"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SubtaskInfoHistory;
