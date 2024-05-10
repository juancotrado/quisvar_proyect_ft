import { useState } from 'react';
import { Option, StageSubtask } from '../../../../../../types';
import { NavLink, useNavigate } from 'react-router-dom';
import { DotsRight, IconAction, Input } from '../../../../../../components';
import {
  validateCorrectTyping,
  validateWhiteSpace,
} from '../../../../../../utils';
import { SubmitHandler, useForm } from 'react-hook-form';
import { axiosInstance } from '../../../../../../services/axiosInstance';
import './StageItem.css';
import { ContextMenuTrigger } from 'rctx-contextmenu';
import { isOpenButtonDelete$ } from '../../../../../../services/sharingSubject';
import { useRole } from '../../../../../../hooks';
interface StageItemProps {
  stage: StageSubtask;
  i: number;
  getStages: () => void;
}
interface StageName {
  name: string;
}
const StageItem = ({ stage, i, getStages }: StageItemProps) => {
  const [openEdit, setOpenEdit] = useState(false);
  const { hasAccess } = useRole('MOD');

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
                      value: stage.name,
                    })}
                    name="name"
                    className="stageItem-input"
                    errors={errors}
                    autoFocus
                  />
                  <div className="stageItem-icon-area">
                    <button style={{ backgroundColor: 'transparent' }}>
                      <IconAction
                        size={1.5}
                        icon="check-blue"
                        position="none"
                        onClick={handleSubmit(onSubmitData)}
                      />
                    </button>
                    <button style={{ backgroundColor: 'transparent' }}>
                      <IconAction
                        size={1.5}
                        icon="cross-red"
                        position="none"
                        onClick={handleOpenEdit}
                      />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </ContextMenuTrigger>
        )}
      </NavLink>

      {hasAccess && (
        <DotsRight data={options} idContext={`stage-${stage.id}`} />
      )}
    </div>
  );
};

export default StageItem;
