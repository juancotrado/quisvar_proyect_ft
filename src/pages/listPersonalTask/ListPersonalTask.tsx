import { useEffect, useState } from 'react';
import { axiosInstance } from '../../services/axiosInstance';

const ListPersonalTask = () => {
  const [tasks, setTasks] = useState<{ [key: string]: any }[] | null>(null);
  useEffect(() => {
    const data = localStorage.getItem('personalData');
    if (typeof data !== 'string') return;
    const personalData = JSON.parse(data);

    const { id } = personalData;

    axiosInstance
      .get(`/users/${id}/tasks`)
      .then(res => {
        setTasks(res.data);
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);
  console.table(tasks);
  return (
    <div>{tasks && tasks?.map(task => <p key={task.id}> {task.name} </p>)}</div>
  );
};

export default ListPersonalTask;
