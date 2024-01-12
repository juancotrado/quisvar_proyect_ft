import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Subscription } from 'rxjs';
import { isOpenCardAddCompany$ } from '../../../../services/sharingSubject';
import { axiosInstance } from '../../../../services/axiosInstance';
import { Companies } from '../../../../types/types';
import Modal from '../../../portal/Modal';
import Button from '../../button/Button';
import { Input } from '../../..';

interface UserId {
  id: number;
}
interface CardAddGroupProps {
  onSave: () => void;
}
const CardAddCompany = ({ onSave }: CardAddGroupProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hasId, setHasId] = useState<number>();
  const [data, setData] = useState<Companies[]>();
  const handleIsOpen = useRef<Subscription>(new Subscription());
  const [searchTerm, setSearchTerm] = useState('');
  const {
    // register,
    handleSubmit,
    //setValue,
    // reset,
    // watch,
    // formState: { errors },
  } = useForm<UserId>();

  useEffect(() => {
    handleIsOpen.current = isOpenCardAddCompany$.getSubject.subscribe(value => {
      setIsOpen(value.isOpen);
      setHasId(value.id);
    });

    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, []);
  const onSubmit: SubmitHandler<UserId> = async () => {
    await axiosInstance
      .post(`consortium/relation/${filterList[0].id}/${hasId}`)
      .then(() => {
        setIsOpen(false);
        setSearchTerm('');
        onSave();
      });
  };
  const closeFunctions = () => {
    setIsOpen(false);
    setSearchTerm('');
    // setData([]);
  };

  useEffect(() => {
    getCompanies();
  }, []);
  const getCompanies = () =>
    axiosInstance.get('/companies').then(res => setData(res.data));
  const filterList = useMemo(() => {
    if (!data) return [];
    if (searchTerm === '') return [];
    if (!searchTerm) return data;

    return data.filter(item => item.ruc.startsWith(searchTerm));
  }, [searchTerm, data]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  return (
    <Modal size={50} isOpenProp={isOpen}>
      <form onSubmit={handleSubmit(onSubmit)} className="card-register-users">
        <span className="close-icon" onClick={closeFunctions}>
          <img src="/svg/close.svg" alt="pencil" />
        </span>
        <h1>Agregar Empresa</h1>
        <div className="col-input">
          <Input
            type="text"
            placeholder="Buscar por RUC"
            value={searchTerm}
            onChange={handleSearchChange}
            label="Busqueda"
          />
          <Input
            type="text"
            value={filterList.length > 0 ? filterList[0].name : ''}
            placeholder="Empresa"
            label="Empresa"
            disabled
          />
        </div>
        <div className="col-input">
          <Input
            type="text"
            placeholder="Nombre"
            value={filterList.length > 0 ? filterList[0].manager : ''}
            label="Representante"
            disabled
          />
          <Input
            type="text"
            value={filterList.length > 0 ? filterList[0].description : ''}
            placeholder="Actividades"
            label="Actividades"
            disabled
          />
        </div>
        <div className="btn-build">
          <Button
            text={'AGREGAR'}
            className="btn-area"
            whileTap={{ scale: 0.9 }}
            type="submit"
          />
        </div>
      </form>
    </Modal>
  );
};

export default CardAddCompany;
