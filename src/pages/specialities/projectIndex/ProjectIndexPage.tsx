import { useEffect, useState } from 'react';
import { axiosInstance } from '../../../services/axiosInstance';

const ProjectIndexPage = () => {
  const [workArea, setWorkArea] = useState();
  const id = 26;
  useEffect(() => {
    getWorkAreas();
  }, []);
  const getWorkAreas = async () => {
    axiosInstance.get(`/workareas/${id}`).then(res => {
      setWorkArea(res.data);
    });
  };
  console.log(workArea);
  return <div>ProjectIndexPage</div>;
};

export default ProjectIndexPage;
