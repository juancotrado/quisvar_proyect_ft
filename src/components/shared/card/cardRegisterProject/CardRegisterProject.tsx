import { Input, Select, TextArea } from '../../..';
import { axiosInstance } from '../../../../services/axiosInstance';
import { isOpenCardRegisteProject$ } from '../../../../services/sharingSubject';
import { _date } from '../../../../utils/formatDate';
import Modal from '../../../portal/Modal';
import Button from '../../button/Button';
import './CardRegisterProject.css';
import { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  CompanyForm,
  ConsortiumForm,
  ExpertForm,
  ProjectForm,
  Ubigeo,
} from '../../../../types/types';
import { spring } from '../../../../animations/animations';
import { motion } from 'framer-motion';
import useListUsers from '../../../../hooks/useListUsers';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import provincesJson from '../../../../utils/ubigeo/provincias.json';
import distritosJson from '../../../../utils/ubigeo/distritos.json';
import departamentsJson from '../../../../utils/ubigeo/departamentos.json';
import CardRegisterCompany from '../cardRegisterCompany/CardRegisterCompany';
import CardRegisterConsortium from '../cardRegisterConsortium/CardRegisterConsortium';
import CardRegisterExpert from '../cardAddExpert/CardRegisterExpert';
import { Subscription } from 'rxjs';

interface CardRegisterProjectProps {
  onSave?: () => void;
}

