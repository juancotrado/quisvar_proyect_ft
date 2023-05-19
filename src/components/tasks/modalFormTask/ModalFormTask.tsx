import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import Modal from '../../portal/Modal';
import Button from '../../shared/button/Button';
import { isOpenModal$ } from '../../../services/sharingSubject';
import { Input } from '../..';
import { useParams } from 'react-router-dom';
import { TaskType } from '../../../types/types';

interface ModalFormTaskProps {
  createTask: (value: TaskType) => void;
  editTask: (value: TaskType) => void;
  getTaskData: TaskType | null;
}

const ModalFormTask = ({
  createTask,
  getTaskData,
  editTask,
}: ModalFormTaskProps) => {
  const debounceRef = useRef<NodeJS.Timeout>();

  const { id } = useParams();
  const initValues = {
    id: 0,
    projectId: Number(id),
    name: '',
    employees: [],
  };
  const [taskForm, setTaskForm] = useState<TaskType>(initValues);

  useEffect(() => {
    if (!getTaskData) {
      setTaskForm(initValues);
      return;
    }
    setTaskForm(getTaskData);
  }, [getTaskData]);

  const closeModal = () => (isOpenModal$.setSubject = false);

  const handleArea = ({
    target,
  }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = target;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setTaskForm({ ...taskForm, [name]: value });
    }, 250);
  };

  const sendForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (taskForm.id === 0) {
      createTask(taskForm);
    } else {
      editTask(taskForm);
    }
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
          defaultValue={taskForm.name}
          required={true}
          onChange={handleArea}
        />

        <div className="col">
          <div className="btn-contain">
            <Button
              text={taskForm.id === 0 ? 'REGISTRAR' : 'ACTUALIZAR'}
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
