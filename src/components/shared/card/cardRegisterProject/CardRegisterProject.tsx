import { Input, TextArea } from '../../..';
import { axiosInstance } from '../../../../services/axiosInstance';
import { isOpenCardRegisteProject$ } from '../../../../services/sharingSubject';
import Modal from '../../../portal/Modal';
import Button from '../../button/Button';
import './CardRegisterProject.css';
import { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Contract, ProjectForm } from '../../../../types/types';

import { Subscription } from 'rxjs';
import { validateWhiteSpace } from '../../../../utils/customValidatesForm';
import { SnackbarUtilities } from '../../../../utils/SnackbarManager';

interface CardRegisterProjectProps {
  onSave?: () => void;
}

const CardRegisterProject = ({ onSave }: CardRegisterProjectProps) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const {
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProjectForm>();

  const handleIsOpen = useRef<Subscription>(new Subscription());

  useEffect(() => {
    handleIsOpen.current = isOpenCardRegisteProject$.getSubject.subscribe(
      data => {
        const { project } = data;
        setIsOpenModal(data.isOpen);

        if (project) {
          reset({
            CUI: project.CUI,
            name: project.name,
            description: project.description,
            department: project.department,
            province: project.province,
            district: project.district,
            id: project.id,
          });
        } else {
          reset({
            typeSpecialityId: data.typeSpecialityId,
          });
        }
      }
    );
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, [reset]);

  const onSubmit: SubmitHandler<ProjectForm> = values => {
    const { id, contractId, typeSpecialityId, name } = values;
    const newBody = { contractId, typeSpecialityId, name };
    if (id) {
      axiosInstance.patch(`projects/${id}`, newBody).then(successfulShipment);
    } else {
      axiosInstance.post('projects', newBody).then(successfulShipment);
    }
  };

  const successfulShipment = () => {
    onSave?.();
    setIsOpenModal(false);
    reset();
  };

  const closeFunctions = () => {
    reset({});
    setIsOpenModal(false);
  };

  const handleSearchCui = () => {
    const cui = watch('CUI');
    if (!cui) return SnackbarUtilities.warning('Campo vacio!!');
    axiosInstance.get(`contract?cui=${cui}`).then(res => {
      const [firstData] = res.data as Contract[];
      const { department, district, province, projectName, shortName, id } =
        firstData;
      reset({
        typeSpecialityId: watch('typeSpecialityId'),
        department,
        district,
        province,
        contractId: id,
        description: projectName,
        name: shortName,
      });
    });
  };
  return (
    <Modal size={50} isOpenProp={isOpenModal}>
      <span className="close-add-card" onClick={closeFunctions}>
        <img src="/svg/close.svg" alt="close" />
      </span>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card-register-project"
        autoComplete="off"
      >
        <h2>{watch('id') ? 'ACTUALIZAR PROYECTO' : 'REGISTRAR PROYECTO'}</h2>
        <hr />
        <div className="card-register-project-container-details">
          <div className="col-input-top">
            <div className="edit-this">
              <Input
                isRelative
                label="CUI:"
                {...register('CUI', {
                  validate: { validateWhiteSpace },
                })}
                name="CUI"
                placeholder="CUI"
                errors={errors}
                handleSearch={handleSearchCui}
              />
            </div>
            <Input
              isRelative
              label="Nombre Corto:"
              {...register('name', {
                validate: { validateWhiteSpace },
              })}
              name="name"
              type="text"
              placeholder="Nombre Corto "
              disabled
              errors={errors}
            />
          </div>
          <TextArea
            label="Nombre Completo del Proyecto:"
            {...register('description', {
              validate: { validateWhiteSpace },
            })}
            isRelative
            name="description"
            disabled
            placeholder="Nombre completo del Proyecto"
            errors={errors}
          />

          <div className="col-input">
            <Input
              isRelative
              label="Departamento:"
              {...register('department', {
                validate: { validateWhiteSpace },
              })}
              disabled
              name="department"
              errors={errors}
            />
            <Input
              isRelative
              label="Provincia:"
              {...register('province', {
                validate: { validateWhiteSpace },
              })}
              disabled
              name="province"
              errors={errors}
            />
            <Input
              isRelative
              label="Distrito:"
              {...register('district', {
                validate: { validateWhiteSpace },
              })}
              disabled
              name="district"
              errors={errors}
            />
          </div>
        </div>

        <Button
          type="submit"
          text={`${watch('id') ? 'Actualizar' : 'Registrar'}`}
          className="send-button"
        />
      </form>
    </Modal>
  );
};

export default CardRegisterProject;
