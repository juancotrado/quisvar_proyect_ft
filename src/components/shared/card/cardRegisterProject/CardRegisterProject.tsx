import { Input, Select, TextArea } from '../../..';
import useInfoData from '../../../../hooks/useInfoData';
import { axiosInstance } from '../../../../services/axiosInstance';
import { isOpenModal$ } from '../../../../services/sharingSubject';
import { _date, getValueByType } from '../../../../utils/formatDate';
import Modal from '../../../portal/Modal';
import Button from '../../button/Button';
import './CardRegisterProject.css';
import { useEffect, useRef, useState } from 'react';

export interface ProjectForm {
  id?: number;
  name?: string;
  description?: string;
  startDate: Date;
  untilDate: Date;
  price: number;
  status: boolean;
  workAreaId?: number;
  userId?: number;
}

const InitialValues: ProjectForm = {
  id: 0,
  name: '',
  description: '',
  startDate: new Date(),
  untilDate: new Date(),
  price: 0,
  status: false,
  workAreaId: 0,
  userId: 0,
};

interface CardRegisterProjectProps {
  onSave?: () => void;
  dataProject?: ProjectForm | null;
  areaId: string;
}

const CardRegisterProject = ({
  dataProject,
  areaId,
  onSave,
}: CardRegisterProjectProps) => {
  const [data, setData] = useState<ProjectForm>(InitialValues);
  const { areas, users } = useInfoData();
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (dataProject) {
      setData(dataProject);
    }
  }, [dataProject]);

  const sendForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (dataProject) {
      axiosInstance.put(`/projects/${data.id}`, data).then(successfulShipment);
    } else {
      axiosInstance
        .post(`/projects`, { ...data, workAreaId: parseInt(areaId) })
        .then(successfulShipment);
    }
  };

  const handleProject = ({
    target,
  }: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >) => {
    const { name, value, type } = target;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const _value = getValueByType(value, type);
    debounceRef.current = setTimeout(() => {
      setData({
        ...data,
        [name]: _value,
      });
    }, 250);
  };

  const successfulShipment = () => {
    onSave?.();
    setData(InitialValues);
    isOpenModal$.setSubject = false;
  };

  const closeFunctions = () => {
    isOpenModal$.setSubject = false;
    setData(InitialValues);
  };

  return (
    <Modal size={50}>
      <form onSubmit={sendForm} className="card-register-project">
        <span className="close-icon-project" onClick={closeFunctions}>
          <img src="/svg/close.svg" alt="pencil" />
        </span>
        <h2>{dataProject ? 'ACTUALIZAR PROYECTO' : 'REGISTRAR PROYECTO'}</h2>
        <Input
          defaultValue={data.name}
          label="Nombre del Proyeto"
          name="name"
          required={true}
          placeholder="Nombre"
          onChange={handleProject}
        />
        <Select
          defaultValue={`${data.userId}`}
          required={true}
          label="Coordinador"
          name="userId"
          data={users}
          itemKey="id"
          textField="name"
          onChange={handleProject}
        />
        <div className="col-input">
          <Select
            label="Area de trabajo"
            data={areas}
            name="workareaId"
            defaultValue={areaId}
            itemKey="id"
            textField="name"
            onChange={handleProject}
          />
          <Input
            label="Precio"
            required={true}
            type="number"
            step={0.0001}
            defaultValue={data.price}
            name="price"
            onChange={handleProject}
          />
        </div>
        <div className="col-input">
          <Input
            label="Fecha Inicio"
            name="startDate"
            required={true}
            type="date"
            defaultValue={_date(data.startDate)}
            onChange={handleProject}
          />
          <Input
            label="Fecha Limite"
            type="date"
            required={true}
            name="untilDate"
            defaultValue={_date(data.untilDate)}
            onChange={handleProject}
          />
        </div>
        <TextArea
          defaultValue={data.description}
          label="Descripción"
          name="description"
          placeholder="Opcional"
          onChange={handleProject}
        />
        <div className="btn-build">
          <Button
            text={dataProject ? 'ACTUALIZAR' : 'REGISTRAR'}
            className="btn-area"
            whileTap={{ scale: 0.9 }}
            type="submit"
          />
        </div>
      </form>
    </Modal>
  );
};

export default CardRegisterProject;
