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
  indexSelected: string;
}
const SidebarLevelList = ({
  data,
  onSave,
  type,
  indexSelected,
}: IndexTaskContainerProps) => {
  const { modAuth } = useSelector((state: RootState) => state);

  const [name, setName] = useState<string>();
  const [unique, setUnique] = useState(data.unique);
  const [errors, setErrors] = useState<{ [key: string]: any }>({});
  const [openEditData, setOpenEditData] = useState<boolean>(false);
  const { handleArchiver } = useArchiver(data.id, type);
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
        isFirstLevel ? 'index-task-section' : 'sidebarLevelList-sub-list-item'
      }`}
    >
      <div className={`sidebarLevelList-section `}>
        {isFirstLevel && (
          <img
            src="/svg/reports.svg"
            alt="reportes"
            className="sidebarLevelList-icon"
          />
        )}
        {openEditData ? (
          <div
            className="sidebarLevelList-edit-area-container"
            onClick={e => e.stopPropagation()}
          >
            <Input
              defaultValue={data.name}
              type="text"
              name="name"
              className="sidebarLevelLists-input"
              onChange={toggleInput}
              errors={errors}
            />
            {type !== 'tasks3' && data.subTasks.length === 0 && (
              <div className="sidebarLevelLists-unique-container">
                <label htmlFor="unique">Unico:</label>
                <input
                  name="unique"
                  type="checkbox"
                  defaultChecked={data.unique}
                  className="sidebarLevelList-checkbox-edit"
                  onChange={toggleInputChecked}
                />
              </div>
            )}
          </div>
        ) : (
          <>
            <span
              className={`sidebarLevelList-sub-list-span  ${
                isFirstLevel && 'not-margin-left'
              }   ${
                type + '-' + data.id === indexSelected &&
                'sidebarLevelList-sub-list-span-active'
              }`}
            >
              {data.item}. {data.name}
            </span>

            <TaskCounter nivelTask={data} />

            {!data.unique && (
              <img
                src="/svg/down.svg"
                className="sidebarLevelList-dropdown-arrow"
              />
            )}
          </>
        )}
        {!openEditData && (
          <input type="checkbox" className="sidebarLevelList-dropdown-check" />
        )}
      </div>
      {modAuth && (
        <div className="sidebarLevelList-menu-index-task">
          <DotsOption
            className="sidebarLevelList-menu-dots-option"
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
