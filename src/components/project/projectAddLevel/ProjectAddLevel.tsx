import { useState } from 'react';
import './projectAddLevel.css';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Input } from '../..';
import {
  validateCorrectTyping,
  validateWhiteSpace,
} from '../../../utils/customValidatesForm';
import { axiosInstance } from '../../../services/axiosInstance';
import { Level } from '../../../types/types';
import { isOpenCardRegisteTask$ } from '../../../services/sharingSubject';
import DropDownSimple from '../../shared/select/DropDownSimple';
import useListUsers from '../../../hooks/useListUsers';
import colors from '../../../utils/json/colors.json';

interface DataForm {
  rootId: number;
  stagesId?: number;
  name: string;
  isProject: boolean;
  userId: number;
}
interface ProjectAddLevelProps {
  data: Level;
  onSave?: () => void;
  hasProject: boolean;
}
type AddLevel = 'folder' | 'area';
const ProjectAddLevel = ({
  data,
  onSave,
  hasProject,
}: ProjectAddLevelProps) => {
  const { users: modedators } = useListUsers(['MOD']);
  const [idCoordinator, setIdCoordinator] = useState<number | null>(null);
  const [addLevel, setAddLevel] = useState<AddLevel | null>(null);
  const firstLevel = !data.level;

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<DataForm>();
  const hadleAddFolder = () => setAddLevel('folder');
  const hadleAddArea = () => setAddLevel('area');
  const handleHideForm = () => setAddLevel(null);

  const onSubmitData: SubmitHandler<DataForm> = async body => {
    const { id, stagesId } = data;
    body = { ...body, rootId: firstLevel ? 0 : id, stagesId };
    if (addLevel === 'area') {
      body = { ...body, isProject: true };
    }
    if (data.isProject && idCoordinator) {
      body = { ...body, userId: idCoordinator };
    }
    axiosInstance.post('levels', body).then(() => {
      onSave?.();
      reset({});
      handleHideForm();
    });
  };
  const hadleAddTask = () =>
    (isOpenCardRegisteTask$.setSubject = { isOpen: true, levelId: data.id });

  const typeImgFolder =
    addLevel === 'folder' ? 'add_folder-blue' : 'add_folder';
  const typeImgArea = addLevel === 'area' ? 'add_area-blue' : 'add_area';
  const isProject = data.isProject;
  const style = {
    borderLeft: `thick solid ${colors[data.level + 1]}`,
  };
  return (
    <div
      className={`projectAddLevel ${isProject && 'projectAddLevel-Project'}`}
      style={style}
    >
      {/* <div>{data.item}</div> */}
      <figure className="projectAddLevel-figure" onClick={hadleAddFolder}>
        <img src={`/svg/${typeImgFolder}.svg`} alt="W3Schools" />
      </figure>
      {!hasProject && (
        <figure className="projectAddLevel-figure" onClick={hadleAddArea}>
          <img src={`/svg/${typeImgArea}.svg`} alt="W3Schools" />
        </figure>
      )}
      {!data.nextLevel?.length && !data.isArea && !data.isProject && (
        <figure className="projectAddLevel-figure" onClick={hadleAddTask}>
          <img src={`/svg/task-list.svg`} alt="W3Schools" />
        </figure>
      )}
      {addLevel && (
        <>
          <form
            onSubmit={handleSubmit(onSubmitData)}
            className="projectAddLevel-form"
          >
            <Input
              {...register('name', {
                validate: { validateWhiteSpace, validateCorrectTyping },
              })}
              name="name"
              placeholder={`Nombre del ${
                addLevel === 'area' ? 'Nivel de Areas' : 'Nivel'
              }`}
              className="projectAddLevel-input"
              errors={errors}
            />
            {data.isProject && (
              <DropDownSimple
                data={modedators}
                itemKey="id"
                textField="name"
                type="search"
                name="employees"
                selector
                // className="report-employee-list"
                placeholder="Coordinador de Area"
                valueInput={(_name, index) => setIdCoordinator(+index)}
              />
            )}
          </form>
          <figure
            className="projectAddLevel-figure"
            onClick={handleSubmit(onSubmitData)}
          >
            <img src="/svg/icon_save.svg" alt="W3Schools" />
          </figure>
          <figure className="projectAddLevel-figure" onClick={handleHideForm}>
            <img src="/svg/icon_close.svg" alt="W3Schools" />
          </figure>
        </>
      )}
    </div>
  );
};

export default ProjectAddLevel;
