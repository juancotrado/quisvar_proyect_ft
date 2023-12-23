import { Input, Select, TextArea } from '../../..';
import { isOpenCardRegisteContract$ } from '../../../../services/sharingSubject';
import { actualDate } from '../../../../utils/formatDate';
import Modal from '../../../portal/Modal';
import Button from '../../button/Button';
import './cardRegisterContract.css';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ContractForm } from '../../../../types/types';
import {
  PRICE_DIFFICULTY,
  contractIndexData,
} from '../../../../pages/generalIndex/contracts/contractsData';

import { Subscription } from 'rxjs';
import {
  validateWhiteSpace,
  validateOnlyNumbers,
} from '../../../../utils/customValidatesForm';
import CostTable from '../../../contracts/costTable/CostTable';
import { axiosInstance } from '../../../../services/axiosInstance';
import useJurisdiction from '../../../../hooks/useJurisdiction';

const difficultyLevel = [
  { key: 1, name: 'Level 1' },
  { key: 2, name: 'Level 2' },
  { key: 3, name: 'Level 3' },
];

interface CardRegisterContractProps {
  onSave: () => void;
}
const CardRegisterContract = ({ onSave }: CardRegisterContractProps) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const {
    departaments,
    districts,
    provinces,
    handleGetDistricts,
    setJurisdictionSelectData,
    handleGetProvinces,
  } = useJurisdiction();
  const {
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors },
  } = useForm<ContractForm>();

  const handleIsOpen = useRef<Subscription>(new Subscription());

  useEffect(() => {
    handleIsOpen.current = isOpenCardRegisteContract$.getSubject.subscribe(
      data => {
        const { contract } = data;
        setIsOpenModal(data.isOpen);
        if (contract) {
          setJurisdictionSelectData(contract.department, contract.province);
          const {
            id,
            bachelorCost,
            createdAt,
            cui,
            department,
            difficulty,
            district,
            name,
            professionalCost,
            projectName,
            province,
            shortName,
            indexContract,
          } = contract;
          reset({
            id,
            bachelorCost,
            createdAt: actualDate(createdAt),
            cui,
            department,
            difficulty,
            district,
            name,
            professionalCost,
            projectName,
            indexContract,
            province,
            shortName,
          });
        }
      }
    );
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, [reset, setJurisdictionSelectData]);

  const onSubmit: SubmitHandler<ContractForm> = async data => {
    const { id } = data;
    if (id) {
      await axiosInstance.patch(`contract/${id}`, data);
    } else {
      data.indexContract = JSON.stringify(contractIndexData);
      await axiosInstance.post('contract', data);
    }
    closeFunctions();
    onSave();
  };

  const closeFunctions = () => {
    reset({});
    setIsOpenModal(false);
  };

  const handleDifficulty = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = +e.target.value as 1 | 2 | 3;
    reset({
      ...PRICE_DIFFICULTY[value],
      id: watch('id'),
      difficulty: value,
    });
  };

  return (
    <Modal size={50} isOpenProp={isOpenModal}>
      <span className="close-add-card" onClick={closeFunctions}>
        <img src="/svg/close.svg" alt="close" />
      </span>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card-register-contract"
        autoComplete="off"
      >
        <h2>{watch('id') ? 'ACTUALIZAR CONTRATO' : 'REGISTRAR CONTRATO'}</h2>
        <hr />
        <div className="card-register-project-container-details">
          <div className="col-input-top">
            <Input
              label="Nombre del Contrato:"
              {...register('name', {
                validate: { validateWhiteSpace },
              })}
              name="name"
              type="text"
              placeholder="Nombre del Contrato"
              errors={errors}
            />
            <Input
              label="CUI:"
              {...register('cui', {
                validate: { validateWhiteSpace },
              })}
              name="cui"
              placeholder="CUI"
              errors={errors}
            />
          </div>
          <div className="col-input">
            <Input
              label="Nombre Corto del Proyecto:"
              {...register('shortName', {
                validate: { validateWhiteSpace },
              })}
              name="shortName"
              type="text"
              placeholder="Nombre Corto del Proyecto "
              errors={errors}
            />
            <Input
              label="Fecha de Inicio:"
              {...register('createdAt', {
                validate: { validateWhiteSpace },
                valueAsDate: true,
              })}
              name="createdAt"
              onChange={e => console.log(e.target.value)}
              type="date"
              placeholder="Fecha de Inicio "
              errors={errors}
            />
            <Select
              label="Nivel:"
              {...register('difficulty', {
                validate: { validateWhiteSpace },
                valueAsNumber: true,
              })}
              name="difficulty"
              data={difficultyLevel}
              itemKey="key"
              textField="name"
              onChange={handleDifficulty}
              errors={errors}
            />
          </div>
          <div className="col-input">
            <TextArea
              label="Nombre Completo del Proyecto:"
              {...register('projectName', {
                validate: { validateWhiteSpace },
              })}
              name="projectName"
              placeholder="Nombre completo del Proyecto"
              errors={errors}
            />
          </div>
          <div className="col-input">
            <Select
              label="Departamento:"
              {...register('department', {
                validate: { validateWhiteSpace },
              })}
              name="department"
              data={departaments}
              itemKey="nombre_ubigeo"
              textField="nombre_ubigeo"
              onChange={handleGetProvinces}
              errors={errors}
            />
            <Select
              label="Provincia:"
              {...register('province', {
                validate: { validateWhiteSpace },
              })}
              name="province"
              data={provinces}
              itemKey="nombre_ubigeo"
              onChange={handleGetDistricts}
              textField="nombre_ubigeo"
              errors={errors}
            />
            <Select
              label="Distrito:"
              {...register('district', {
                validate: { validateWhiteSpace },
              })}
              name="district"
              data={districts}
              itemKey="nombre_ubigeo"
              textField="nombre_ubigeo"
              errors={errors}
            />
          </div>
        </div>
        <div className="col-input">
          <Input
            label="Costo titulado:"
            {...register('professionalCost', {
              validate: { validateOnlyNumbers },
              valueAsNumber: true,
            })}
            name="professionalCost"
            type="number"
            placeholder="Nombre Corto "
            errors={errors}
          />
          <Input
            type="number"
            label="Costo Egresadp/Bachiller:"
            {...register('bachelorCost', {
              validate: { validateOnlyNumbers },
              valueAsNumber: true,
            })}
            name="bachelorCost"
            placeholder="Egresadp/Bachiller"
            errors={errors}
          />
        </div>
        <div className="col-input">
          <CostTable mount={+watch('professionalCost')} />
          <CostTable mount={+watch('bachelorCost')} />
        </div>
        <Button
          type="submit"
          text={`${watch('id') ? 'Actualizar' : 'Registrar'}`}
          className="send-button"
        />
      </form>
    </Modal>
  );
};

export default CardRegisterContract;
