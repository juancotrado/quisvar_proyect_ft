/* eslint-disable react-hooks/exhaustive-deps */
import { CardAddExpert, Input, Select, TextArea } from '../../..';
import { axiosInstance } from '../../../../services/axiosInstance';
import { isOpenModal$ } from '../../../../services/sharingSubject';
import { _date } from '../../../../utils/formatDate';
import Modal from '../../../portal/Modal';
import Button from '../../button/Button';
import './CardRegisterProject.css';
import { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  CompanyForm,
  ConsortiumForm,
  PersonalBussines,
  ProjectForm,
  Ubigeo,
} from '../../../../types/types';
import { spring } from '../../../../animations/animations';
import { motion } from 'framer-motion';
import useListUsers from '../../../../hooks/useListUsers';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import provincias from '../../../../utils/ubigeo/provincias.json';
import distritos from '../../../../utils/ubigeo/distritos.json';
import departamentos from '../../../../utils/ubigeo/departamentos.json';
import CardRegisterCompany from '../cardRegisterCompany/CardRegisterCompany';
import CardRegisterConsortium from '../cardRegisterConsortium/CardRegisterConsortium';

const InitialValues: ProjectForm = {
  id: 0,
  name: '',
  CUI: '',
  description: '',
  typeSpeciality: '0',
  stageId: 0,
  department: '0',
  province: '0',
  district: '0',
  startDate: _date(new Date()),
  untilDate: _date(new Date()),
  status: false,
  userId: 0,
  specialityId: 0,
};

const typeSpecialities = [
  { id: 1, name: 'Represas' },
  { id: 2, name: 'Irrigaciones' },
  { id: 2, name: 'Tipo de especialidad numero 3' },
];

interface CardRegisterProjectProps {
  onSave?: (value: number) => void;
  project?: ProjectForm | null;
  specialityId?: number;
}

const CardRegisterProject = ({
  project,
  onSave,
  specialityId,
}: CardRegisterProjectProps) => {
  const [dataForm, setDataForm] = useState<ProjectForm>(InitialValues);
  const { listStage } = useSelector((state: RootState) => state);
  const { users: coordinators } = useListUsers(['ADMIN', 'MOD']);
  const [addExpert, setAddExpert] = useState<PersonalBussines[]>();
  const [company, setCompany] = useState<CompanyForm | null>(null);
  const [consortium, setConsortium] = useState<ConsortiumForm | null>(null);
  const [isOn, setIsOn] = useState(false);
  const [isUniqueCorp, setIsUniqueCorp] = useState(true);
  const [province, setProvince] = useState<Ubigeo[]>([]);
  const [district, setDistrict] = useState<Ubigeo[]>([]);
  const [department] = useState<Ubigeo[]>(departamentos);
  const stages = useMemo(() => (listStage ? listStage : []), [listStage]);
  const refDescriptioProject = useRef<HTMLDivElement>(null);
  const refDescriptionCompany = useRef<HTMLDivElement>(null);

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProjectForm>();

  useEffect(() => {
    if (project) {
      setDataForm(project);
    } else {
      setDataForm(InitialValues);
    }
  }, [project]);

  useEffect(() => {
    setValue('CUI', dataForm.CUI);
    setValue('name', dataForm.name);
    setValue('description', dataForm.description);
    setValue('typeSpeciality', dataForm.typeSpeciality);
    setValue('department', dataForm.department);
    setValue('company', dataForm.company);
    setValue('province', dataForm.province);
    setValue('district', dataForm.district);
    setValue('location', dataForm.location);
    setValue('userId', dataForm.userId);
    setValue('stageId', dataForm.stageId);
    setValue('startDate', _date(new Date(dataForm.startDate)));
    setValue('untilDate', _date(new Date(dataForm.untilDate)));
  }, [dataForm]);

  const onSubmit: SubmitHandler<ProjectForm> = values => {
    const { startDate, untilDate, ..._values } = values;
    const _data = {
      ..._values,
      specialists: addExpert,
      startDate: new Date(startDate),
      untilDate: new Date(untilDate),
      company,
      consortium,
      specialityId,
    };
    if (dataForm.id) {
      axiosInstance
        .put(`projects/${dataForm.id}`, _data)
        .then(successfulShipment);
    } else {
      axiosInstance.post('projects', _data).then(successfulShipment);
    }
  };

  const successfulShipment = () => {
    if (!specialityId) return;
    onSave?.(specialityId);
    setIsOn(false);
    isOpenModal$.setSubject = false;
    reset();
  };

  const closeFunctions = () => {
    setIsOn(false);
    setIsUniqueCorp(true);
    isOpenModal$.setSubject = false;
  };

  useEffect(() => {
    if (department) {
      const selectedDepartment = departamentos.filter(
        ubigeo => ubigeo.nombre_ubigeo === watch('department')
      );
      const provinciasData =
        provincias[selectedDepartment[0]?.id_ubigeo as keyof typeof provincias];
      setProvince(provinciasData);
    }
  }, [watch('department')]);

  useEffect(() => {
    if (province) {
      const selectedDistrict = province.filter(
        ubigeo => ubigeo.nombre_ubigeo === watch('province')
      );
      const distritosData =
        distritos[selectedDistrict[0]?.id_ubigeo as keyof typeof distritos];
      setDistrict(distritosData);
    }
  }, [watch('province')]);

  const handleClickScroll = (ref: RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const data = {
    labels: {
      name: 'NOMBRE',
      dni: 'DNI',
      cip: 'CIP/CAP',
      career: 'CARGO',
      phone: 'TELEFONO',
      pdf: 'PDF',
    },
    initialValues: {
      name: '',
      dni: '',
      cip: '',
      career: '',
      phone: '',
      pdf: '',
    },
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
    <Modal size={50}>
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
              label="Tipo:"
              required={true}
              {...register('typeSpeciality')}
              name="typeSpeciality"
              data={typeSpecialities}
              itemKey="name"
              textField="name"
            />

            <Select
              label="Etapa:"
              required={true}
              {...register('stageId', { valueAsNumber: true })}
              name="stageId"
              data={stages}
              itemKey="id"
              textField="name"
            />
          </div>
          <div className="col-input">
            <Select
              label="Departamento:"
              required={true}
              {...register('department')}
              name="department"
              data={department}
              itemKey="nombre_ubigeo"
              textField="nombre_ubigeo"
            />
            <Select
              label="Provincia:"
              required={true}
              {...register('province')}
              name="province"
              data={province}
              itemKey="nombre_ubigeo"
              textField="nombre_ubigeo"
            />
            <Select
              label="Distrito:"
              required={true}
              {...register('district')}
              name="district"
              data={district}
              itemKey="nombre_ubigeo"
              textField="nombre_ubigeo"
            />
          </div>
          <div className="col-input">
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
          <button
            type="button"
            onClick={() => handleClickScroll(refDescriptioProject)}
          >
            patito3
          </button>
          <h2>{'DATOS DE EMPRESA /CONSORCIO'}</h2>
          <hr></hr>
          {!project && (
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
            Datos de la empresa individual:
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
            <div style={{ width: '100%' }}>
              <CardAddExpert
                personalBussines={e => setAddExpert(e)}
                project={project?.specialists}
                data={data}
              />
            </div>
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
