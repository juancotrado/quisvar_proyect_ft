import { Input, Select, TextArea } from '../../..';
import { isOpenCardRegisteContract$ } from '../../../../services/sharingSubject';
import { actualDate } from '../../../../utils/formatDate';
import Modal from '../../../portal/Modal';
import Button from '../../button/Button';
import './cardRegisterContract.css';
import { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Companies, ContractForm } from '../../../../types/types';
import { contractIndexData } from '../../../../pages/generalIndex/contracts/contractsData';

import { Subscription } from 'rxjs';
import { validateWhiteSpace } from '../../../../utils/customValidatesForm';
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
  const [companies, setCompanies] = useState<null | Companies[]>(null);
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
            createdAt,
            cui,
            department,
            difficulty,
            district,
            name,
            projectName,
            province,
            shortName,
            indexContract,
            contractNumber,
          } = contract;
          reset({
            id,
            createdAt: actualDate(createdAt),
            cui,
            department,
            difficulty,
            district,
            name,
            projectName,
            indexContract,
            province,
            shortName,
            contractNumber,
          });
        } else {
          reset({
            contractNumber: 'Contrato N° 00',
          });
        }
      }
    );
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, [reset, setJurisdictionSelectData]);

  useEffect(() => {
    getSpecialists();
  }, []);
  const getSpecialists = () => {
    axiosInstance.get('/companies').then(el => setCompanies(el.data));
  };
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

  // const handleDifficulty = (e: ChangeEvent<HTMLSelectElement>) => {
  //   const value = +e.target.value as 1 | 2 | 3;
  //   reset({
  //     ...PRICE_DIFFICULTY[value],
  //     id: watch('id'),
  //     difficulty: value,
  //   });
  // };
  console.log(companies);

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
              label="Nomenclatura:"
              {...register('name', {
                validate: { validateWhiteSpace },
              })}
              name="name"
              type="text"
              placeholder="Nomenclatura"
              errors={errors}
            />
            <Input
              label="Nombre de Contrato:"
              {...register('contractNumber', {
                validate: { validateWhiteSpace },
              })}
              name="contractNumber"
              type="text"
              placeholder="N° de Contrato"
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
          {/* <div className="col-input">
            {companies && (
              <>
                <Select
                  label="Empresa:"
                  {...register('company')}
                  name="company"
                  data={companies}
                  itemKey="id"
                  textField="name"
                  errors={errors}
                />
                <Select
                  label="consorcio:"
                  {...(register('consortium'), { valueAsNumber: true })}
                  name="consortium"
                  data={companies}
                  itemKey="id"
                  textField="name"
                  errors={errors}
                />
              </>
            )}
          </div> */}
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
