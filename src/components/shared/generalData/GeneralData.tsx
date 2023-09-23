import { motion, spring } from 'framer-motion';
import { Input, Select, TextArea } from '../..';
import Button from '../button/Button';
import './GeneralData.css';
import CardRegisterCompany from '../card/cardRegisterCompany/CardRegisterCompany';
import CardRegisterConsortium from '../card/cardRegisterConsortium/CardRegisterConsortium';
import CardRegisterExpert from '../card/cardAddExpert/CardRegisterExpert';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  CompanyForm,
  ConsortiumForm,
  ExpertForm,
  ProjectForm,
  Ubigeo,
} from '../../../types/types';
import {
  validateCorrectTyping,
  validateWhiteSpace,
} from '../../../utils/customValidatesForm';
import { RefObject, useEffect, useRef, useState } from 'react';
import useListUsers from '../../../hooks/useListUsers';
import { axiosInstance } from '../../../services/axiosInstance';
import { _date } from '../../../utils/formatDate';

const GeneralData = () => {
  const { users: coordinators } = useListUsers(['ADMIN', 'MOD']);
  const [company, setCompany] = useState<CompanyForm | null>(null);
  const [specialist, setSpecialist] = useState<ExpertForm[] | null>(null);
  const [consortium, setConsortium] = useState<ConsortiumForm | null>(null);

  const [isUniqueCorp, setIsUniqueCorp] = useState(true);
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
  // const handleIsOpen = useRef<Subscription>(new Subscription());
  // useEffect(() => {
  //   handleIsOpen.current = isOpenCardRegisteProject$.getSubject.subscribe(
  //     data => {
  //       setTypeSpecialityId(data.typeSpecialityId);
  //       const project = data.project as ProjectForm;
  //       setIsOpenModal(data.isOpen);
  //       if (project) {
  //         setJurisdictionSelectData(project.department, project.province);
  //         setValue('CUI', project.CUI);
  //         setValue('name', project.name);
  //         setValue('description', project.description);
  //         setValue('typeSpeciality', project.typeSpeciality);
  //         setValue('company', project.company);
  //         setValue('department', project.department);
  //         setValue('province', project.province);
  //         setValue('district', project.district);
  //         setValue('location', project.location);
  //         setValue('userId', project.userId);
  //         setValue('startDate', _date(new Date(project.startDate)));
  //         setValue('untilDate', _date(new Date(project.untilDate)));
  //         setIsUniqueCorp(!!project.company);
  //         setProject(project);
  //       }
  //     }
  //   );
  //   return () => {
  //     handleIsOpen.current.unsubscribe();
  //   };
  // }, [setValue]);

  const handleClickScroll = (ref: RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
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
    // onSave?.();
    // setIsOn(false);
    setIsOpenModal(false);
    reset();
  };
  const toggleSwitchCorp = () => {
    setIsUniqueCorp(!isUniqueCorp);
    isUniqueCorp ? setCompany(null) : setConsortium(null);
  };
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card-register-project"
        autoComplete="off"
      >
        <div
          ref={refDescriptioProject}
          className="card-register-project-container-details"
        >
          <h2>{project ? 'ACTUALIZAR PROYECTO' : 'DATOS DE LA ETAPA'}</h2>
          <hr></hr>
          <div className="col-input-top">
            <Select
              label="Coordinador:"
              {...register('userId', { valueAsNumber: true })}
              name="userId"
              data={coordinators}
              itemKey="id"
              textField="name"
            />
          </div>

          <div className="col-input">
            <Input
              label="Porcentaje"
              name="percentage"
              type="number"
              placeholder="0"
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
    </div>
  );
};

export default GeneralData;
