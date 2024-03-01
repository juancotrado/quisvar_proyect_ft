import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import './cardAddGroup.css';
import { isOpenCardAddGroup$ } from '../../../../../../services/sharingSubject';
import { Subscription } from 'rxjs';
import Modal from '../../../../../../components/portal/Modal';
import { SubmitHandler, useForm } from 'react-hook-form';
import Button from '../../../../../../components/button/Button';
import { CloseIcon, Input } from '../../../../../../components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../store';
import { axiosInstance } from '../../../../../../services/axiosInstance';

interface UserId {
  id: number;
}
interface CardAddGroupProps {
  onSave: () => void;
  modId?: number;
}
const CardAddGroup = ({ onSave, modId }: CardAddGroupProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hasId, setHasId] = useState<number>();
  const handleIsOpen = useRef<Subscription>(new Subscription());
  const [searchTerm, setSearchTerm] = useState('');
  const { listUsers: users } = useSelector((state: RootState) => state);

  const {
    // register,
    handleSubmit,
    //setValue,
    // reset,
    // watch,
    // formState: { errors },
  } = useForm<UserId>();

  useEffect(() => {
    handleIsOpen.current = isOpenCardAddGroup$.getSubject.subscribe(value => {
      setIsOpen(value.isOpen);
      setHasId(value.id);
    });

    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, []);
  const onSubmit: SubmitHandler<UserId> = async () => {
    if (modId) {
      await axiosInstance
        .post(`groups/relation/${filterList[0].id}/${hasId}`)
        .then(() => {
          setIsOpen(false);
          setSearchTerm('');
          onSave();
        });
    } else {
      await axiosInstance
        .patch(`groups/${hasId}`, { modId: filterList[0].id })
        .then(() => {
          setIsOpen(false);
          setSearchTerm('');
          onSave();
        });
    }
  };

  const closeFunctions = () => {
    setIsOpen(false);
    setSearchTerm('');
  };
  const filterList = useMemo(() => {
    if (!users) return [];
    if (searchTerm === '') return [];

    const filteredByStatus = users.filter(user => user.status === true);

    if (!searchTerm) return filteredByStatus;

    return filteredByStatus.filter(user =>
      user.profile.dni.startsWith(searchTerm)
    );
  }, [searchTerm, users]);
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  return (
    <Modal size={50} isOpenProp={isOpen}>
      <form onSubmit={handleSubmit(onSubmit)} className="card-register-users">
        <CloseIcon onClick={closeFunctions} />
        <h1>Asignar {modId ? 'Integrante' : 'Coordinador'}</h1>
        <div className="col-input">
          <Input
            type="text"
            placeholder="Buscar por DNI"
            value={searchTerm}
            onChange={handleSearchChange}
            label="Busqueda"
          />
          <Input
            type="text"
            value={filterList.length > 0 ? filterList[0].profile.userPc : ''}
            placeholder="Usuario"
            disabled
          />
        </div>
        <div className="col-input">
          <Input
            type="text"
            value={filterList.length > 0 ? filterList[0].profile.firstName : ''}
            placeholder="Nombre"
            disabled
          />
          <Input
            type="text"
            value={filterList.length > 0 ? filterList[0].profile.lastName : ''}
            placeholder="Apellido"
            disabled
          />
        </div>
        <div className="btn-build">
          <Button
            text={hasId ? 'GUARDAR' : 'ASIGNAR'}
            className="btn-area"
            whileTap={{ scale: 0.9 }}
            type="submit"
          />
        </div>
      </form>
    </Modal>
  );
};

export default CardAddGroup;
