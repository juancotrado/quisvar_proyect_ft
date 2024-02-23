// import React from 'react'

import { SubmitHandler, useForm } from 'react-hook-form';
import { Group, StageForm, StageInfo } from '../../../../../../types';
import { CostTable, Input, Select, Button } from '../../../../../../components';
import {
  validateOnlyNumbers,
  validateWhiteSpace,
} from '../../../../../../utils';
import { useEffect, useState } from 'react';
import './GeneralData.css';
import { axiosInstance } from '../../../../../../services/axiosInstance';
import { useParams } from 'react-router-dom';
import GeneralDataGroupRow from './components/GeneralDataGroupRow';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../store';

const GeneralData = () => {
  const { stageId } = useParams();
  const [stageInfo, setStageInfo] = useState<StageInfo | null>(null);
  const [groups, setGroups] = useState<Group[] | null>(null);
  const modAuth = useSelector((state: RootState) => state.modAuthProject);
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
    axiosInstance.get<StageInfo>(`/stages/details/${stageId}`).then(res => {
      const {
        professionalCost,
        bachelorCost,
        groupId,
        graduateCost,
        internCost,
      } = res.data;
      reset({
        bachelorCost,
        groupId: groupId ?? '',
        professionalCost,
        graduateCost,
        internCost,
      });
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
  const getGroups = () => {
    axiosInstance.get(`/groups/all`).then(res => setGroups(res.data));
  };
  const onSubmitStage: SubmitHandler<StageForm> = async body => {
    axiosInstance
      .patch(`/stages/details/${stageId}`, body)
      .then(getStageDetails);
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
              {stageInfo?.group?.moderator && (
                <GeneralDataGroupRow
                  user={stageInfo?.group?.moderator}
                  index={1}
                />
              )}
              {groupsStage.map(({ users }, i) => (
                <GeneralDataGroupRow
                  key={users.id}
                  user={users}
                  index={i + 2}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      {modAuth && (
        <form
          className="generalData-edit-info"
          onSubmit={handleSubmit(onSubmitStage)}
        >
          <h2 className="generalData-edit-info-title">
            PRE-AJUSTES DE LA ETAPA
          </h2>
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
                disabled={!modAuth}
              />
            )}
          </div>
          <div className="col-input">
            <Input
              label="Costo Practicante:"
              {...register('internCost', {
                validate: { validateWhiteSpace, validateOnlyNumbers },
                valueAsNumber: true,
              })}
              name="internCost"
              type="number"
              placeholder="Costo - Practicante"
              errors={errors}
              className="generalData-edit-info-input"
              disabled={!modAuth}
            />
            <Input
              label="Costo Egresado:"
              {...register('graduateCost', {
                validate: { validateWhiteSpace, validateOnlyNumbers },
                valueAsNumber: true,
              })}
              name="graduateCost"
              type="number"
              placeholder="Costo - Egresado"
              errors={errors}
              className="generalData-edit-info-input"
              disabled={!modAuth}
            />
          </div>
          <div className="col-input">
            <CostTable mount={+watch('internCost')} text="Practicante" />
            <CostTable mount={+watch('graduateCost')} text="Egresado" />
          </div>
          <div className="col-input">
            <Input
              label="Costo Bachiller:"
              {...register('bachelorCost', {
                validate: { validateWhiteSpace, validateOnlyNumbers },
                valueAsNumber: true,
              })}
              name="bachelorCost"
              type="number"
              placeholder="Costo - Bachiller "
              errors={errors}
              className="generalData-edit-info-input"
              disabled={!modAuth}
            />
            <Input
              label="Costo Titulado:"
              {...register('professionalCost', {
                validate: { validateWhiteSpace, validateOnlyNumbers },
                valueAsNumber: true,
              })}
              type="number"
              name="professionalCost"
              placeholder="Costo - Titulado"
              errors={errors}
              className="generalData-edit-info-input"
              disabled={!modAuth}
            />
          </div>
          <div className="col-input">
            <CostTable mount={+watch('bachelorCost')} text="Bachiller" />
            <CostTable mount={+watch('professionalCost')} text="Titulado" />
          </div>
          {modAuth && <Button type="submit" text={`Guardar`} styleButton={4} />}
        </form>
      )}
    </div>
  );
};

export default GeneralData;
