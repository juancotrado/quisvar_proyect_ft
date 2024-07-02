import { useState } from 'react';
import { axiosInstance } from '../../../../../../../services/axiosInstance';
import { useParams } from 'react-router-dom';
import { useEmitWithLoader } from '../../../../../../../hooks';

interface useSendToReviewProps {
  taskId: number;
  percentage: number;
}

const useSendToReview = ({ percentage, taskId }: useSendToReviewProps) => {
  const { emitWithLoader, socket } = useEmitWithLoader();
  const { stageId } = useParams();
  const [reviewFiles, setReviewFiles] = useState<File[]>([]);
  const sendToReview = async () => {
    const formdata = new FormData();
    reviewFiles.forEach(file => formdata.append('files', file));
    formdata.append('percentage', String(percentage));
    await axiosInstance.post(`/feedbacks/basic-task/${taskId}`, formdata);
    setReviewFiles([]);
    emitWithLoader('client:load-basic-task', taskId);
    socket.emit('client:load-stage', stageId);
  };
  return { sendToReview, setReviewFiles, reviewFiles };
};

export default useSendToReview;
