import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Subscription } from 'rxjs';
import './CardCompany.css';
import { isOpenCardCompany$ } from '../../../../services/sharingSubject';
import {
  Input,
  Modal,
  Button,
  ButtonDelete,
  CloseIcon,
} from '../../../../components';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Companies, CompaniesForm } from '../../../../types';
import { axiosInstance } from '../../../../services/axiosInstance';
import {
  normalizeFileName,
  validateJPGExtension,
  validateRuc,
} from '../../../../utils';

type CardCompanyProps = {
  onSave?: () => void;
};
const CardCompany = ({ onSave }: CardCompanyProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<Companies>();
  const [hasId, setHasId] = useState<number>();
  const handleIsOpen = useRef<Subscription>(new Subscription());
  const {
    register,
    handleSubmit,
    // setValue,
    reset,
    // watch,
    formState: { errors },
  } = useForm<CompaniesForm>();

  const formattedDate = (value: string) => {
    const parts = value.split('T');
    return parts[0];
  };

  const closeFunctions = () => {
    setHasId(undefined);
    setIsOpen(false);
    reset({});
    // onSave?.();
  };
  useEffect(() => {
    handleIsOpen.current = isOpenCardCompany$.getSubject.subscribe(value => {
      setIsOpen(value.isOpen);
      setHasId(value.id);
    });
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, []);
  const onSubmit: SubmitHandler<CompaniesForm> = values => {
    const headers = {
      'Content-type': 'multipart/form-data',
    };
    const img = values.img?.[0];
    const formData = new FormData();
    if (!hasId) {
      formData.append('img', img ?? '');
      formData.append('name', values.name);
      formData.append('ruc', values.ruc);
      formData.append('manager', values.manager);
      formData.append('address', values.address);
      formData.append('departure', values.departure);
      if (values.inscription) {
        formData.append('inscription', values.inscription.toString());
      }
      if (values.activities) {
        formData.append('activities', values.activities.toString());
      }
      if (values.SEE) {
        formData.append('SEE', values.SEE.toString());
      }
      formData.append('CCI', values.CCI);
      formData.append('description', values.description);

      axiosInstance.post(`/companies`, formData, { headers }).then(() => {
        closeFunctions();
        onSave?.();
      });
    } else {
      const newData: Partial<Companies> = {
        name: values.name,
        manager: values.manager,
        ruc: values.ruc,
        address: values.address,
        departure: values.departure,
      };
      if (values.inscription) {
        newData.inscription = values.inscription.toString();
      }

      if (values.activities) {
        newData.activities = values.activities.toString();
      }

      if (values.SEE) {
        newData.SEE = values.SEE.toString();
      }
      axiosInstance.patch(`/companies/${hasId}`, newData).then(() => {
        closeFunctions();
        onSave?.();
      });
    }
  };
  useEffect(() => {
    if (hasId) getCompany();
  }, [hasId]);
  const getCompany = () => {
    axiosInstance
      .get<Companies>(`/companies/information/${hasId}`)
      .then(res => {
        setData(res.data);
        reset({
          name: res.data.name,
          manager: res.data.manager,
          ruc: res.data.ruc,
          address: res.data.address,
          description: res.data.description,
          departure: res.data.departure,
          activities: formattedDate(res.data.activities as string),
          inscription: formattedDate(res.data.inscription as string),
          SEE: formattedDate(res.data.SEE as string),
          CCI: res.data.CCI,
        });
      });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target;
    const img = fileInput.files?.[0];
    const formData = new FormData();
    formData.append('img', img ?? '');
    const headers = {
      'Content-type': 'multipart/form-data',
    };
    axiosInstance
      .patch(`/companies/img/${hasId}`, formData, { headers })
      .then(() => {
        getCompany(), onSave?.();
      });
  };

  return (
    <Modal size={50} isOpenProp={isOpen}>
      <form onSubmit={handleSubmit(onSubmit)} className="card-company">
        <CloseIcon onClick={closeFunctions} />
        <h1>Registrar empresa</h1>
        <div className="company-col">
          <Input
            label="Empresa"
            {...register('name', { required: true })}
            name="name"
            errors={errors}
          />
          <Input
            label="Ruc"
            type="number"
            {...register('ruc', { validate: validateRuc })}
            name="ruc"
            errors={errors}
          />
        </div>
        <Input
          label="Gerente General"
          {...register('manager', { required: true })}
          name="manager"
          errors={errors}
        />
        <div className="company-col">
          <Input
            label="Domicilio fiscal"
            {...register('address', { required: true })}
            name="address"
            errors={errors}
          />
          <Input
            label="Nº de partida registral"
            {...register('departure', { required: true })}
            name="departure"
            errors={errors}
          />
        </div>
        <div className="company-col">
          <Input
            label="Fecha de inscripcion"
            type="date"
            {...register('inscription')}
            name="inscription"
            errors={errors}
          />
          <Input
            label="Inicio de actividades"
            type="date"
            {...register('activities')}
            name="activities"
            errors={errors}
            onChange={e => console.log(e.target.value)}
          />
        </div>
        <div className="company-col">
          <Input
            label="S.E.E."
            type="date"
            {...register('SEE')}
            name="SEE"
            errors={errors}
          />
          <Input label="CCI" {...register('CCI')} name="CCI" errors={errors} />
        </div>
        <div className="company-col">
          <Input
            label="Actividad economica"
            {...register('description')}
            name="description"
            errors={errors}
          />
          {hasId ? (
            data?.img ? (
              <div className="cc-img-area">
                <h4 className="cc-img-title">{normalizeFileName(data?.img)}</h4>
                <ButtonDelete
                  icon="trash"
                  className="role-delete-icon"
                  url={`/companies/img/${hasId}`}
                  type="button"
                  onSave={() => {
                    getCompany(), onSave?.();
                  }}
                />
              </div>
            ) : (
              <Input
                placeholder=""
                errors={errors}
                label="Imagen de la empresa"
                type="file"
                accept="image/jpeg, image/png, .svg"
                onChange={handleFileChange}
              />
            )
          ) : (
            <Input
              {...register('img', { validate: validateJPGExtension })}
              placeholder=""
              errors={errors}
              label="Imagen de la empresa"
              type="file"
            />
          )}
        </div>
        <Button
          text="Guardar"
          styleButton={3}
          type="submit"
          className="btn-area"
        />
      </form>
    </Modal>
  );
};

export default CardCompany;
