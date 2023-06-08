import { IndexTask } from '../../../types/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import Button from '../../shared/button/Button';
import ButtonDelete from '../../shared/button/ButtonDelete';
import { Input } from '../..';
import React, { useState } from 'react';
import { axiosInstance } from '../../../services/axiosInstance';

interface IndexTaskContainerProps {
  indexTask: IndexTask;
  onSave?: () => void;
}

const IndexTaskContainer = ({ indexTask, onSave }: IndexTaskContainerProps) => {
  const { userSession } = useSelector((state: RootState) => state);
  const [name, setName] = useState<string>();
  const [openEditIndexTask, setOpenEditIndexTask] = useState<boolean>(false);
  const role = userSession?.role ? userSession.role : 'EMPLOYEE';

  const toggleInput = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    setName(value);
  };

  const handleForm = async () => {
    await axiosInstance
      .patch(`indextasks/${indexTask.id}`, { name })
      .then(() => {
        setOpenEditIndexTask(false);
        onSave?.();
      });
  };
  return (
    <div className="index-task-section">
      <div className="aside-dropdown-section">
        <img
          src="/svg/reports.svg"
          alt="reportes"
          className="aside-dropdown-icon"
        />
        {openEditIndexTask ? (
          <Input
            defaultValue={indexTask.name}
            type="text"
            className="input-task"
            onChange={e => toggleInput(e)}
          />
        ) : (
          <>
            <span className="aside-name-index">{indexTask.name}</span>
            <img src="/svg/down.svg" className="aside-dropdown-arrow" />
            <input type="checkbox" className="aside-dropdown-check" />
          </>
        )}
      </div>
      {role !== 'EMPLOYEE' && (
        <div className="menu-index-task">
          <Button
            type="button"
            icon={openEditIndexTask ? 'close' : 'pencil'}
            className="delete-indextask"
            onClick={() => {
              setOpenEditIndexTask(!openEditIndexTask);
            }}
          />
          {openEditIndexTask ? (
            <Button
              type="button"
              icon="save"
              className="delete-indextask"
              onClick={e => {
                e.stopPropagation();
                handleForm();
                // setOpenEditIndexTask(!openEditIndexTask);
              }}
            />
          ) : (
            <>
              {indexTask.tasks.length === 0 && (
                <ButtonDelete
                  type="button"
                  icon="trash-red"
                  className="delete-indextask"
                  url={`/indextasks/${indexTask.id}`}
                  onSave={onSave}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default IndexTaskContainer;
