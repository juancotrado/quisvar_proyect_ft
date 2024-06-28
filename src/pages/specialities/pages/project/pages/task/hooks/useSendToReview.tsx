import React, { useContext, useState } from 'react';
import { axiosInstance } from '../../../../../../../services/axiosInstance';
import { SocketContext } from '../../../../../../../context';

interface useSendToReviewProps {
  taskId: number;
  percentage: number;
}

const useSendToReview = ({ percentage, taskId }: useSendToReviewProps) => {
  const socket = useContext(SocketContext);

  const [reviewFiles, setReviewFiles] = useState<File[]>([]);
  const sendToReview = async () => {
    const formdata = new FormData();
    reviewFiles.forEach(file => formdata.append('files', file));
    formdata.append('percentage', String(percentage));
    await axiosInstance.post(`/feedbacks/basic-task/${taskId}`, formdata);
    setReviewFiles([]);
    socket.emit('client:load-basic-task', taskId);
  };
  return { sendToReview, setReviewFiles, reviewFiles };
};

export default useSendToReview;
