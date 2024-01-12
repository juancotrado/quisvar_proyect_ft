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
import { capitalizeText, getRole } from '../../../utils/tools';

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
      reset({ bachelorCost, groupId: groupId ?? '', professionalCost });
      setStageInfo(res.data);
    });
  };

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
    console.log(body);
    axiosInstance
      .patch(`/stages/details/${stageId}`, body)
      .then(() => getStageDetails());
  };

  const groupsStage = stageInfo?.group?.groups ?? [];
  return (
    <div className="generalData">
      <div className="generalData-main-info">
        <div className="generalData-info-stage">
          {Object.entries(dataInfoStage()).map(([key, value]) => (
            <div key={key} className="generalData-info-stage-content">
              <h4 className="generalData-info-stage-label">{key}</h4>
              <p className="generalData-info-stage-text">{value}</p>
            </div>
          ))}
        </div>
        {groupsStage.length > 0 && (
          <div className="generalData-info-group">
            <h2 className="generalData-edit-info-title">
              CONFORMACIÓN DEL GRUPO
            </h2>
            <div className="generalData-infor-group-table">
              <div className="generalData-infor-group-header">
                <span className="generalData-infor-group-text">#</span>
                <span className="generalData-infor-group-text">NOMBRE</span>
                <span className="generalData-infor-group-text">ROL</span>
                <span className="generalData-infor-group-text">PROFESIÓN</span>
                <span className="generalData-infor-group-text">GRADO</span>
              </div>
              {groupsStage.map(({ users }, i) => (
                <div key={users.id} className="generalData-infor-group-contain">
                  <span className="generalData-infor-group-text generalData-table-text-alter">
                    {i + 1}
                  </span>
                  <span className="generalData-infor-group-text generalData-table-text-alter">
                    {users.profile.firstName} {users.profile.lastName}
                  </span>
                  <span className="generalData-infor-group-text generalData-table-text-alter">
                    {capitalizeText(
                      `${getRole(users.role)} ${users.profile.description}`
                    )}
                  </span>
                  <span className="generalData-infor-group-text generalData-table-text-alter">
                    {users.profile.job}
                  </span>
                  <span className="generalData-infor-group-text generalData-table-text-alter">
                    {users.profile.degree}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <form
        className="generalData-edit-info"
        onSubmit={handleSubmit(onSubmitStage)}
      >
        <h2 className="generalData-edit-info-title">PRE-AJUSTES DE LA ETAPA</h2>
        <div className="col-input">
          {groups && (
            <Select
              label="Grupo:"
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
            label="Costo Bachiller:"
            {...register('bachelorCost', {
              validate: { validateOnlyNumbers },
              valueAsNumber: true,
            })}
            name="bachelorCost"
            type="number"
            placeholder="Costo - Bachiller "
            errors={errors}
            className="generalData-edit-info-input"
          />
          <Input
            label="Costo Titulado:"
            {...register('professionalCost', {
              validate: { validateOnlyNumbers },
              valueAsNumber: true,
            })}
            type="number"
            name="professionalCost"
            placeholder="Costo - Titulado"
            errors={errors}
            className="generalData-edit-info-input"
          />
        </div>
        <div className="col-input">
          <CostTable mount={+watch('bachelorCost')} text="Bachiller" />
          <CostTable mount={+watch('professionalCost')} text="Titulado" />
        </div>
        <Button type="submit" text={`Guardar`} className="send-button" />
      </form>
    </div>
  );
};

export default GeneralData;
