import { Input, Select, TextArea } from '../../..';
import { axiosInstance } from '../../../../services/axiosInstance';
import { isOpenCardRegisteContract$ } from '../../../../services/sharingSubject';
import { _date } from '../../../../utils/formatDate';
import Modal from '../../../portal/Modal';
import Button from '../../button/Button';
import './cardRegisterContract.css';
import { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ContractForm, Ubigeo } from '../../../../types/types';

import provincesJson from '../../../../utils/ubigeo/provincias.json';
import distritosJson from '../../../../utils/ubigeo/distritos.json';
import departamentsJson from '../../../../utils/ubigeo/departamentos.json';

import { Subscription } from 'rxjs';
import {
  validateWhiteSpace,
  validateOnlyNumbers,
} from '../../../../utils/customValidatesForm';
import CostTable from '../../../contracts/costTable/CostTable';

const CardRegisterContract = () => {
  const [provinces, setProvinces] = useState<Ubigeo[]>([]);
  const [districts, setDistricts] = useState<Ubigeo[]>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
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
        // const { project } = data;
        setIsOpenModal(data.isOpen);

        // if (project) {
        //   setJurisdictionSelectData(project.department, project.province);
        //   reset({
        //     CUI: project.CUI,
        //     name: project.name,
        //     description: project.description,
        //     department: project.department,
        //     percentage: project.percentage + '',
        //     province: project.province,
        //     district: project.district,
        //     id: project.id,
        //   });
        // } else {
        //   reset({
        //     typeSpecialityId: data.typeSpecialityId,
        //   });
        // }
      }
    );
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, []);
  const handleGetProvinces = (value: string) => {
    const findDepartament = departamentsJson.find(
      ubigeo => ubigeo.nombre_ubigeo === value
    );
    const idDepartament = findDepartament?.id_ubigeo;
    const provinciasData =
      provincesJson[idDepartament as keyof typeof provincesJson];
    setProvinces(provinciasData);
  };
  const handleGetDistricts = (value: string) => {
    const findProvice = provinces.find(
      ubigeo => ubigeo.nombre_ubigeo === value
    );
    const idProvince = findProvice?.id_ubigeo;
    const districsData =
      distritosJson[idProvince as keyof typeof distritosJson];
    setDistricts(districsData);
  };

  const setJurisdictionSelectData = (departament: string, province: string) => {
    const findDepartament = departamentsJson.find(
      ubigeo => ubigeo.nombre_ubigeo === departament
    );
    const idDepartament = findDepartament?.id_ubigeo;
    const provinciasData =
      provincesJson[idDepartament as keyof typeof provincesJson];
    const findProvice = provinciasData?.find(
      ubigeo => ubigeo.nombre_ubigeo === province
    );
    const idProvince = findProvice?.id_ubigeo;
    const districsData =
      distritosJson[idProvince as keyof typeof distritosJson];
    setProvinces(provinciasData);
    setDistricts(districsData);
  };

  const onSubmit: SubmitHandler<ContractForm> = data => {
    console.log('asdasd', data);
    // const { id, percentage, ...body } = values;
    // const newBody = { ...body, percentage: +percentage };
    // if (id) {
    //   axiosInstance.patch(`projects/${id}`, newBody).then(successfulShipment);
    // } else {
    //   axiosInstance.post('projects', newBody).then(successfulShipment);
    // }
  };

  const closeFunctions = () => {
    reset({});
    setDistricts([]);
    setProvinces([]);
    setIsOpenModal(false);
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
              placeholder="Nombre Corto "
              errors={errors}
            />
            <Input
              label="CUI:"
              {...register('CUI', {
                validate: { validateWhiteSpace },
              })}
              name="CUI"
              placeholder="CUI"
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
              data={departamentsJson}
              itemKey="nombre_ubigeo"
              textField="nombre_ubigeo"
              onChange={e => handleGetProvinces(e.target.value)}
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
              onChange={e => handleGetDistricts(e.target.value)}
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
