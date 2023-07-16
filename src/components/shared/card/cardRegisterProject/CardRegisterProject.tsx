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
import { spring } from '../../../../animations/animations';
import { motion } from 'framer-motion';
const InitialValues: ProjectForm = {
  id: 0,
  name: '',
  CUI: '',
  description: '',
  typeSpeciality: '0',
  startDate: _date(new Date()),
  untilDate: _date(new Date()),
  status: false,
  userId: 0,
  specialityId: 0,
};

const typeSpecialities = [
  { id: 1, name: 'Represas' },
  { id: 2, name: 'Irrigaciones' },
  { id: 2, name: 'Tipo de especialidad numero 3' },
];

interface CardRegisterProjectProps {
  onSave?: (value: number) => void;
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
  const { handleSubmit, register, setValue, reset } = useForm<ProjectForm>();
  const [isOn, setIsOn] = useState(false);
  const toggleSwitch = () => {
    setIsOn(!isOn);
    setValue('unique', !isOn);
  };

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
    setValue('CUI', dataForm.CUI);
    setValue('name', dataForm.name);
    setValue('description', dataForm.description);
    setValue('typeSpeciality', dataForm.typeSpeciality);
    setValue('location', dataForm.location);
    setValue('userId', dataForm.userId);
    setValue('startDate', _date(new Date(dataForm.startDate)));
    setValue('untilDate', _date(new Date(dataForm.untilDate)));
  }, [dataForm]);

  const onSubmit: SubmitHandler<ProjectForm> = values => {
    const { startDate, untilDate, ..._values } = values;
    const _data = {
      ..._values,
      startDate: new Date(startDate),
      untilDate: new Date(untilDate),
      specialityId,
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
    if (!specialityId) return;
    onSave?.(specialityId);
    setIsOn(false);
    isOpenModal$.setSubject = false;
    reset();
  };

  const closeFunctions = () => {
    setIsOn(false);
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
        <div className="col-input-top">
          <Input
            label="CUI:"
            {...register('CUI')}
            name="CUI"
            required={true}
            placeholder="CUI"
          />
          <Input
            label="Distrito:"
            {...register('location')}
            name="location"
            type="text"
            placeholder="Distrito"
          />
        </div>
        <Input
          label="Nombre Corto:"
          {...register('name')}
          name="name"
          type="text"
          placeholder="Nombre Corto "
        />
        <div className="col-input">
          <Select
            label="Tipo:"
            required={true}
            {...register('typeSpeciality')}
            name="typeSpeciality"
            data={typeSpecialities}
            itemKey="name"
            textField="name"
          />
          <Select
            label="Coordinador:"
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
            label="Fecha Inicio:"
            {...register('startDate')}
            name="startDate"
            type="date"
          />
          <Input
            label="Fecha Limite:"
            {...register('untilDate')}
            name="untilDate"
            type="date"
          />
        </div>
        {!project && (
          <div className="col-unique">
            <span>¿eL proyecto tendrá area única?</span>
            <div
              className="switch-status"
              data-ison={isOn}
              onClick={toggleSwitch}
            >
              <motion.div
                className={`handle-statuts ${isOn && 'handle-on'}`}
                layout
                transition={spring}
              >
                <div>{isOn ? 'si' : 'no'} </div>
              </motion.div>
            </div>
          </div>
        )}
        <TextArea
          label="Nombre Completo del Proyecto:"
          {...register('description')}
          name="description"
          placeholder="Nombre completo del Proyecto"
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
