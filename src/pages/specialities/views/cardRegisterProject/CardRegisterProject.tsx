import {
  Button,
  CloseIcon,
  Input,
  Modal,
  TextArea,
} from '../../../../components';
import { axiosInstance } from '../../../../services/axiosInstance';
import { isOpenCardRegisteProject$ } from '../../../../services/sharingSubject';
import './CardRegisterProject.css';
import { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Contract, ProjectForm } from '../../../../types';
import { Subscription } from 'rxjs';
import {
  validateWhiteSpace,
  SnackbarUtilities,
  validateCorrectTyping,
} from '../../../../utils';

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
        const { idProject, isDuplicate } = data;
        setIsOpenModal(data.isOpen);
        if (idProject) {
          reset({
            id: idProject,
            isDuplicate,
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
    const { id, contractId, typeSpecialityId, name, isDuplicate } = values;
    const newBody = { contractId, typeSpecialityId, name };
    if (id) {
      if (isDuplicate) {
        axiosInstance
          .post(`/duplicates/project/${id}`, newBody)
          .then(successfulShipment);
      } else {
        axiosInstance.patch(`projects/${id}`, newBody).then(successfulShipment);
      }
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
      const { department, district, province, projectName, id } = firstData;
      reset({
        ...watch(),
        typeSpecialityId: watch('typeSpecialityId'),
        department,
        district,
        province,
        contractId: id,
        description: projectName,
      });
    });
  };
  return (
    <Modal size={50} isOpenProp={isOpenModal}>
      <CloseIcon onClick={closeFunctions} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card-register-project"
        autoComplete="off"
      >
        <h2>
          {watch('isDuplicate') ? 'DUPLICAR PROYECTO' : 'REGISTRAR PROYECTO'}
        </h2>
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
                validate: { validateWhiteSpace, validateCorrectTyping },
              })}
              name="name"
              type="text"
              placeholder="Nombre Corto "
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
          text={`${watch('id') ? 'Duplicar' : 'Registrar'}`}
          styleButton={4}
        />
      </form>
    </Modal>
  );
};

export default CardRegisterProject;
