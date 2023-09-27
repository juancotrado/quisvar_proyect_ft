import Modal from '../../../portal/Modal';
import './CardGenerateReport.css';
import { isOpenCardGenerateReport$ } from '../../../../services/sharingSubject';
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
import { useEffect, useRef, useState } from 'react';
import { Subscription } from 'rxjs';

interface CardGenerateReportProps {
  employeeId?: number;
}
const CardGenerateReport = ({ employeeId }: CardGenerateReportProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleIsOpen = useRef<Subscription>(new Subscription());

  useEffect(() => {
    handleIsOpen.current = isOpenCardGenerateReport$.getSubject.subscribe(
      value => setIsOpen(value)
    );
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, []);

  const { userSession } = useSelector((state: RootState) => state);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<ReportForm>();

  const showModal = () => {
    reset({});
    setIsOpen(false);
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
    const idGenerate = employeeId ?? userSession.id;
    axiosInstance
      .get(
        `/reports/user/${idGenerate}?initial=${data.initialDate}&until=${data.untilDate}&status=DONE`
      )
      .then(res => {
        const { firstName, lastName, dni, phone, degree } =
          res.data.user.profile;
        const infoData = {
          ...data,
          initialDate,
          untilDate,
          totalDays,
          firstName,
          lastName,
          dni,
          phone,
          degree,
        };
        excelReport(res.data.projects, infoData, res.data.attendance);
      });
  };

  return (
    <Modal size={50} isOpenProp={isOpen}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card-generate-report"
        autoComplete="off"
      >
        <div className="report-title">
          <h2>Generar Reporte</h2>
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
        </div>

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
