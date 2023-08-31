import { useEffect, useState } from 'react';
import { axiosInstance } from '../../../services/axiosInstance';
import './projectDetails.css';
import { ProjectDetailsPrice } from '../../../types/types';
import TemplateDetail from './templateDetail/TemplateDetail';
import SubtaskDetailsPrice from './subtaskDetails/SubtaskDetailsPrice';
import TemplateScrolling from './templateDetail/TemplateScrolling';
interface ProjectDetailsProps {
  projectId: number | null;
}

const ProjectDetails = ({ projectId }: ProjectDetailsProps) => {
  const [detailsProjects, setDetailsProjects] =
    useState<ProjectDetailsPrice | null>(null);

  useEffect(() => {
    const getProjectDetails = () => {
      projectId &&
        axiosInstance
          .get(`projects/price/${projectId}`)
          .then(res => setDetailsProjects(res.data));
    };
    getProjectDetails();
  }, [projectId]);

  return (
    <div className="project-details-container">
      <ul className="project-grid-title">
        <li>Item</li>
        <li className="project-grid-col-span-2">Nombre</li>
        <li>Saldo</li>
        <li>Gasto</li>
        <li>Total</li>
        <li className="project-grid-col-span-2">Estado Tareas</li>
      </ul>
      {detailsProjects && (
        <ul className="project-grid-container project-detail-project">
          <TemplateDetail data={detailsProjects} />
          <TemplateScrolling className="project-grid-col-span-total">
            {detailsProjects.areas.map(area => (
              <ul className="project-detail-area project-grid-container">
                <TemplateDetail data={area} />
                <TemplateScrolling className="project-grid-col-span-total">
                  {area.indexTasks.map(indexTask => (
                    <div
                      key={indexTask.id}
                      className="project-grid-col-span-total"
                    >
                      <ul className="project-detail-area project-grid-container">
                        <TemplateDetail data={indexTask} />
                        <TemplateScrolling className="project-grid-col-span-total">
                          {indexTask.tasks.map(task => (
                            <div
                              key={task.id}
                              className="project-grid-col-span-total "
                            >
                              <ul
                                key={task.id}
                                className=" project-detail-indextask project-grid-container "
                              >
                                <TemplateDetail data={task} />
                                <TemplateScrolling className="project-grid-col-span-total">
                                  {task.tasks_2.map(task_2 => (
                                    <div
                                      key={task_2.id}
                                      className="project-grid-col-span-total "
                                    >
                                      <ul
                                        key={task_2.id}
                                        className="project-detail-task project-grid-container"
                                      >
                                        <TemplateDetail data={task_2} />
                                        <TemplateScrolling className="project-grid-col-span-total">
                                          {task_2.tasks_3.map(task_3 => (
                                            <div
                                              key={task_3.id}
                                              className="project-detail-task-2 project-grid-col-span-total "
                                            >
                                              <ul
                                                key={task_3.id}
                                                className="project-detail-task-3 project-grid-container"
                                              >
                                                <TemplateDetail data={task_3} />
                                              </ul>
                                            </div>
                                          ))}
                                        </TemplateScrolling>
                                      </ul>
                                    </div>
                                  ))}
                                </TemplateScrolling>
                              </ul>
                            </div>
                          ))}
                        </TemplateScrolling>
                      </ul>
                      {indexTask.subTasks &&
                        indexTask.subTasks.length !== 0 && (
                          <SubtaskDetailsPrice subTasks={indexTask.subTasks} />
                        )}
                    </div>
                  ))}
                </TemplateScrolling>
              </ul>
            ))}
          </TemplateScrolling>
        </ul>
      )}
    </div>
  );
};

export default ProjectDetails;
