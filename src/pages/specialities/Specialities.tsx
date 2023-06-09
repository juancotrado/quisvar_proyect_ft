import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { axiosInstance } from '../../services/axiosInstance';
import { ProjectType, SpecialityType } from '../../types/types';
import { useEffect, useState } from 'react';
import CardSpeciality from '../../components/speciality/cardSpeciality/CardSpeciality';
import CardAddSpeciality from '../../components/speciality/cardAddSpeality/CardAddSpeciality';
import './specialities.css';
import ProjectCard from '../../components/projects/projectCard/ProjectCard';

const Specialities = () => {
  const { userSession } = useSelector((state: RootState) => state);
  const [projects, setProjects] = useState<ProjectType[]>([]);

  const role = userSession?.role ? userSession.role : 'EMPLOYEE';
  const [specialities, setSpecialities] = useState<SpecialityType[] | null>(
    null
  );

  useEffect(() => {
    getSpecialities();
  }, []);

  const getSpecialities = async () => {
    await axiosInstance
      .get('/specialities')
      .then(res => setSpecialities(res.data));
  };
  const getProjects = async (id: number) => {
    await axiosInstance.get(`specialities/${id}`).then(res => {
      setProjects(res.data.projects);
    });
  };
  return (
    <div className="container speciality">
      <div className="speciality-head">
        <h1 className="speciality-title">
          <span className="speciality-title-span">ESPECIALIDADES</span>
        </h1>
      </div>
      <div className="speciality-main">
        <div className="speciality-card-container">
          {specialities &&
            specialities.map(_speciality => (
              <CardSpeciality
                key={_speciality.id}
                data={_speciality}
                onDelete={getSpecialities}
                onUpdate={getSpecialities}
                role={role}
                getProjects={getProjects}
              />
            ))}
          {role !== 'EMPLOYEE' && (
            <CardAddSpeciality onSave={getSpecialities} />
          )}
        </div>
        <div className="speciality-project-container">
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              // onClick={() => {
              //   editProject(project);
              // }}
              // onSave={succefullyProject}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Specialities;
