/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../../services/axiosInstance';
import './projectDetails.css';
import { ProjectDetailsPrice } from '../../../types/types';
import TemplateDetail from './templateDetail/TemplateDetail';
interface ProjectDetailsProps {
  projectId: number | null;
}

const ProjectDetails = ({ projectId }: ProjectDetailsProps) => {
  const [detailsProjects, setDetailsProjects] =
    useState<ProjectDetailsPrice | null>(null);

  useEffect(() => {
    getProjectDetails();
  }, [projectId]);

  const getProjectDetails = () => {
    projectId &&
      axiosInstance
        .get(`projects/price/${projectId}`)
        .then(res => setDetailsProjects(res.data));
  };
  console.log(detailsProjects?.areas);
  //   console.log(detailsProjects);
  return (
    <div className="project-details-container">
      <ul className="project-grid-title">
        <li>Item</li>
        <li className="project-grid-col-span-2">Nombre</li>
        <li>Gasto</li>
        <li>Saldo</li>
        <li>Total</li>
        <li className="project-grid-col-span-2">Estado Tareas</li>
      </ul>
      {detailsProjects && (
        <ul className="project-grid-container">
          <TemplateDetail data={detailsProjects} />
          {detailsProjects.areas.map(area => (
            <div key={area.id} className="project-grid-col-span-total ">
              <ul className="project-grid-container project-grid-area">
                <TemplateDetail data={area} />
                {area.indexTasks.map(indexTask => (
                  <div
                    key={indexTask.id}
                    className="project-grid-col-span-total "
                  >
                    <ul className="project-grid-container project-grid-area">
                      <TemplateDetail data={indexTask} />
                      {indexTask.tasks.map(task => (
                        <div
                          key={task.id}
                          className="project-grid-col-span-total "
                        >
                          <ul
                            key={task.id}
                            className="project-grid-container project-grid-area"
                          >
                            <TemplateDetail data={task} />
                            {task.tasks_2.map(task_2 => (
                              <div
                                key={task_2.id}
                                className="project-grid-col-span-total "
                              >
                                <ul
                                  key={task_2.id}
                                  className="project-grid-container project-grid-area"
                                >
                                  <TemplateDetail data={task_2} />
                                  {task_2.tasks_3.map(task_3 => (
                                    <div
                                      key={task_3.id}
                                      className="project-grid-col-span-total "
                                    >
                                      <ul
                                        key={task_3.id}
                                        className="project-grid-container project-grid-area"
                                      >
                                        <TemplateDetail data={task_3} />
                                      </ul>
                                    </div>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </ul>
                  </div>
                ))}
              </ul>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectDetails;
