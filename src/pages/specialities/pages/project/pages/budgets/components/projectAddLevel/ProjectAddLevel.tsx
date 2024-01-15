import { useEffect, useState } from 'react';
import './projectAddLevel.css';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  DropDownSimple,
  FloatingText,
  Input,
} from '../../../../../../../../components';
import {
  validateCorrectTyping,
  validateWhiteSpace,
} from '../../../../../../../../utils/customValidatesForm';
import { axiosInstance } from '../../../../../../../../services/axiosInstance';
import { Level } from '../../../../../../../../types';
import { isOpenCardRegisteTask$ } from '../../../../../../../../services/sharingSubject';
import { useListUsers } from '../../../../../../../../hooks';
import colors from '../../../../../../../../utils/json/colors.json';
import { SnackbarUtilities } from '../../../../../../../../utils';

interface DataForm {
  rootId: number;
  stagesId?: number;
  name: string;
  isProject: boolean;
  isArea: boolean;
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
export const ProjectAddLevel = ({ data, onSave }: ProjectAddLevelProps) => {
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
  const handleHideForm = () => {
    reset({});
    setAddLevel(null);
    setIdCoordinator(null);
  };

  const onSubmitData: SubmitHandler<DataForm> = async body => {
    if (!idCoordinator && data.isProject && data.nextLevel?.length !== 0)
      return SnackbarUtilities.warning(
        'Asegurese de elegir un coordinador antes.'
      );
    const { id, stagesId, rootTypeItem } = data;
    body = { ...body, rootId: firstLevel ? 0 : id, stagesId: +stagesId };
    if (
      addLevel === 'area' ||
      (data.isProject && data.nextLevel?.length !== 0)
    ) {
      body = { ...body, isArea: true };
    }
    if ((data.isProject || addLevel === 'area') && idCoordinator) {
      body = { ...body, userId: idCoordinator };
    }
    if (body.typeItem) {
      let isArea = addLevel === 'area';
      if (body.rootId > 0) {
        await axiosInstance.patch(
          `levels/${id}?item=${body.typeItem}&isArea=${isArea}&type=LEVEL`
        );
      } else {
        await axiosInstance.patch(
          `levels/${stagesId}?item=${body.typeItem}&isArea=${isArea}&type=STAGE`
        );
      }
    } else {
      body = { ...body, typeItem: rootTypeItem };
    }
    await axiosInstance.post('levels', body);
    onSave?.();
    handleHideForm();
  };
  useEffect(() => {
    const handleClick = () => handleHideForm();
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

  const errorPosX = data.isProject ? 650 : 425;
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

      {!data.nextLevel?.length && !data.isInclude && !data.isArea && (
        <FloatingText text="Agregar Carpeta de Areas">
          <figure className="projectAddLevel-figure" onClick={hadleAddArea}>
            <img src={`/svg/${typeImgArea}.svg`} alt="W3Schools" />
          </figure>
        </FloatingText>
      )}
      {!data.nextLevel?.length && !data.isProject && data.level && (
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
                  {data.item}
                  <span className="projectAddLevel-item-info-type">
                    {watch('typeItem') ? typeNumber[watch('typeItem')] : 1}
                  </span>
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
              errorPosX={errorPosX}
              errorPosY={-23}
            />
            {((data.isProject && data.nextLevel?.length !== 0) ||
              addLevel === 'area') && (
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
