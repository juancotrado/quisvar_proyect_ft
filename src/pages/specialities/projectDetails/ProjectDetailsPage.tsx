import { useParams } from 'react-router-dom';
import ProjectDetails from '../../../components/projects/projectDetails/ProjectDetails';

const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  return <div>{projectId && <ProjectDetails projectId={+projectId} />}</div>;
};

export default ProjectDetailsPage;
