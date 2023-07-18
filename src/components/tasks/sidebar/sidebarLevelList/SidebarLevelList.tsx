/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DataTask, IndexTask, Task, Task2 } from '../../../../types/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { Input, TaskCounter } from '../../..';
import { ChangeEvent, useState } from 'react';
import { axiosInstance } from '../../../../services/axiosInstance';
import DotsOption from '../../../shared/dots/DotsOption';
import useArchiver from '../../../../hooks/useArchiver';
import './sidebarLevelList.css';
type NewTypeTask = 'tasks' | 'indextasks' | 'tasks2' | 'tasks3';
interface IndexTaskContainerProps {
  data: IndexTask | Task | Task2 | DataTask;
  onSave?: () => void;
  type: NewTypeTask;
}
const SidebarLevelList = ({ data, onSave, type }: IndexTaskContainerProps) => {
  const { userSession } = useSelector((state: RootState) => state);
  const [name, setName] = useState<string>();
  const [unique, setUnique] = useState(data.unique);
  const [errors, setErrors] = useState<{ [key: string]: any }>({});
  const [openEditData, setOpenEditData] = useState<boolean>(false);
  const { handleArchiver } = useArchiver(data.id, type);
  const role = userSession?.role ? userSession.role : 'EMPLOYEE';
  const toggleInput = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    const regex = /^[^/?@|<>":'\\]+$/;
    if (!regex.test(value))
      setErrors({
        name: {
          message: 'Ingresar nombre que no contenga lo siguiente ^/?@|<>": ',
        },
      });
    else {
      setName(value);
      setErrors({ value: '' });
    }
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

  const handleDuplicate = async (id: number) => {
    setOpenEditData(false);
    await axiosInstance
      .post(`/duplicates/${type}/${id}`)
      .then(() => onSave?.());
  };
  const handleDelete = async (id: number) => {
    setOpenEditData(false);
    await axiosInstance.delete(`/${type}/${id}`).then(() => onSave?.());
  };

  const isFirstLevel = type === 'indextasks';
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
              name="name"
              className="input-task"
              onChange={toggleInput}
              errors={errors}
            />
            {type !== 'tasks3' && data.subTasks.length === 0 && (
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

            <TaskCounter nivelTask={data} />

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
        <div className="aside-menu-index-task">
          <DotsOption
            className="aside-menu-dots-option"
            notPositionRelative
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
                name: 'Comprimir',
                type: 'button',
                icon: 'file-zipper',
                function: handleArchiver,
              },
              {
                name: 'Duplicar',
                type: 'button',
                icon: 'duplicate',
                function: () => handleDuplicate(data.id),
              },
              {
                name: openEditData ? 'Guardar' : 'Eliminar',
                type: openEditData ? 'submit' : 'button',
                icon: openEditData ? 'save' : 'trash-red',
                function: openEditData
                  ? () => handleForm()
                  : () => handleDelete(data.id),
              },
            ]}
          />
        </div>
      )}
    </div>
  );
};

export default SidebarLevelList;
