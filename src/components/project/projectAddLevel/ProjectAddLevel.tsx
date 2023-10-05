import { useEffect, useState } from 'react';
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
import FloatingText from '../../shared/floatingText/FloatingText';

interface DataForm {
  rootId: number;
  stagesId?: number;
  name: string;
  isProject: boolean;
  userId: number;
  typeItem: TypeItem;
}
type TypeItem = 'ABC' | 'ROM' | 'NUM';
const typeNumber = {
  ABC: 'A',
  ROM: 'I',
  NUM: '1',
};
interface ProjectAddLevelProps {
  data: Level;
  onSave?: () => void;
}
type AddLevel = 'folder' | 'area';
const ProjectAddLevel = ({ data, onSave }: ProjectAddLevelProps) => {
  const { users: modedators } = useListUsers(['MOD']);
  const [idCoordinator, setIdCoordinator] = useState<number | null>(null);
  const [addLevel, setAddLevel] = useState<AddLevel | null>(null);
  const firstLevel = !data.level;

  const {
    handleSubmit,
    register,
    reset,
    watch,
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
    if (body.typeItem) {
      if (body.rootId > 0) {
        console.log('para actulizar level');
      } else {
        console.log('para actulizar sector');
      }
    }

    await axiosInstance.post('levels', body);
    onSave?.();
    reset({});
    handleHideForm();
  };
  useEffect(() => {
    const handleClick = () => setAddLevel(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);
  const hadleAddTask = () =>
    (isOpenCardRegisteTask$.setSubject = { isOpen: true, levelId: data.id });

  const typeImgFolder =
    addLevel === 'folder' ? 'add_folder-blue' : 'add_folder';
  const typeImgArea = addLevel === 'area' ? 'add_area-blue' : 'add_area';
  const style = {
    borderLeft: `thick solid ${colors[data.level + 1]}`,
  };
  return (
    <div
      className={`projectAddLevel `}
      style={style}
      onClick={e => e.stopPropagation()}
    >
      <FloatingText text="Agregar Nivel">
        <figure className="projectAddLevel-figure" onClick={hadleAddFolder}>
          <img src={`/svg/${typeImgFolder}.svg`} alt="W3Schools" />
        </figure>
      </FloatingText>

      {!data.isArea && !data.isProject && !data.isInclude && (
        <FloatingText text="Agregar Carpeta de Areas">
          <figure className="projectAddLevel-figure" onClick={hadleAddArea}>
            <img src={`/svg/${typeImgArea}.svg`} alt="W3Schools" />
          </figure>
        </FloatingText>
      )}
      {!data.nextLevel?.length &&
        !data.isArea &&
        !data.isProject &&
        data.level && (
          <FloatingText text="Agregar Tarea">
            <figure className="projectAddLevel-figure" onClick={hadleAddTask}>
              <img src={`/svg/task-list.svg`} alt="W3Schools" />
            </figure>
          </FloatingText>
        )}
      {addLevel && (
        <>
          <form
            onSubmit={handleSubmit(onSubmitData)}
            className="projectAddLevel-form"
          >
            {!data.nextLevel?.length && (
              <>
                <select
                  defaultValue="NUM"
                  {...register('typeItem')}
                  name="typeItem"
                  className="projectAddLevel-selector"
                >
                  <option value="ABC">ABC</option>
                  <option value="ROM">ROM</option>
                  <option value="NUM">NUM</option>
                </select>
                <span className="projectAddLevel-item-info">
                  {data.item}{' '}
                  {watch('typeItem') ? typeNumber[watch('typeItem')] : 1}
                </span>
              </>
            )}

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
              errorPosX={425}
              errorPosY={-23}
            />
            {data.isProject && (
              <DropDownSimple
                data={modedators}
                itemKey="id"
                textField="name"
                type="search"
                name="employees"
                selector
                className="projectAddLevel-employee-list"
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
