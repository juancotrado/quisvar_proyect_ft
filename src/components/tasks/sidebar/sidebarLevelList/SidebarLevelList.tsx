import { DataTask, TypeTask } from '../../../../types/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { Input } from '../../..';
import { ChangeEvent, useState } from 'react';
import { axiosInstance } from '../../../../services/axiosInstance';
import DotsOption from '../../../shared/dots/DotsOption';

interface IndexTaskContainerProps {
  data: DataTask;
  onSave?: () => void;
  type: TypeTask;
}
const SidebarLevelList = ({ data, onSave, type }: IndexTaskContainerProps) => {
  const { userSession } = useSelector((state: RootState) => state);
  const [name, setName] = useState<string>();
  const [unique, setUnique] = useState(data.unique);
  const [openEditData, setOpenEditData] = useState<boolean>(false);
  const role = userSession?.role ? userSession.role : 'EMPLOYEE';

  const toggleInput = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    setName(value);
  };

  const toggleInputChecked = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { checked } = target;
    setUnique(checked);
  };
  const handleForm = async () => {
    await axiosInstance
      .patch(`/${type}/${data.id}`, { name, unique })
      .then(() => {
        setOpenEditData(false);
        onSave?.();
      });
  };

  const handleDelete = async (id: number) => {
    setOpenEditData(false);
    await axiosInstance.delete(`/${type}/${id}`).then(() => onSave?.());
  };

  const isFirstLevel = type === 'indextask';
  return (
    <div
      className={`${
        isFirstLevel ? 'index-task-section' : 'aside-dropdown-sub-list-item'
      }`}
    >
      <div className={`aside-dropdown-section ${type}`}>
        {isFirstLevel && (
          <img
            src="/svg/reports.svg"
            alt="reportes"
            className="aside-dropdown-icon"
          />
        )}
        {openEditData ? (
          <div
            className="aside-edit-area-container"
            onClick={e => e.stopPropagation()}
          >
            <Input
              defaultValue={data.name}
              type="text"
              className="input-task"
              onChange={toggleInput}
            />
            {type !== 'task3' && (
              <div className="aside-unique-container">
                <label htmlFor="unique">Unico:</label>
                <input
                  name="unique"
                  type="checkbox"
                  defaultChecked={data.unique}
                  className="aside-checkbox-edit"
                  onChange={toggleInputChecked}
                />
              </div>
            )}
          </div>
        ) : (
          <>
            <span
              className={`${
                isFirstLevel
                  ? 'aside-name-index'
                  : 'aside-dropdown-sub-list-span'
              }`}
            >
              {data.item}. {data.name}
            </span>
            {!data.unique && (
              <img src="/svg/down.svg" className="aside-dropdown-arrow" />
            )}
          </>
        )}
        {!openEditData && (
          <input type="checkbox" className="aside-dropdown-check" />
        )}
      </div>
      {role !== 'EMPLOYEE' && (
        <div className="menu-index-task">
          <DotsOption
            data={[
              {
                name: openEditData ? 'Cancelar' : 'Editar',
                type: openEditData ? 'submit' : 'button',
                icon: openEditData ? 'close' : 'pencil',
                function: () => {
                  setOpenEditData(!openEditData);
                },
              },
              {
                name: openEditData ? 'Guardar' : 'Eliminar',
                type: openEditData ? 'submit' : 'button',
                icon: openEditData ? 'save' : 'trash-red',
                function: openEditData
                  ? () => handleForm()
                  : () => handleDelete(data.id),
              },
              {
                name: 'Comprimir',
                type: 'button',
                icon: 'file-zipper',
              },
            ]}
          />
          {/* <Button
            type="button"
            icon={openEditData ? 'close' : 'pencil'}
            className="delete-indextask"
            onClick={() => {
              setOpenEditData(!openEditData);
            }}
          /> */}
          {/* {openEditData ? (
            <Button
              type="button"
              icon="save"
              className="delete-indextask"
              onClick={e => {
                e.stopPropagation();
                handleForm();
              }}
            />
          ) : (
            <>
              {data?.subTasks?.length === 0 && (
                <ButtonDelete
                  type="button"
                  icon="trash-red"
                  className="delete-indextask"
                  url={`/${type}/${data.id}`}
                  onSave={onSave}
                />
              )}
            </>
          )} */}
        </div>
      )}
    </div>
  );
};

export default SidebarLevelList;
