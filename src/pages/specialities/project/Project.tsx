import { useParams } from 'react-router-dom';

const Project = () => {
  const { id } = useParams();
  console.log(id);
  return <div>Project</div>;
};

export default Project;
