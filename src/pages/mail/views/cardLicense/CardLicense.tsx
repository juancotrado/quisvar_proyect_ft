import { useEffect, useRef, useState } from 'react';
import './CardLicense.css';
import { Subscription } from 'rxjs';
import { isOpenCardLicense$ } from '../../../../services/sharingSubject';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Input, TextArea, Modal, Button } from '../../../../components';
import { axiosInstance } from '../../../../services/axiosInstance';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { licenseList } from '../../../../types';

type DataLicense = {
  reason: string;
  startDate: string;
  untilDate: string;
};

interface CardLicenseProps {
  onSave?: () => void;
}

const CardLicense = ({ onSave }: CardLicenseProps) => {
  const { userSession } = useSelector((state: RootState) => state);
  const [isOpen, setIsOpen] = useState(false);
  const handleIsOpen = useRef<Subscription>(new Subscription());
  const [data, setData] = useState<licenseList>();
  const [type, setType] = useState<string | undefined>('');
  const formattedDate = (value: string) => {
    const parts = value.split(':');
    const result = parts.slice(0, 2).join(':');
    return result;
  };
  // console.log(data);

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    // formState: { errors },
  } = useForm<DataLicense>();
  useEffect(() => {
    handleIsOpen.current = isOpenCardLicense$.getSubject.subscribe(value => {
      setIsOpen(value.isOpen);
      setData(value.data);
      setType(value.type);
    });
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, []);
  useEffect(() => {
    if (data) {
      setValue('startDate', formattedDate(data?.startDate));
      setValue('untilDate', formattedDate(data?.untilDate));
      setValue('reason', data.reason ?? '');
    }
  }, [data, setValue]);

  const showModal = () => {
    reset({});
    setIsOpen(false);
  };
  const onSubmit: SubmitHandler<DataLicense> = values => {
    if (!data) {
      if (type === 'free') {
        axiosInstance.post(`license/free`, values).then(() => {
          setIsOpen(false);
          reset({});
          onSave?.();
        });
      } else {
        axiosInstance
          .post(`license`, { usersId: userSession.id, ...values })
          .then(() => {
            setIsOpen(false);
            reset({});
            onSave?.();
          });
      }
    } else {
      const updateLicense = {
        reason: values.reason,
        startDate: new Date(values.startDate),
        untilDate: new Date(values.untilDate),
        usersId: userSession.id,
        feedback: data.feedback,
        status: 'PROCESS',
      };
      axiosInstance.patch(`/license/${data.id}`, updateLicense).then(() => {
        setIsOpen(false);
        reset({});
        onSave?.();
      });
    }
  };

  const formatDateAndHours = () => {
    const today = new Date();
    const desplazamientoZonaHoraria = today.getTimezoneOffset();
    const fechaSinZonaHoraria = new Date(
      today.getTime() - desplazamientoZonaHoraria * 60000
    );
    return fechaSinZonaHoraria.toISOString().slice(0, 16);
  };

  return (
    <Modal size={50} isOpenProp={isOpen}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card-generate-report"
        autoComplete="off"
      >
        <div className="report-title">
          <h2>Nueva solicitud de licencia</h2>
        </div>
        <span className="close-add-card" onClick={showModal}>
          <img src="/svg/close.svg" alt="pencil" />
        </span>
        <div className="col-input">
          <Input
            label="Fecha y hora de salida:"
            {...register('startDate')}
            name="startDate"
            type="datetime-local"
            min={formatDateAndHours()}
            required
          />
          <Input
            label="Fecha y hora de retorno:"
            {...register('untilDate')}
            name="untilDate"
            type="datetime-local"
            min={formatDateAndHours()}
            required
          />
        </div>
        <TextArea label="Motivo" {...register('reason')} name="reason" />
        <Button type="submit" text="Enviar" className="send-button" />
      </form>
    </Modal>
  );
};

export default CardLicense;
