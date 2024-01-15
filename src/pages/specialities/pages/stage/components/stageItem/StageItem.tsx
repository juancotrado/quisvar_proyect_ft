import { useState } from 'react';
import { Option, Stage } from '../../../../../../types';
import { NavLink, useNavigate } from 'react-router-dom';
import { DotsRight, Input } from '../../../../../../components';
import {
  validateCorrectTyping,
  validateWhiteSpace,
} from '../../../../../../utils';
import { SubmitHandler, useForm } from 'react-hook-form';
import { axiosInstance } from '../../../../../../services/axiosInstance';
import './StageItem.css';
import { ContextMenuTrigger } from 'rctx-contextmenu';
import { RootState } from '../../../../../../store';
import { useSelector } from 'react-redux';
import { isOpenButtonDelete$ } from '../../../../../../services/sharingSubject';
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
  const { modAuthProject } = useSelector((state: RootState) => state);

  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<StageName>();

  const handleOpenEdit = () => {
    setOpenEdit(!openEdit);
    reset({});
  };

  const onSubmitData: SubmitHandler<StageName> = async body => {
    axiosInstance.patch(`stages/${stage.id}`, body).then(() => getStages());
    setOpenEdit(false);
    reset({});
  };
  const handleDeleteLevel = () => {
    axiosInstance.delete(`stages/${stage.id}`).then(() => {
      reset({});
      getStages();
      navigate('.');
    });
  };
  const handleDuplicate = () => {
    const body = {
      name: stage.name + ' copia',
    };
    axiosInstance
      .post(`/duplicates/stage/${stage.id}`, body)
      .then(() => getStages());
  };
  const handleOpenButtonDelete = () => {
    isOpenButtonDelete$.setSubject = {
      isOpen: true,
      function: () => handleDeleteLevel,
    };
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

      function: handleOpenButtonDelete,
    },
    {
      name: 'Duplicar',
      type: 'button',
      icon: 'document-duplicate',

      function: handleDuplicate,
    },
  ];
  const currentRoute = window.location.href;
  return (
    <div className="stage-header">
      {i !== 0 && <span className="stage-header-separation">|</span>}

      <NavLink to={openEdit ? currentRoute : `etapa/${stage.id}`}>
        {({ isActive }) => (
          <ContextMenuTrigger id={`stage-${stage.id}`}>
            <div
              className="stage-header-div"
              key={stage.id + 1}
              onClick={e => e.stopPropagation()}
            >
              {!openEdit ? (
                <span
                  className={
                    isActive
                      ? ' stage-header-span activeLink'
                      : 'stage-header-span'
                  }
                >
                  {stage.name}
                </span>
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
                  />
                  <div
                    className="stageItem-icon-area"
                    onClick={e => e.stopPropagation()}
                  >
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
                      onClick={handleOpenEdit}
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
            </div>
          </ContextMenuTrigger>
        )}
      </NavLink>

      {modAuthProject && (
        <DotsRight data={options} idContext={`stage-${stage.id}`} />
      )}
    </div>
  );
};

export default StageItem;
