import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import Modal from '../../portal/Modal';
import Button from '../../shared/button/Button';
import { isOpenModal$ } from '../../../services/sharingSubject';
import { Input, TextArea } from '../..';
import { useParams } from 'react-router-dom';
import { TaskCreateType } from '../../../types/types';

interface ModalFormTaskProps {
  createTask: (value: TaskCreateType) => void;
}

const ModalFormTask = ({ createTask }: ModalFormTaskProps) => {
  const debounceRef = useRef<NodeJS.Timeout>();
  const { id } = useParams();

  const [taskForm, setTaskForm] = useState({
    project_id: Number(id),
    name: '',
    description: '',
  });

  const closeModal = () => (isOpenModal$.setSubject = false);

  const handleArea = ({
    target,
  }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = target;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setTaskForm({ ...taskForm, [name]: value.trim() });
    }, 250);
  };

  const sendForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createTask(taskForm);
    isOpenModal$.setSubject = false;
  };

  return (
    <Modal size={50}>
      <form onSubmit={sendForm} className="card-register-area">
        <span className="close-icon" onClick={closeModal}>
          <img src="/svg/close.svg" alt="pencil" />
        </span>
        <h1>{'REGISTRAR TAREA'}</h1>
        <Input
          label="Nombre"
          placeholder="Nombre"
          name="name"
          required={true}
          onChange={handleArea}
        />
        <TextArea
          label="Descripción"
          placeholder="Descripción"
          name="description"
          required={true}
          onChange={handleArea}
        />
        <div className="col">
          <div className="btn-contain">
            <Button
              text={'ACTUALIZAR'}
              className="btn-area"
              whileTap={{ scale: 0.9 }}
              type="submit"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ModalFormTask;
