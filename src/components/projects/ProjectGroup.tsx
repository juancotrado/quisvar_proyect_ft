/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';
import { ProjectType, Stage } from '../../types/types';
import ProjectCard from './projectCard/ProjectCard';
import DropDownStage from '../shared/select/DropDownStage';
import './projectGroup.css';
import CardAddStage from '../shared/card/cardAddStage/CardAddStage';
import Button from '../shared/button/Button';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import { axiosInstance } from '../../services/axiosInstance';

interface ProjectGroup {
  group: ProjectType[];
  editProject: (value: ProjectType) => void;
  onSave?: () => void;
}

const ProjectGroup = ({ group, editProject, onSave }: ProjectGroup) => {
  const [stageList, setStageList] = useState<Stage[] | null>(null);
  const [stageId, setStageId] = useState(group[0].stageId);
  const [filterStage, setFilterStage] = useState<Stage[] | null>(null);
  const { listStage } = useSelector((state: RootState) => state);
  const [openModal, setOpenModal] = useState(false);
  const [oldStageId, setOldStageId] = useState(0);
  const [newStageId, setNewStageId] = useState(0);

  useEffect(() => {
    getStageList();
  }, [group]);
  useEffect(() => {
    getStageFiltering();
  }, [group]);

  const getStageList = () => {
    const list = group.map(({ stage }) => (stage ? stage : [])).flat();
    const newList = list.length ? list : null;
    setStageList(newList);
  };

  const getStageFiltering = () => {
    const list = group.map(({ stage }) => (stage ? stage : [])).flat();
    const newList = list.length ? list : null;
    if (newList && listStage) {
      const patito = [...newList, ...listStage];
      const patito2 = patito.map(p => JSON.stringify(p));
      const newValue: { [key: string]: any } = {};
      for (const value of patito2) newValue[value] = newValue[value] + 1 || 1;
      const entries = Object.entries(newValue);
      const entriesFilter = entries.filter(entr => entr[1] === 1).flat();
      const filterListStage: Stage[] = entriesFilter
        .filter(i => typeof i == 'string')
        .map(i => JSON.parse(i));
      setFilterStage(filterListStage);
    }
  };

  const projects = useMemo(
    () => (stageList ? group.filter(p => p.stage?.id === stageId) : group),
    [group, stageId, stageList]
  );

  const toggleNewProject = async () => {
    const projectId = group.filter(p => p.stageId === oldStageId).at(0)?.id;
    const stage = newStageId;
    return await axiosInstance
      .post(`/stages/new/${projectId}`, {
        stage,
      })
      .then(onSave);
  };

  const toggleSaveChanges = () => {
    onSave?.();
    getStageList();
    setStageId(group[0].stageId);
  };

  const setEditProject = (project: ProjectType) => editProject(project);
  return (
    <div className="projectGroup-container">
      {projects.map(project => (
        <ProjectCard
          key={project.id}
          project={project}
          editProject={setEditProject}
          onSave={toggleSaveChanges}
        />
      ))}
      <div className="projectGroup-option-container">
        <div className="projectGroup-head-options">
          {stageList && (
            <DropDownStage
              data={stageList}
              label="Seleccionar Etapa"
              itemKey="id"
              textField="name"
              valueInput={(_a, b) => setStageId(parseInt(b))}
              addButton={() => {
                setOpenModal(true);
              }}
            />
          )}
        </div>
        <CardAddStage
          isOpen={openModal}
          size={30}
          onChangeStatus={() => setOpenModal(!openModal)}
        >
          <div className="projectGroup-add-stage-container">
            <div className="projectGroup-container-close-stage">
              <span className="projectGroup-title-stage">
                Añadir Nueva Etapa al proyecto
              </span>
              <Button
                icon="close"
                className="projectGroup-close-button-stage"
                onClick={() => setOpenModal(!openModal)}
              />
            </div>
            <div className="projectGroup-add-stage-list">
              <span className="projectGroup-add-stage-list-label">
                Seleccionar Etapa Origen:
              </span>
              {stageList && (
                <DropDownStage
                  data={stageList}
                  label="Seleccionar Etapa"
                  itemKey="id"
                  textField="name"
                  valueInput={(_a, b) => setOldStageId(parseInt(b))}
                />
              )}
            </div>
            <div className="projectGroup-add-stage-list">
              <span className="projectGroup-add-stage-list-label">
                Seleccionar Etapa Nueva:
              </span>
              {filterStage && (
                <DropDownStage
                  data={filterStage}
                  label="Seleccionar Etapa"
                  itemKey="id"
                  textField="name"
                  valueInput={(_a, b) => setNewStageId(parseInt(b))}
                />
              )}
            </div>
            <div className="projectGroup-container-send-stage">
              <Button
                text="Crear Nueva Etapa"
                className="projectGroup-send-button-stage"
                onClick={() => {
                  toggleNewProject();
                  setOpenModal(!openModal);
                }}
              />
            </div>
          </div>
        </CardAddStage>
      </div>
    </div>
  );
};

export default ProjectGroup;
