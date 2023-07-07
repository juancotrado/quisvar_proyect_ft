import { DataTask, TypeTask } from '../../../../types/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { Input } from '../../..';
import React, { useState } from 'react';
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
  const [openEditData, setOpenEditData] = useState<boolean>(false);
  const role = userSession?.role ? userSession.role : 'EMPLOYEE';

  const toggleInput = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    setName(value);
  };

  const handleForm = async () => {
    await axiosInstance.patch(`/${type}/${data.id}`, { name }).then(() => {
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
          <Input
            defaultValue={data.name}
            type="text"
            className="input-task"
            onChange={toggleInput}
          />
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
            <input type="checkbox" className="aside-dropdown-check" />
          </>
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
