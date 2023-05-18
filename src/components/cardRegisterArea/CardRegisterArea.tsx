import './CardRegisterArea.css';
import { Input, TextArea } from '..';
import Modal from '../portal/Modal';
import Button from '../shared/button/Button';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { axiosInstance } from '../../services/axiosInstance';
import ButtonDelete from '../shared/button/ButtonDelete';
import { isOpenModal$ } from '../../services/sharingSubject';

interface CardRegisterAreaProps {
  onSave?: () => void;
  dataWorkArea?: WorkArea | null;
}

type WorkArea = {
  id: number;
  name: string;
  description?: string;
};

const InitialValues = {
  id: 0,
  name: '',
  description: '',
};

const CardRegisterArea = ({ dataWorkArea, onSave }: CardRegisterAreaProps) => {
  const [data, setData] = useState<WorkArea>(InitialValues);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (dataWorkArea) {
      setData(dataWorkArea);
    }
  }, [dataWorkArea]);

  const sendForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (dataWorkArea) {
      axiosInstance
        .put(`/workareas/${data.id}`, data)
        .then(successfulShipment)
        .catch(err => console.log(err.message));
    } else {
      axiosInstance
        .post(`/workareas`, data)
        .then(successfulShipment)
        .catch(err => console.log(err.message));
    }
  };

  const handleArea = ({
    target,
  }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = target;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setData({ ...data, [name]: value });
    }, 250);
  };

  const successfulShipment = () => {
    onSave?.();
    setData(InitialValues);
  };

  const closeFunctions = () => {
    isOpenModal$.setSubject = false;
    setData(InitialValues);
  };

  return (
    <Modal size={50}>
      <form onSubmit={sendForm} className="card-register-area">
        <span className="close-icon" onClick={closeFunctions}>
          <img src="/svg/close.svg" alt="pencil" />
        </span>
        <h1>{dataWorkArea ? 'ACTUALIZAR AREA' : 'REGISTRAR AREA'}</h1>
        <div className="col">
          <Input
            defaultValue={data.name}
            label="Nombre"
            placeholder="Nombre"
            name="name"
            required={true}
            onChange={handleArea}
          />
          <TextArea
            defaultValue={data.description}
            label="Descripción"
            name="description"
            onChange={handleArea}
            placeholder="Opcional"
          />
          <div className="btn-contain">
            <Button
              text={dataWorkArea ? 'ACTUALIZAR' : 'CREAR'}
              className="btn-area"
              whileTap={{ scale: 0.9 }}
              type="submit"
            />
            {dataWorkArea && (
              <ButtonDelete
                text={'ELIMINAR'}
                className="btn-area btn-delete"
                whileTap={{ scale: 0.9 }}
                url={`/workareas/${data.id}`}
                type="button"
                onSave={successfulShipment}
              />
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CardRegisterArea;
