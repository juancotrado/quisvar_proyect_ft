import { useEffect, useState, MouseEvent } from 'react';
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';
import { axiosInstance } from '../../services/axiosInstance';
import './stage.css';
import { Option, ProjectType } from '../../types/types';
import Button from '../../components/shared/button/Button';
import { Input, StageAddButton, StageItem } from '../../components';
import { SubmitHandler, useForm } from 'react-hook-form';
import DotsOption from '../../components/shared/dots/DotsOption';
import {
  validateCorrectTyping,
  validateWhiteSpace,
} from '../../utils/customValidatesForm';

interface Stages {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  projectId: number;
}

const Stage = () => {
  const { stageId } = useParams();
  const handleBtnActive = () => {
    setBtnActive(!btnActive);
  };
  const [project, setProject] = useState<ProjectType | null>(null);
  const [btnActive, setBtnActive] = useState<boolean>(false);
  useEffect(() => {
    getStages();
  }, [stageId]);
  const getStages = () => {
    axiosInstance.get(`/projects/${stageId}`).then(res => setProject(res.data));
  };

  return (
    <div className="stage">
      <div className="stage-header">
        {project?.stages?.map((stage, i) => (
          <StageItem stage={stage} i={i} />
          // <div key={stage.id}>
          //   {i !== 0 && <span className="stage-header-separation">|</span>}
          //   <div
          //     className="stage-header-div"
          //     key={stage.id + 1}
          //     onClick={() => handleStageNavigate(stage.id)}
          //     onContextMenu={handleClickRight}
          //   >
          //     <NavLink
          //       to={`proyecto/${stage.id}`}
          //       className={({ isActive }) =>
          //         isActive ? 'stage-header-span  active' : 'stage-header-span'
          //       }
          //     >
          //       {!openEdit ? (
          //         stage.name
          //       ) : (
          //         <form
          //           onSubmit={handleSubmit(onSubmitData)}
          //           // className="projectLevel-form"
          //         >
          //           <Input
          //             {...register('name', {
          //               validate: { validateWhiteSpace, validateCorrectTyping },
          //             })}
          //             name="name"
          //             placeholder={`Editar nombre del nivel`}
          //             // className="stage-header-add-btn stage-add-btn-limit"
          //             errors={errors}
          //           />
          //           <figure
          //             className="projectLevel-figure"
          //             onClick={handleCloseEdit}
          //           >
          //             <img src="/svg/icon_close.svg" alt="W3Schools" />
          //           </figure>
          //         </form>
          //       )}
          //     </NavLink>
          //     <DotsOption
          //       data={options}
          //       // notPositionRelative
          //       iconHide
          //       isClickRight={isClickRight}
          //     />
          //   </div>
          // </div>
        ))}

        {!btnActive ? (
          <Button
            icon="add"
            className="stage-header-add-btn"
            onClick={handleBtnActive}
          />
        ) : (
          <StageAddButton
            stageId={stageId}
            getStages={getStages}
            setBtnActive={handleBtnActive}
          />
        )}
      </div>
      <div className="stage-title-contain">
        <figure className="stage-figure">
          <img src="/svg/polygon.svg" alt="W3Schools" />
        </figure>
        <h4 className="stage-title">{project?.name}</h4>
      </div>
      <div className="stage-title-levels">
        <Outlet />
      </div>
    </div>
  );
};

export default Stage;
