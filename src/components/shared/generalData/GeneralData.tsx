// import React from 'react'

import { SubmitHandler, useForm } from 'react-hook-form';
import { Group, StageForm, StageInfo } from '../../../types/types';
import { Input, Select } from '../..';
import {
  validateOnlyNumbers,
  validateWhiteSpace,
} from '../../../utils/customValidatesForm';
import CostTable from '../../contracts/costTable/CostTable';
import Button from '../button/Button';
import { useEffect, useState } from 'react';
import './GeneralData.css';
import { axiosInstance } from '../../../services/axiosInstance';
import { useParams } from 'react-router-dom';

const GeneralData = () => {
  const { stageId } = useParams();
  const [stageInfo, setStageInfo] = useState<StageInfo | null>(null);
  const [groups, setGroups] = useState<Group[] | null>(null);

  const {
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors },
  } = useForm<StageForm>();

  useEffect(() => {
    getStageDetails();
    getGroups();
  }, []);

  const getStageDetails = () => {
    axiosInstance.get(`/stages/details/${stageId}`).then(res => {
      const { professionalCost, bachelorCost, groupId } = res.data as StageInfo;
      reset({ bachelorCost, groupId, professionalCost });
      setStageInfo(res.data);
    });
  };
  // const dataInfoStage = {
  //   Etapa: '',
  //   Proyecto: '',
  //   CUI: '',
  //   Departamento: '',
  //   Provincia: '',
  //   Distrito: '',
  // };

  const dataInfoStage = () => {
    if (!stageInfo) return {};
    const { province, department, district, projectName, cui } =
      stageInfo.project.contract;
    return {
      ['Etapa:']: stageInfo.name,
      ['Proyecto:']: projectName,
      ['CUI:']: cui,
      ['Departamento:']: department,
      ['Provincia:']: province,
      ['Distrito:']: district,
    };
  };
  const getGroups = async () => {
    axiosInstance.get(`/groups/all`).then(res => setGroups(res.data));
  };
  const onSubmitStage: SubmitHandler<StageForm> = async body => {
    axiosInstance
      .patch(`/stages/details/${stageId}`, body)
      .then(() => getStageDetails());
  };
  return (
    <div className="generalData">
      <div className="generalData-main-info">
        <div className="generalData-info-stage">
          {Object.entries(dataInfoStage()).map(([key, value]) => (
            <div className="generalData-info-stage-content">
              <h4 className="generalData-info-stage-label">{key}</h4>
              <p className="generalData-info-stage-text">{value}</p>
            </div>
          ))}
        </div>
        <div className="generalData-info-group"></div>
      </div>
      <form
        className="generalData-edit-info"
        onSubmit={handleSubmit(onSubmitStage)}
      >
        <h2 className="generalData-edit-info-title">PRE-AJUSTES DE LA ETAPA</h2>
        <div className="col-input">
          {groups && (
            <Select
              {...register('groupId', {
                validate: { validateWhiteSpace },
                valueAsNumber: true,
              })}
              placeholder="Asignar Grupo"
              name="groupId"
              data={groups}
              itemKey="id"
              textField="name"
              errors={errors}
              className="generalData-edit-info-input"
            />
          )}
        </div>
        <div className="col-input">
          <Input
            {...register('professionalCost', {
              validate: { validateOnlyNumbers },
              valueAsNumber: true,
            })}
            name="professionalCost"
            type="number"
            placeholder="Costo - Bachiller "
            errors={errors}
            className="generalData-edit-info-input"
          />
          <Input
            {...register('bachelorCost', {
              validate: { validateOnlyNumbers },
              valueAsNumber: true,
            })}
            type="number"
            name="bachelorCost"
            placeholder="Costo - Titulado"
            errors={errors}
            className="generalData-edit-info-input"
          />
        </div>
        <div className="col-input">
          <CostTable mount={+watch('professionalCost')} text="Bachiller" />
          <CostTable mount={+watch('bachelorCost')} text="Titulado" />
        </div>
        <Button type="submit" text={`Guardar`} className="send-button" />
      </form>
    </div>
  );
};

export default GeneralData;
