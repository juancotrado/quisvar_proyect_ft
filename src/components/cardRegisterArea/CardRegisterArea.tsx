import './CardRegisterArea.css';
import { Input, TextArea } from '..';
import Modal from '../portal/Modal';
import Button from '../shared/button/Button';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { axiosInstance } from '../../services/axiosInstance';

interface CardRegisterAreaProps {
  isOpen: boolean;
  onChangeStatus: () => void;
  dataWorkArea?: WorkArea;
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

const CardRegisterArea = ({
  isOpen,
  onChangeStatus,
  dataWorkArea,
}: CardRegisterAreaProps) => {
  const [data, setData] = useState<WorkArea>(InitialValues);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isOpen && dataWorkArea) {
      setData(dataWorkArea);
    }
  }, [isOpen, dataWorkArea]);

  const sendForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (dataWorkArea) {
      console.log('put');
    } else {
      console.log('post');
      // axiosInstance
      //   .post('/workareas', data)
      //   .then(() => {
      //     onChangeStatus();
      //     setData(InitialValues);
      //   })
      //   .catch(err => console.log(err.message));
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

  return (
    <Modal
      isOpen={isOpen}
      onChangeStatus={() => {
        onChangeStatus();
        setData(InitialValues);
      }}
      size={50}
    >
      <form onSubmit={sendForm} className="card-register-area">
        <h1>REGISTRAR AREA</h1>
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
          <Button
            text="CREAR"
            className="btn-area"
            whileTap={{ scale: 0.9 }}
            type="submit"
          />
        </div>
      </form>
    </Modal>
  );
};

export default CardRegisterArea;
