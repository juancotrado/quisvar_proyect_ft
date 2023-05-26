/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from 'react-redux';
import { Input, Select, TextArea } from '../../..';
import { axiosInstance } from '../../../../services/axiosInstance';
import { isOpenModal$ } from '../../../../services/sharingSubject';
import { _date } from '../../../../utils/formatDate';
import Modal from '../../../portal/Modal';
import Button from '../../button/Button';
import './CardRegisterProject.css';
import { useEffect, useMemo, useState } from 'react';
import { RootState } from '../../../../store';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ProjectForm } from '../../../../types/types';

const InitialValues: ProjectForm = {
  id: 0,
  name: '',
  description: '',
  typeSpeciality: '',
  startDate: _date(new Date()),
  untilDate: _date(new Date()),
  status: false,
  userId: 0,
};

interface CardRegisterProjectProps {
  onSave?: () => void;
  project?: ProjectForm | null;
  specialityId?: number;
}

const CardRegisterProject = ({
  project,
  onSave,
  specialityId,
}: CardRegisterProjectProps) => {
  const [dataForm, setDataForm] = useState<ProjectForm>(InitialValues);
  const { listUsers } = useSelector((state: RootState) => state);
  const { handleSubmit, register, setValue } = useForm<ProjectForm>();
  const coordinators = useMemo(
    () =>
      listUsers
        ? listUsers
            .map(({ profile, ...props }) => ({
              name: `${profile.firstName} ${profile.lastName}`,
              ...props,
            }))
            .filter(({ role }) => role !== 'EMPLOYEE')
        : [],
    [listUsers]
  );

  useEffect(() => {
    if (project) {
      setDataForm(project);
    } else {
      setDataForm(InitialValues);
    }
  }, [project]);

  useEffect(() => {
    setValue('name', dataForm.name);
    setValue('description', dataForm.description);
    setValue('typeSpeciality', dataForm.typeSpeciality);
    setValue('userId', dataForm.userId);
    setValue('startDate', _date(new Date(dataForm.startDate)));
    setValue('untilDate', _date(new Date(dataForm.untilDate)));
  }, [dataForm]);

  const onSubmit: SubmitHandler<ProjectForm> = values => {
    const { startDate, untilDate, ...moreValues } = values;
    const _data = {
      startDate: new Date(startDate),
      untilDate: new Date(untilDate),
      specialityId,
      ...moreValues,
    };
    if (dataForm.id) {
      axiosInstance
        .put(`projects/${dataForm.id}`, _data)
        .then(successfulShipment);
    } else {
      axiosInstance.post('projects', _data).then(successfulShipment);
    }
  };

  const successfulShipment = () => {
    onSave?.();
    isOpenModal$.setSubject = false;
  };

  const closeFunctions = () => {
    isOpenModal$.setSubject = false;
  };

  return (
    <Modal size={45}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card-register-project"
        autoComplete="off"
      >
        <span className="close-add-card" onClick={closeFunctions}>
          <img src="/svg/close.svg" alt="pencil" />
        </span>
        <h2>{project ? 'ACTUALIZAR PROYECTO' : 'REGISTRAR PROYECTO'}</h2>
        <hr></hr>
        <Input
          label="Nombre del Proyeto"
          {...register('name')}
          name="name"
          required={true}
          placeholder="Nombre"
        />
        <div className="col-input">
          <Input
            label="Tipo"
            {...register('typeSpeciality')}
            name="typeSpeciality"
            required={true}
            placeholder="Especialidad"
          />
          <Select
            label="Coordinador"
            required={true}
            {...register('userId', { valueAsNumber: true })}
            name="userId"
            data={coordinators}
            itemKey="id"
            textField="name"
          />
        </div>
        <div className="col-input">
          <Input
            label="Fecha Inicio"
            {...register('startDate')}
            name="startDate"
            type="date"
          />
          <Input
            label="Fecha Limite"
            {...register('untilDate')}
            name="untilDate"
            type="date"
          />
        </div>
        <TextArea
          label="Descripción"
          {...register('description')}
          name="description"
          placeholder="Opcional"
        />
        <Button
          type="submit"
          text={`${project ? 'Actualizar' : 'Registrar'}`}
          className="send-button"
        />
      </form>
    </Modal>
  );
};

export default CardRegisterProject;
