import React, { ChangeEvent, useState } from 'react';
import { FeedbackType } from '../../../models';
import { useEmitWithLoader } from '../../../../../../../hooks';
import { SubTask } from '../../../../../../../types';

interface useReviewTaskProps {
  percentage: number;
  task: SubTask;
}

const useReviewTask = ({ percentage, task }: useReviewTaskProps) => {
  const [feedback, setFeedback] = useState('');
  const { emitWithLoader } = useEmitWithLoader();

  const onChangeFeedBack = ({ target }: ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(target.value);
  };
  const reviewTask = async (type: FeedbackType) => {
    const { lastFeedback, users } = task;
    const userIdTask = users.ACTIVE[0].id;
    const body = {
      percentage,
      userIdTask,
      comment: feedback,
      type,
      id: lastFeedback.id,
    };

    emitWithLoader('client:review-basic-task', task.id, body);
    setFeedback('');
  };
  return { reviewTask, feedback, onChangeFeedBack };
};

export default useReviewTask;
