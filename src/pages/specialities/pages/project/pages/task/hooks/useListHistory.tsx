import { axiosInstance } from '../../../../../../../services/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { Feedback } from '../../../../../../../types';

const getTaskHistory = async (taskId: number) => {
  const res = await axiosInstance.get<Feedback[]>(
    `/feedbacks/basic-task/${taskId}`,
    {
      headers: {
        noLoader: true,
      },
    }
  );
  return res.data;
};

const useListHistory = (taskId: number) => {
  const listTaskHistoryQuery = useQuery({
    queryKey: ['listTaskHistory', taskId],
    queryFn: () => getTaskHistory(taskId),
  });
  return { listTaskHistoryQuery };
};

export default useListHistory;
