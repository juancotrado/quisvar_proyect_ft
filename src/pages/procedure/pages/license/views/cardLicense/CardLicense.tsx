import { useContext, useEffect, useRef, useState } from 'react';
import './CardLicense.css';
import { Subscription } from 'rxjs';
import { isOpenCardLicense$ } from '../../../../../../services/sharingSubject';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  Input,
  TextArea,
  Modal,
  Button,
  CloseIcon,
} from '../../../../../../components';
import { axiosInstance } from '../../../../../../services/axiosInstance';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../store';
import { DataLicense, licenseList } from '../../../../../../types';
import { SocketContext } from '../../../../../../context';

interface CardLicenseProps {
  onSave?: () => void;
}

const CardLicense = ({ onSave }: CardLicenseProps) => {
  const { id: userSessionId } = useSelector(
    (state: RootState) => state.userSession
  );
  const socket = useContext(SocketContext);
  const [isOpen, setIsOpen] = useState(false);
  const [option, setOption] = useState<boolean>(true);
  const [selectedValue, setSelectedValue] = useState<string>('Salida de campo');
  const handleIsOpen = useRef<Subscription>(new Subscription());
  const [data, setData] = useState<licenseList>();
  const [isFree, setIsFree] = useState<string | undefined>('');
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
      setIsFree(value.type);
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
      if (data.type === 'SALIDA') {
        setSelectedValue(data.reason as string);
        setOption(true);
      } else {
        setOption(false);
      }
    }
  }, [data, setValue]);

  const showModal = () => {
    reset({});
    setIsOpen(false);
  };
  const onSubmit: SubmitHandler<DataLicense> = values => {
    if (!data) {
      if (isFree === 'free') {
        const sendFree = {
          reason: values.reason,
          startDate: values.startDate,
          untilDate: values.untilDate,
          type: 'PERMISO',
        };
        axiosInstance.post(`license/free`, sendFree).then(() => {
          setIsOpen(false);
          reset({});
          onSave?.();
        });
      } else {
        const send = {
          reason: option
            ? selectedValue === 'Otro'
              ? values.reason
              : selectedValue
            : values.reason,
          startDate: values.startDate,
          untilDate: values.untilDate,
          type: option ? 'SALIDA' : 'PERMISO',
        };
        axiosInstance
          .post(`license`, { usersId: userSessionId, ...send })
          .then(() => {
            setIsOpen(false);
            reset({});
            onSave?.();
          });
      }
    } else {
      const updateLicense = {
        reason: option
          ? selectedValue === 'Otro'
            ? values.reason
            : selectedValue
          : values.reason,
        startDate: values.startDate,
        untilDate: values.untilDate,
        type: option ? 'SALIDA' : 'PERMISO',
        usersId: userSessionId,
        feedback: data.feedback,
        status: 'PROCESO',
      };
      axiosInstance.patch(`/license/${data.id}`, updateLicense).then(() => {
        setIsOpen(false);
        reset({});
        onSave?.();
        socket.emit('client:action-button');
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
        {!isFree && (
          <div className="cl-options">
            <button
              type="button"
              className={`cl-span ${option && 'cl-selected'}`}
              onClick={() => setOption(true)}
              disabled={data && data?.type === 'SALIDA'}
            >
              <img src="/public/svg/cl-route.svg" />
              <h2 className={`clo-text ${option && 'cl-color'}`}>
                Hoja de ruta
              </h2>
            </button>
            <button
              type="button"
              className={`cl-span ${!option && 'cl-selected'}`}
              onClick={() => setOption(false)}
              disabled={data && data?.type === 'PERMISO'}
            >
              <img src="/public/svg/cl-card.svg" />
              <h2 className={`clo-text ${!option && 'cl-color'}`}>Licencia</h2>
            </button>
          </div>
        )}
        <div className="report-title">
          <h2 className="r-title">
            {!isFree
              ? 'Nueva solicitud de licencia'
              : 'Asignar dia libre para todos'}
          </h2>
        </div>
        <CloseIcon onClick={showModal} />
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
        {!isFree && option ? (
          <div className="cl-radios">
            <div className="cl-label">
              <Input
                type="radio"
                value="PERMISO"
                classNameMain="attendanceList-radio"
                checked={selectedValue === 'Salida de campo'}
                onChange={() => setSelectedValue('Salida de campo')}
              />
              <h1 className="cl-text">Salida de campo</h1>
            </div>
            <div className="cl-label">
              <Input
                type="radio"
                value="PERMISO"
                classNameMain="attendanceList-radio"
                checked={selectedValue === 'Tramite documentario'}
                onChange={() => setSelectedValue('Tramite documentario')}
              />
              <h1 className="cl-text">Tramite documentario</h1>
            </div>
            <div className="cl-label">
              <Input
                type="radio"
                value="PERMISO"
                classNameMain="attendanceList-radio"
                checked={selectedValue === 'Otro'}
                onChange={() => setSelectedValue('Otro')}
                // disabled={isActive ? true : !!status}
              />
              <h1 className="cl-text">Otro</h1>
            </div>
            {selectedValue === 'Otro' && (
              <div className="cl-label">
                <Input
                  placeholder="Especifique"
                  {...register('reason')}
                  required
                />
              </div>
            )}
          </div>
        ) : (
          <TextArea label="Motivo" {...register('reason')} name="reason" />
        )}
        <Button type="submit" text="Enviar" styleButton={4} />
      </form>
    </Modal>
  );
};

export default CardLicense;
