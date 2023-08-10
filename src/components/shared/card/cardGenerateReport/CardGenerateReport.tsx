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

const CardGenerateReport = () => {
  const {
    handleSubmit,
    register,
    // setValue,
    reset,
    formState: { errors },
  } = useForm();

  const showModal = () => {
    reset({});
    isOpenModal$.setSubject = false;
  };
  const onSubmit: SubmitHandler<any> = values => {
    reset();
    console.log(values);
  };
  return (
    <Modal size={50}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card-generate-report"
        autoComplete="off"
      >
        <h2>Generar Reporte</h2>
        <span className="close-add-card" onClick={showModal}>
          <img src="/svg/close.svg" alt="pencil" />
        </span>
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
        <Input
          label="Gerente de estudios:"
          {...register('manager', {
            required: 'Este campo es obligatorio',
            validate: { validateWhiteSpace, validateCorrectTyping },
          })}
          name="manager"
          type="text"
          placeholder="Nombre del gerente"
          errors={errors}
        />
        <Input
          label="Usuario asignado:"
          {...register('user', {
            required: 'Este campo es obligatorio',
            validate: { validateWhiteSpace, validateCorrectTyping },
          })}
          name="user"
          type="text"
          placeholder="Nombre del usuario"
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
            {...register('percentage', {
              required: 'Este campo es obligatorio',
              validate: { validateWhiteSpace, validateCorrectTyping },
            })}
            name="percentage"
            type="number"
            placeholder="Nombre Corto "
            errors={errors}
          />
        </div>
        <TextArea
          label="Titulo del Informe:"
          {...register('title', {
            required: 'Este campo es obligatorio',
            validate: { validateWhiteSpace, validateCorrectTyping },
          })}
          name="title"
          placeholder="Titulo del proyecto"
          errors={errors}
        />
        <Button type="submit" text="Generar" className="send-button" />
      </form>
    </Modal>
  );
};

export default CardGenerateReport;
