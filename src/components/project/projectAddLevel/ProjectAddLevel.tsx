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

interface DataForm {
  rootId: number;
  stagesId?: number;
  name: string;
}
interface ProjectAddLevelProps {
  data: Level;
  onSave?: () => void;
}
type AddLevel = 'folder' | 'area';
const ProjectAddLevel = ({ data, onSave }: ProjectAddLevelProps) => {
  const [addLevel, setAddLevel] = useState<AddLevel | null>(null);
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
    const { id: rootId, stagesId } = data;
    body = { ...body, rootId, stagesId };
    axiosInstance.post('levels', body).then(() => {
      console.log(onSave);
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
  return (
    <div className="projectAddLevel">
      <figure className="projectAddLevel-figure" onClick={hadleAddFolder}>
        <img src={`/svg/${typeImgFolder}.svg`} alt="W3Schools" />
      </figure>
      <figure className="projectAddLevel-figure" onClick={hadleAddArea}>
        <img src={`/svg/${typeImgArea}.svg`} alt="W3Schools" />
      </figure>
      <figure className="projectAddLevel-figure" onClick={hadleAddTask}>
        <img src={`/svg/task-list.svg`} alt="W3Schools" />
      </figure>
      {addLevel && (
        <>
          <form onSubmit={handleSubmit(onSubmitData)}>
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
