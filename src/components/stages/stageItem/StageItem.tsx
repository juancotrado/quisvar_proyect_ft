import { MouseEvent, useState } from 'react';
import { Option, Stage } from '../../../types/types';
import { NavLink, useParams } from 'react-router-dom';
import { Input } from '../..';
import {
  validateCorrectTyping,
  validateWhiteSpace,
} from '../../../utils/customValidatesForm';
import DotsOption from '../../shared/dots/DotsOption';
import { SubmitHandler, useForm } from 'react-hook-form';
import { axiosInstance } from '../../../services/axiosInstance';
import './StageItem.css';
interface StageItemProps {
  stage: Stage;
  i: number;
  getStages: () => void;
}
interface StageName {
  name: string;
}
const StageItem = ({ stage, i, getStages }: StageItemProps) => {
  const [openEdit, setOpenEdit] = useState(false);
  const { id } = useParams();
  const [isClickRight, setIsClickRight] = useState(false);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<StageName>();
  const handleOpenEdit = () => {
    setOpenEdit(!openEdit);
    setIsClickRight(false);
  };

  const handleClickRight = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsClickRight(!isClickRight);
  };

  const onSubmitData: SubmitHandler<StageName> = async body => {
    console.log(stage.id, body);

    axiosInstance.patch(`stages/${stage.id}`, body).then(() => getStages());
    setOpenEdit(false);
    reset({});
  };
  const handleDeleteLevel = () => {
    console.log(stage.id);

    axiosInstance.delete(`stages/${stage.id}`).then(() => getStages());

    reset({});
  };
  const options: Option[] = [
    {
      name: 'Editar',
      type: 'button',
      icon: 'pencil',
      function: handleOpenEdit,
    },

    {
      name: 'Eliminar',
      type: 'button',
      icon: 'trash-red',

      function: handleDeleteLevel,
    },
  ];
  return (
    <div className="stage-header">
      {i !== 0 && <span className="stage-header-separation">|</span>}
      <div
        className="stage-header-div"
        key={stage.id + 1}
        onContextMenu={handleClickRight}
      >
        <NavLink
          //to={`proyecto/${stage.id}`}
          to={openEdit ? `proyecto/${id}` : `proyecto/${stage.id}`}
          className={({ isActive }) =>
            isActive ? 'stage-header-span  active' : 'stage-header-span'
          }
        >
          {!openEdit ? (
            stage.name
          ) : (
            <form
              onSubmit={handleSubmit(onSubmitData)}
              className="projectLevel-form"
            >
              <Input
                {...register('name', {
                  validate: { validateWhiteSpace, validateCorrectTyping },
                })}
                name="name"
                placeholder={stage.name}
                className="stageItem-input stage-add-input"
                errors={errors}
                onClick={e => e.stopPropagation()}
              />
              <div className="stageItem-icon-area">
                <button
                  className="stage-icon-action"
                  onClick={handleSubmit(onSubmitData)}
                >
                  <img
                    src="/svg/check-blue.svg"
                    style={{ width: '20px', height: '20px' }}
                  />
                </button>
                <button
                  onClick={() => {
                    handleOpenEdit();
                    reset();
                  }}
                  className="stage-icon-action"
                >
                  <img
                    src="/svg/cross-red.svg"
                    style={{ width: '20px', height: '20px' }}
                  />
                </button>
              </div>
            </form>
          )}
        </NavLink>
        <DotsOption
          data={options}
          // notPositionRelative
          iconHide
          isClickRight={isClickRight}
        />
      </div>
    </div>
  );
};

export default StageItem;
