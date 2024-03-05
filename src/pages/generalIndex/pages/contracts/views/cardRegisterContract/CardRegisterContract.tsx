import {
  Input,
  Select,
  TextArea,
  Button,
  Modal,
  CloseIcon,
} from '../../../../../../components';
import { isOpenCardRegisteContract$ } from '../../../../../../services/sharingSubject';
import { actualDate, validateWhiteSpace } from '../../../../../../utils';
import './cardRegisterContract.css';
import { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ContractForm, CoorpEntity } from '../../../../../../types';
import { Subscription } from 'rxjs';
import { axiosInstance } from '../../../../../../services/axiosInstance';
import { useJurisdiction } from '../../../../../../hooks';
import {
  CONTRACT_INDEX_DATA,
  CONTRACT_TYPE,
  DIFFICULTY_LEVEL,
} from '../../models';

interface CardRegisterContractProps {
  onSave: () => void;
}
export const CardRegisterContract = ({ onSave }: CardRegisterContractProps) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [companies, setCompanies] = useState<null | CoorpEntity[]>(null);
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
            companyId,
            consortiumId,
            type,
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
            type,
            idCoorp: companyId
              ? 'companyId-' + companyId
              : 'consortiumId-' + consortiumId,
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
    axiosInstance.get('/consortium/both').then(el => setCompanies(el.data));
  };
  const onSubmit: SubmitHandler<ContractForm> = async data => {
    const { id, idCoorp, ...resData } = data;
    const [keyName, newIdCoorp] = idCoorp.split('-');
    const body = {
      ...resData,
      companyId: null,
      consortiumId: null,
      [keyName]: +newIdCoorp,
    };
    if (id) {
      await axiosInstance.patch(`contract/${id}`, body);
    } else {
      body.indexContract = JSON.stringify(CONTRACT_INDEX_DATA);
      await axiosInstance.post('contract', body);
    }
    closeFunctions();
    onSave();
  };

  const closeFunctions = () => {
    reset({});
    setIsOpenModal(false);
  };

  return (
    <Modal size={50} isOpenProp={isOpenModal}>
      <CloseIcon onClick={closeFunctions} />
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
            {/* <Input
              label="Nombre Corto del Proyecto:"
              {...register('shortName', {
                validate: { validateWhiteSpace },
              })}
              name="shortName"
              type="text"
              placeholder="Nombre Corto del Proyecto "
              errors={errors}
            /> */}
            {companies && (
              <Select
                label="Empresa o Consorcio :"
                {...register('idCoorp')}
                name="idCoorp"
                data={companies}
                itemKey="newId"
                textField="name"
                errors={errors}
              />
            )}
            <Input
              label="Fecha de firma:"
              {...register('createdAt', {
                validate: { validateWhiteSpace },
                valueAsDate: true,
              })}
              name="createdAt"
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
              data={DIFFICULTY_LEVEL}
              itemKey="key"
              textField="name"
              errors={errors}
            />
            <Select
              label="Tipo de contrato:"
              {...register('type', {
                validate: { validateWhiteSpace },
              })}
              name="type"
              data={CONTRACT_TYPE}
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
        </div>

        <Button
          type="submit"
          text={`${watch('id') ? 'Actualizar' : 'Registrar'}`}
          styleButton={4}
        />
      </form>
    </Modal>
  );
};

export default CardRegisterContract;
