import './CardGenerateReport.css';
import { isOpenCardGenerateReport$ } from '../../services/sharingSubject';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button, Input, TextArea, Modal } from '..';
import { axiosInstance } from '../../services/axiosInstance';
import { ReportForm } from '../../types';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { Subscription } from 'rxjs';
import {
  getTimeOut,
  validatePorcentage,
  validateWhiteSpace,
  excelReport,
  formatDateLongSpanish,
} from '../../utils';

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

  const userId = useSelector((state: RootState) => state.userSession.id);
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
  const onSubmit: SubmitHandler<ReportForm> = async data => {
    const initialDate = formatDateLongSpanish(data.initialDate);
    const untilDate = formatDateLongSpanish(data.untilDate);
    const totalDays = getTimeOut(data.initialDate, data.untilDate) / 24;
    const idGenerate = employeeId ?? userId;
    const URL = `/reports/user/${idGenerate}?initial=${data.initialDate}&until=${data.untilDate}&status=DONE`;
    axiosInstance.get(URL).then(res => {
      const { projects, attendance, licencesFee } = res.data;
      const { firstName, lastName, dni, phone, degree } = res.data.user.profile;
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
      excelReport(projects, infoData, attendance, licencesFee);
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
            label="Porcentaje de Adelanto:"
            {...register('porcentageValue', {
              required: 'Este campo es obligatorio',
              validate: { validateWhiteSpace, validatePorcentage },
              valueAsNumber: true,
            })}
            name="porcentageValue"
            type="number"
            placeholder="Porcentaje de Adelanto"
            errors={errors}
          />
        </div>

        <Input
          label="Concepto:"
          {...register('concept', {
            required: 'Este campo es obligatorio',
            validate: { validateWhiteSpace },
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
