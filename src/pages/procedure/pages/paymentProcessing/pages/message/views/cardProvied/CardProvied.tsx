import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ProviedForm } from '../../models';
import './cardProvied.css';
import {
  AdvancedSelect,
  Button,
  Input,
} from '../../../../../../../../components';
import {
  validateOnlyNumbers,
  validateWhiteSpace,
} from '../../../../../../../../utils';
import { useEffect, useState } from 'react';
import { Contact, TypeProcedure } from '../../../../../../models';
import { TYPE_PROCEDURE } from '../../../../models';
import { axiosInstance } from '../../../../../../../../services/axiosInstance';
import { MessageType, Office } from '../../../../../../../../types';
import { OptionSelectProcedure } from '../../../../../../components/optionSelectProcedure';
import { DocumentProcedure } from '../../../../../../components';
import { useNavigate } from 'react-router-dom';
import { isOpenViewHtmlToPdf$ } from '../../../../../../../../services/sharingSubject';

interface CardProviedProps {
  type: TypeProcedure;
  message: MessageType;
}

const CardProvied = ({ type, message }: CardProviedProps) => {
  const [contacts, setContacts] = useState<null | Contact[]>(null);
  const [fileUploadFiles, setFileUploadFiles] = useState<File[]>([]);
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    watch,
    trigger,
    control,
    formState: { errors },
  } = useForm<ProviedForm>();

  useEffect(() => {
    getContacs();
  }, []);
  const getContacs = () => {
    const url = `/office?menuId=${2}&typeRol=MOD&subMenuId=${
      TYPE_PROCEDURE[type]
    }`;
    axiosInstance.get<Office[]>(url).then(res => {
      const contacts = res.data
        .map(el => {
          const users = el.users.map(({ user }) => ({
            value: 'user-' + user.id,
            label: user.profile.firstName + ' ' + user.profile.lastName,
            isDisabled: true,
            ...user,
          }));
          const area = {
            value: 'area-' + el.id,
            id: el.id,
            label: el.name,
            quantity: el._count.users,
            manager: el.manager!,
          };
          const userWithArea = [area, ...users];
          return userWithArea;
        })
        .flat();
      setContacts(contacts);
    });
  };

  const handlePreview = async () => {
    const isValid = await trigger();
    if (!isValid) return;
    const { title, numberPage, observations, to } = watch();
    const formData = new FormData();

    const body = {
      title,
      header: title,
      officeId: to.id,
      observations,
      numberPage,
      to: to.label,
    };
    formData.append('data', JSON.stringify(body));

    axiosInstance
      .post(
        `/generate-pdf/${TYPE_PROCEDURE[type].previewPdf}/${message.id}`,
        formData,
        {
          responseType: 'blob',
        }
      )
      .then(res => {
        isOpenViewHtmlToPdf$.setSubject = {
          isOpen: true,
          fileNamePdf: watch('title'),
          pdfBlob: res.data,
        };
      });
  };
  const onSubmit: SubmitHandler<ProviedForm> = async data => {
    const { title, numberPage, observations, to } = data;
    const body = {
      title,
      header: title,
      officeId: to.id,
      [TYPE_PROCEDURE[type].idName]: message.id,
      observations,
      numberPage,
      to: to.label,
    };
    const formData = new FormData();

    fileUploadFiles.forEach(file => formData.append('fileMail', file));

    formData.append('data', JSON.stringify(body, null, 3));

    await axiosInstance.post(
      `/${TYPE_PROCEDURE[type].provied}/reply-seal`,
      formData
    );
    navigate('/tramites/tramite-de-pago?refresh=' + Date.now());
  };

  return (
    <form className="cardProvied" onSubmit={handleSubmit(onSubmit)}>
      <div className="messagePage-input-contain">
        <Input
          {...register('title', {
            validate: { validateWhiteSpace },
            value: message.title,
          })}
          errors={errors}
          label="Titulo:"
          placeholder="Titulo"
          styleInput={2}
          disabled
        />
        <Input
          {...register('numberPage', {
            validate: { validateWhiteSpace, validateOnlyNumbers },
            valueAsNumber: true,
            value: message.office?.quantity,
          })}
          errors={errors}
          label="Númeracion:"
          placeholder="Númeracion"
          styleInput={2}
        />
      </div>
      {contacts && (
        <Controller
          control={control}
          name="to"
          rules={{ required: 'Debes seleccionar una opción' }}
          render={({ field }) => (
            <AdvancedSelect
              {...field}
              placeholder="Selecione una opción"
              options={contacts}
              components={{ Option: OptionSelectProcedure }}
              isClearable
              label={'Para:'}
              errors={errors}
              isOptionDisabled={option => !!option?.isDisabled}
            />
          )}
        />
      )}
      <Input
        {...register('observations', { validate: { validateWhiteSpace } })}
        errors={errors}
        label="Observaciones:"
        placeholder="Observaciones"
        maxLength={95}
        styleInput={2}
      />
      <DocumentProcedure getFilesList={files => setFileUploadFiles(files)} />

      <div className="cardProvied-btns-container">
        <Button
          type="button"
          text="Previsualizar"
          icon="eyes-blue"
          styleButton={1}
          onClick={handlePreview}
        />
        <Button
          type="submit"
          text="Enviar"
          styleButton={4}
          style={{ margin: 0 }}
        />
      </div>
    </form>
  );
};

export default CardProvied;
