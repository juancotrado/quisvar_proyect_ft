import { MouseEvent, useState } from 'react';
import { Option, Stage } from '../../../types/types';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
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
  // handleClickRight: (e:MouseEvent<HTMLDivElement>) => void
}
interface StageName {
  name: string;
}
const StageItem = ({ stage, i }: StageItemProps) => {
  // const navigate = useNavigate();
  const [openEdit, setOpenEdit] = useState(false);
  const { stageId } = useParams();
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

  // const handleStageNavigate = (id: number) => {
  //   navigate(`proyecto/${id}`);
  // };
  const onSubmitData: SubmitHandler<StageName> = async body => {
    console.log(body);

    axiosInstance.patch(`stages/${stageId}`, body).then(() => {
      // onSave?.();
      reset({});
      handleOpenEdit();
    });
  };
  const handleCloseEdit = () => setOpenEdit(false);

  const handleDeleteLevel = () => {
    axiosInstance.delete(`stages/${stage.id}`).then(() => {
      // onSave?.();
      reset({});
      handleOpenEdit();
    });
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
  // console.log(openEdit);
  // const click = () =>  {
  //   if (!openEdit) {

  //     handleStageNavigate(stage.id)
  //   }
  // }
  return (
    <div className="stage-header">
      {i !== 0 && <span className="stage-header-separation">|</span>}
      <div
        className="stage-header-div"
        key={stage.id + 1}
        // onClick={click}
        onContextMenu={handleClickRight}
      >
        <NavLink
          // to={`proyecto/${stage.id}`}
          to={openEdit ? null : `proyecto/${stage.id}`}
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
