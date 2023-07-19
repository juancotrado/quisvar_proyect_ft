import { useEffect, useMemo, useState } from 'react';
import { ProjectType, Stage } from '../../types/types';
import ProjectCard from './projectCard/ProjectCard';
import DropDownStage from '../shared/select/DropDownStage';
import './projectGroup.css';

interface ProjectGroup {
  group: ProjectType[];
  editProject: (value: ProjectType) => void;
}

const ProjectGroup = ({ group, editProject }: ProjectGroup) => {
  const [stageList, setStageList] = useState<Stage[] | null>(null);
  const [stageId, setStageId] = useState(group[0].stageId);

  useEffect(() => {
    const list = group.map(({ stage }) => (stage ? stage : [])).flat();
    const newList = list.length ? list : null;
    setStageList(newList);
  }, [group]);

  const projects = useMemo(
    () => (stageList ? group.filter(p => p.stage?.id === stageId) : group),
    [group, stageId, stageList]
  );
  //   const getProjects = async (id: number) => {
  //     setSpecialityId(id);
  //     await axiosInstance.get(`specialities/${id}`).then(res => {
  //       setGroupProject(res.data.groups);
  //       // setProjects(res.data.projects);
  //     });
  //   };

  const setEditProject = (project: ProjectType) => editProject(project);
  return (
    <div className="projectGroup-container">
      {projects.map(project => (
        <ProjectCard
          key={project.id}
          project={project}
          editProject={setEditProject}
          //   onSave={getProjects}
        />
      ))}
      <div className="projectGroup-head-options">
        {stageList && (
          <DropDownStage
            data={stageList}
            label="Seleccionar Etapa"
            itemKey="id"
            textField="name"
            valueInput={(_a, b) => setStageId(parseInt(b))}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectGroup;