const CardRegisterProject = ({ onSave }: CardRegisterProjectProps) => {
  const { listStage } = useSelector((state: RootState) => state);
  const [isOn, setIsOn] = useState(false);
  const { users: coordinators } = useListUsers(['ADMIN', 'MOD']);
  const [company, setCompany] = useState<CompanyForm | null>(null);
  const [specialist, setSpecialist] = useState<ExpertForm[] | null>(null);
  const [consortium, setConsortium] = useState<ConsortiumForm | null>(null);
  const [provinces, setProvinces] = useState<Ubigeo[]>([]);
  const [districts, setDistricts] = useState<Ubigeo[]>([]);
  const [isUniqueCorp, setIsUniqueCorp] = useState(true);
  const stages = useMemo(() => (listStage ? listStage : []), [listStage]);
  const refDescriptioProject = useRef<HTMLDivElement>(null);
  const refDescriptionCompany = useRef<HTMLDivElement>(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [project, setProject] = useState<ProjectForm | null>(null);
  const [typeSpecialityId, setTypeSpecialityId] = useState<number | null>(null);
  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProjectForm>();

  const handleIsOpen = useRef<Subscription>(new Subscription());

  useEffect(() => {
    handleIsOpen.current = isOpenCardRegisteProject$.getSubject.subscribe(
      data => {
        setTypeSpecialityId(data.typeSpecialityId);
        const project = data.project as ProjectForm;
        setIsOpenModal(data.isOpen);
        if (project) {
          setJurisdictionSelectData(project.department, project.province);
          setValue('CUI', project.CUI);
          setValue('name', project.name);
          setValue('description', project.description);
          setValue('typeSpeciality', project.typeSpeciality);
          setValue('company', project.company);
          setValue('department', project.department);
          setValue('province', project.province);
          setValue('district', project.district);
          setValue('location', project.location);
          setValue('userId', project.userId);
          setValue('stageId', project.stageId);
          setValue('startDate', _date(new Date(project.startDate)));
          setValue('untilDate', _date(new Date(project.untilDate)));
          setIsUniqueCorp(!!project.company);
          setProject(project);
        }
      }
    );
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, [setValue]);
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

  const onSubmit: SubmitHandler<ProjectForm> = values => {
    const { startDate, untilDate, ..._values } = values;
    const _data = {
      ..._values,
      startDate: new Date(startDate),
      untilDate: new Date(untilDate),
      specialistsInfo: specialist,
      companyInfo: company,
      consortiumInfo: consortium,
      typeSpecialityId,
    };
    if (project?.id) {
      axiosInstance
        .put(`projects/${project.id}`, _data)
        .then(successfulShipment);
    } else {
      axiosInstance.post('projects', _data).then(successfulShipment);
    }
  };

  const successfulShipment = () => {
    onSave?.();
    setIsOn(false);
    setIsOpenModal(false);
    reset();
  };

  const closeFunctions = () => {
    reset({});
    setDistricts([]);
    setProvinces([]);
    setIsOn(false);
    setIsUniqueCorp(true);
    setIsOpenModal(false);
  };

  const handleClickScroll = (ref: RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleSwitch = () => {
    setIsOn(!isOn);
    setValue('unique', !isOn);
  };

  const toggleSwitchCorp = () => {
    setIsUniqueCorp(!isUniqueCorp);
    isUniqueCorp ? setCompany(null) : setConsortium(null);
  };

  return (
    <Modal size={50} isOpenProp={isOpenModal}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card-register-project"
        autoComplete="off"
      >
        <div
          ref={refDescriptioProject}
          className="card-register-project-container-details"
        >
          <span className="close-add-card" onClick={closeFunctions}>
            <img src="/svg/close.svg" alt="pencil" />
          </span>
          <h2>{project ? 'ACTUALIZAR PROYECTO' : 'REGISTRAR PROYECTO'}</h2>
          <hr></hr>
          <div className="col-input-top">
            <div className="edit-this">
              <Input
                label="CUI:"
                {...register('CUI', {
                  pattern: {
                    value: /^[^/?@|<>":'\\]+$/,
                    message:
                      'Ingresar nombre que no contenga lo siguiente ^/?@|<>": ',
                  },
                })}
                name="CUI"
                required={true}
                placeholder="CUI"
                errors={errors}
              />
            </div>
            <Input
              label="Nombre Corto:"
              {...register('name', {
                pattern: {
                  value: /^[^/?@|<>":'\\]+$/,
                  message:
                    'Ingresar nombre que no contenga lo siguiente ^/?@|<>": ',
                },
              })}
              name="name"
              type="text"
              placeholder="Nombre Corto "
              errors={errors}
            />
            <Select
              label="Coordinador:"
              required={true}
              {...register('userId', { valueAsNumber: true })}
              name="userId"
              data={coordinators}
              itemKey="id"
              textField="name"
            />
          </div>
          <TextArea
            label="Nombre Completo del Proyecto:"
            {...register('description', {
              pattern: {
                value: /^[^/?@|<>":'\\]+$/,
                message:
                  'Ingresar nombre que no contenga lo siguiente ^/?@|<>": ',
              },
            })}
            name="description"
            placeholder="Nombre completo del Proyecto"
            errors={errors}
          />
          {!project && (
            <div className="col-unique">
              <span className="switch-status-label">
                ¿eL proyecto tendrá area única?
              </span>
              <div
                className="switch-status"
                data-ison={isOn}
                onClick={toggleSwitch}
              >
                <motion.div
                  className={`handle-statuts ${isOn && 'handle-on'}`}
                  layout
                  transition={spring}
                >
                  <div>{isOn ? 'si' : 'no'} </div>
                </motion.div>
              </div>
            </div>
          )}
          <div className="col-input">
            <Select
              label="Etapa:"
              required={true}
              {...register('stageId', { valueAsNumber: true })}
              name="stageId"
              data={stages}
              itemKey="id"
              textField="name"
            />
            <Input
              label="Fecha Inicio:"
              {...register('startDate')}
              name="startDate"
              type="date"
            />
            <Input
              label="Fecha Limite:"
              {...register('untilDate')}
              name="untilDate"
              type="date"
            />
          </div>
          <div className="col-input">
            <Select
              label="Departamento:"
              required={true}
              {...register('department')}
              name="department"
              data={departamentsJson}
              itemKey="nombre_ubigeo"
              textField="nombre_ubigeo"
              onChange={e => handleGetProvinces(e.target.value)}
            />
            <Select
              label="Provincia:"
              required={true}
              {...register('province')}
              name="province"
              data={provinces}
              itemKey="nombre_ubigeo"
              onChange={e => handleGetDistricts(e.target.value)}
              textField="nombre_ubigeo"
            />
            <Select
              label="Distrito:"
              required={true}
              {...register('district')}
              name="district"
              data={districts}
              itemKey="nombre_ubigeo"
              textField="nombre_ubigeo"
            />
          </div>
          <Button
            type="button"
            text="Ver más información de Empresa/Consorcio +"
            className="card-register-project-button-show-bussiness"
            onClick={() => handleClickScroll(refDescriptionCompany)}
          />
        </div>
        <div
          ref={refDescriptionCompany}
          className="card-register-project-container-details"
        >
          {/* <button
            type="button"
            onClick={() => handleClickScroll(refDescriptioProject)}
          >
            patito3
          </button> */}
          <h2>{`DATOS DE ${isUniqueCorp ? 'EMPRESA' : 'CONSORCIO'} `}</h2>
          <hr></hr>
          {!project?.company && !project?.consortium && (
            <div className="col-unique">
              <span className="switch-status-label">
                ¿EL proyecto tendrá una única empresa?
              </span>
              <div
                className="switch-status"
                data-ison={isUniqueCorp}
                onClick={toggleSwitchCorp}
              >
                <motion.div
                  className={`handle-statuts ${isUniqueCorp && 'handle-on'}`}
                  layout
                  transition={spring}
                >
                  <div>{isUniqueCorp ? 'si' : 'no'} </div>
                </motion.div>
              </div>
            </div>
          )}
          <span className="switch-status-label">
            Datos Generales {isUniqueCorp ? 'de la Empresa' : 'del Consorcio'} :
          </span>
          {isUniqueCorp ? (
            <CardRegisterCompany
              onSave={_company => setCompany(_company)}
              company={project?.company}
            />
          ) : (
            <CardRegisterConsortium
              onSave={_consortium => setConsortium(_consortium)}
              consortium={project?.consortium}
            />
          )}
          <div className="col-input">
            <CardRegisterExpert
              onSave={_experts => setSpecialist(_experts)}
              experts={project?.specialists}
            />
          </div>
        </div>
        <Button
          type="submit"
          text={`${project ? 'Actualizar' : 'Registrar'}`}
          className="send-button"
        />
      </form>
    </Modal>
  );
};

export default CardRegisterProject;
