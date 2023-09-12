import { MouseEvent, useState } from 'react';
import { Level } from '../../../types/types';
import './projectLevel.css';
import { Input } from '../..';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  validateCorrectTyping,
  validateWhiteSpace,
} from '../../../utils/customValidatesForm';
import DotsOption, { Option } from '../../shared/dots/DotsOption';
import { axiosInstance } from '../../../services/axiosInstance';
import MoreInfo from '../moreInfo/MoreInfo';
interface ProjectLevelProps {
  data: Level;
  onSave?: () => void;
}
interface DataForm {
  name: string;
}
const ProjectLevel = ({ data, onSave }: ProjectLevelProps) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<DataForm>();
  const [openEdit, setOpenEdit] = useState(false);
  const handleCloseEdit = () => setOpenEdit(false);
  const [isClickRight, setIsClickRight] = useState(false);
  const handleOpenEdit = () => {
    setOpenEdit(!openEdit);
    setIsClickRight(false);
  };

  const handleClickRigth = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsClickRight(!isClickRight);
  };
  const onSubmitData: SubmitHandler<DataForm> = async body => {
    axiosInstance.put(`levels/${data.id}`, body).then(() => {
      onSave?.();
      reset({});
      handleOpenEdit();
    });
  };
  const handleDeleteLevel = () => {
    axiosInstance.delete(`levels/${data.id}`).then(() => {
      onSave?.();
      reset({});
      handleOpenEdit();
    });
  };
  const { details } = data;
  const options: Option[] = [
    {
      name: openEdit ? 'Cancelar' : 'Editar',
      type: openEdit ? 'submit' : 'button',
      icon: openEdit ? 'close' : 'pencil',
      function: handleOpenEdit,
    },

    {
      name: openEdit ? 'Guardar' : 'Eliminar',
      type: openEdit ? 'submit' : 'button',
      icon: openEdit ? 'save' : 'trash-red',

      function: openEdit ? () => handleSubmit(onSubmitData) : handleDeleteLevel,
    },
  ];
  return (
    <div className={`projectLevel-sub-list-item`}>
      <DotsOption
        className="projectLevel-menu-dots-option"
        notPositionRelative
        iconHide
        isClickRight={isClickRight}
        data={options}
      />
      <div className={`projectLevel-section `} onContextMenu={handleClickRigth}>
        <img src="/svg/down.svg" className="projectLevel-dropdown-arrow" />
        <input
          type="checkbox"
          className="projectLevel-dropdown-check"
          defaultChecked={false}
        />
        <div className="projectLevel-contain">
          <div className="projectLevel-name-contain">
            {openEdit ? (
              <form
                onSubmit={handleSubmit(onSubmitData)}
                className="projectLevel-form"
              >
                <Input
                  {...register('name', {
                    validate: { validateWhiteSpace, validateCorrectTyping },
                  })}
                  name="name"
                  placeholder={`Editar nombre del nivel`}
                  className="projectLevel-input"
                  errors={errors}
                />
                <figure
                  className="projectLevel-figure"
                  onClick={handleCloseEdit}
                >
                  <img src="/svg/icon_close.svg" alt="W3Schools" />
                </figure>
              </form>
            ) : (
              <h4 className={`projectLevel-sub-list-name`}>
                <span className="projectLevel-sub-list-span">{data.item} </span>{' '}
                {data.name}
              </h4>
            )}
          </div>
          <div className="projectLevel-contain-right">
            <MoreInfo data={data} />
            {/* <div className="projectLevel-currency-contain">
              <div className="projectLevel-currency">
                <span className="projecLevel-currency-money">
                  S/.{data.price}
                </span>
                <span className="projecLevel-currency-info">Saldo</span>
              </div>
              <div className="projectLevel-currency">
                <span className="projecLevel-currency-money money--red">
                  -/S.{data.price}
                </span>
                <span className="projecLevel-currency-info">Saldo</span>
              </div>
              <div className="projectLevel-currency">
                <span className="projecLevel-currency-money">
                  S/.{data.price}
                </span>
                <span className="projecLevel-currency-info">Saldo</span>
              </div>
            </div>
            <div className="projectLevel-details-contain">
              <div className="projectLevel-detail">
                <div className="projectLevel-detail-circle color-unresolver">
                  <span className="projectLevel-detail-circle-text">
                    {details.UNRESOLVED}
                  </span>
                </div>
                <span className="projectLevel-detail-info">
                  Sin <br />
                  Asignar
                </span>
              </div>
              <div className="projectLevel-detail">
                <div className="projectLevel-detail-circle color-pending ">
                  <span className="projectLevel-detail-circle-text">
                    {details.PROCESS}
                  </span>
                </div>
                <span className="projectLevel-detail-info">Asignado</span>
              </div>
              <div className="projectLevel-detail">
                <div className="projectLevel-detail-circle color-process">
                  <span className="projectLevel-detail-circle-text">
                    {details.INREVIEW}
                  </span>
                </div>
                <span className="projectLevel-detail-info">
                  En <br /> revision
                </span>
              </div>
              <div className="projectLevel-detail">
                <div className="projectLevel-detail-circle color-correct">
                  <span className="projectLevel-detail-circle-text">
                    {details.DENIED}
                  </span>
                </div>
                <span className="projectLevel-detail-info">
                  En <br /> Correción
                </span>
              </div>
              <div className="projectLevel-detail">
                <div className="projectLevel-detail-circle color-done">
                  <span className="projectLevel-detail-circle-text">
                    {details.DONE}
                  </span>
                </div>
                <span className="projectLevel-detail-info">Hechos</span>
              </div>
              <div className="projectLevel-detail">
                <div className="projectLevel-detail-circle color-liquidation">
                  <span className="projectLevel-detail-circle-text">
                    {details.LIQUIDATION}
                  </span>
                </div>
                <span className="projectLevel-detail-info">Liquidados</span>
              </div>
            </div>
            <div className="projectLevel-details-contain">
              <div className="projectLevel-detail">
                <figure className="projectLevel-detail-icon">
                  <img src="/svg/file-download.svg" alt="W3Schools" />
                </figure>
                <span className="projectLevel-detail-info">Comprimir</span>
              </div>
              <div className="projectLevel-detail">
                <figure className="projectLevel-detail-icon">
                  <img src="/svg/file-download.svg" alt="W3Schools" />
                </figure>
                <span className="projectLevel-detail-info">
                  Comprimir <br /> PDS
                </span>
              </div>
              <div className="projectLevel-detail">
                <figure className="projectLevel-detail-icon">
                  <img src="/svg/file-download.svg" alt="W3Schools" />
                </figure>
                <span className="projectLevel-detail-info">
                  Comprimir <br /> Editables
                </span>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectLevel;
