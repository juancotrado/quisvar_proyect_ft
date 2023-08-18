import Modal from '../../../portal/Modal';
import './CardGenerateReport.css';
import { isOpenModal$ } from '../../../../services/sharingSubject';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Input, TextArea } from '../../..';
import Button from '../../button/Button';
import {
  validateCorrectTyping,
  validateWhiteSpace,
} from '../../../../utils/customValidatesForm';
import formatDate, { getTimeOut } from '../../../../utils/formatDate';
import { axiosInstance } from '../../../../services/axiosInstance';
import { ReportForm } from '../../../../types/types';
import { excelReport } from '../../../../utils/generateExcel';
import { RootState } from '../../../../store';
import { useSelector } from 'react-redux';
import useListUsers from '../../../../hooks/useListUsers';
import DropDownSimple from '../../select/DropDownSimple';
import { useState } from 'react';
interface EmployeeList {
  id: number;
  name: string;
}
const CardGenerateReport = () => {
  const { userSession } = useSelector((state: RootState) => state);
  const { users } = useListUsers();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<ReportForm>();
  const [employee, setEmployee] = useState<EmployeeList>();

  const showModal = () => {
    setEmployee({ id: 0, name: '' });
    reset({});
    isOpenModal$.setSubject = false;
  };
  const onSubmit: SubmitHandler<ReportForm> = data => {
    const initialDate = formatDate(new Date(data.initialDate), {
      day: 'numeric',
      weekday: 'long',
      month: 'long',
      year: 'numeric',
    });
    const untilDate = formatDate(new Date(data.untilDate), {
      day: 'numeric',
      weekday: 'long',
      month: 'long',
      year: 'numeric',
    });
    const totalDays = getTimeOut(data.initialDate, data.untilDate) / 24;
    const idGenerate =
      userSession.role === 'EMPLOYEE' ? userSession.id : employee?.id;
    axiosInstance
      .get(
        `/reports/user/${idGenerate}?initial=${data.initialDate}&until=${data.untilDate}&status=DONE`
      )
      .then(res => {
        const { firstName, lastName, dni, phone } = res.data.user.profile;
        const infoData = {
          ...data,
          initialDate,
          untilDate,
          totalDays,
          firstName,
          lastName,
          dni,
          phone,
        };
        excelReport(res.data.subtask, infoData);
      });
    setEmployee({ id: 0, name: '' });
  };

  return (
    <Modal size={50}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card-generate-report"
        autoComplete="off"
      >
        <div className="report-title">
          <h2>Generar Reporte</h2>
          {userSession.role !== 'EMPLOYEE' && (
            <div className="search-employee">
              <DropDownSimple
                data={users}
                itemKey="id"
                textField="name"
                name="employees"
                selector
                className="report-employee-list"
                placeholder="Para otros"
                defaultInput={employee?.name}
                valueInput={(name, id) =>
                  setEmployee({ id: parseInt(id), name })
                }
              />
            </div>
          )}
        </div>
        <span className="close-add-card" onClick={showModal}>
          <img src="/svg/close.svg" alt="pencil" />
        </span>
        <div className="col-input">
          <Input
            label="Fecha Inicio:"
            {...register('initialDate')}
            name="initialDate"
            type="date"
          />
          <Input
            label="Fecha Limite:"
            {...register('untilDate')}
            name="untilDate"
            type="date"
          />
        </div>
        <Input
          label="Coordinador de proyecto:"
          {...register('manager', {
            required: 'Este campo es obligatorio',
            validate: { validateWhiteSpace, validateCorrectTyping },
          })}
          name="manager"
          type="text"
          placeholder="Nombre del coordinador"
          errors={errors}
        />

        <Input
          label="Concepto:"
          {...register('concept', {
            required: 'Este campo es obligatorio',
            validate: { validateWhiteSpace, validateCorrectTyping },
          })}
          name="concept"
          type="text"
          placeholder="Concepto"
          errors={errors}
        />
        <div className="col-input">
          <Input
            label="Cargo:"
            {...register('charge', {
              required: 'Este campo es obligatorio',
              validate: { validateWhiteSpace, validateCorrectTyping },
            })}
            name="charge"
            type="text"
            placeholder="Cargo"
            errors={errors}
          />
          <Input
            label="Remoto de Trabajo:"
            {...register('remote', {
              required: 'Este campo es obligatorio',
              validate: { validateWhiteSpace, validateCorrectTyping },
            })}
            name="remote"
            type="text"
            placeholder="Remoto de Trabajo"
            errors={errors}
          />
          <Input
            label="Porcentaje:"
            {...register('advancePorcentage', {
              required: 'Este campo es obligatorio',
              validate: { validateWhiteSpace, validateCorrectTyping },
            })}
            name="advancePorcentage"
            type="number"
            placeholder="%"
            errors={errors}
          />
        </div>
        <TextArea
          label="Titulo del Informe:"
          {...register('title', {
            required: 'Este campo es obligatorio',
            validate: { validateWhiteSpace },
          })}
          name="title"
          placeholder="Titulo del Informe"
          errors={errors}
        />
        <Button type="submit" text="Generar" className="send-button" />
      </form>
    </Modal>
  );
};

export default CardGenerateReport;
