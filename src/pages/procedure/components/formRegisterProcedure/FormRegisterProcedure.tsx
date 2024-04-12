import { ChangeEvent, useEffect, useState } from 'react';
import { MessageSendType, ProcedureSubmit, Office } from '../../../../types';
import { components } from 'react-select';

import './formRegisterProcedure.css';
import { useTitleProcedure } from '../../hooks';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import {
  Contact,
  RADIO_OPTIONS,
  ToData,
  TypeProcedure,
  userSelect,
} from '../../models';
import { procedureDocument } from '../../pdfGenerator';
import {
  isOpenCardGenerateReport$,
  isOpenViewHtmlToPdf$,
} from '../../../../services/sharingSubject';
import { TYPE_PROCEDURE } from '../../pages/paymentProcessing/models';
import {
  AdvancedSelect,
  Button,
  IconAction,
  Input,
  Select,
} from '../../../../components';
import { getHtmlPdfBlob, validateWhiteSpace } from '../../../../utils';
import { Editor } from '@tinymce/tinymce-react';
import { ChipFileDownLoadProcedure, DocumentProcedure } from '..';
import { axiosInstance } from '../../../../services/axiosInstance';
import { OptionProps } from 'react-select';

interface FormRegisterProcedureProps {
  type: TypeProcedure;
  submit: (data: ProcedureSubmit) => void;
  initValueEditor?: string;
  showReportBtn?: boolean;
  showAddUser?: boolean;
}
const FormRegisterProcedure = ({
  type,
  submit,
  initValueEditor = '',
  showReportBtn = false,
  showAddUser = true,
}: FormRegisterProcedureProps) => {
  const [isAddReceiver, setIsAddReceiver] = useState(false);
  // const [listCopy, setListCopy] = useState<receiverType[]>([]);
  const [contacts, setContacts] = useState<null | Contact[]>(null);
  const [secondaryContacts, setSecondaryContacts] = useState<
    null | userSelect[]
  >(null);
  const urlQuantity =
    type === 'payProcedure'
      ? '/paymail/imbox/quantity'
      : '/mail/imbox/quantity';
  const { handleTitle } = useTitleProcedure(urlQuantity);
  const [fileUploadFiles, setFileUploadFiles] = useState<File[]>([]);

  const { profile } = useSelector((state: RootState) => state.userSession);
  const handleAddCopy = () => {
    setIsAddReceiver(!isAddReceiver);
  };
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    control,
    trigger,
    formState: { errors },
  } = useForm<MessageSendType>();

  useEffect(() => {
    getContacs();
  }, []);

  const getContacs = () => {
    const url = `/office?menuId=${2}&typeRol=MOD&subMenuId=${
      TYPE_PROCEDURE[type]
    }`;
    const secondaryContacts: userSelect[] = [];
    axiosInstance.get<Office[]>(url).then(res => {
      const contacts = res.data
        .map(el => {
          const users = el.users.map(({ user }) => ({
            value: 'user-' + user.id,
            label: user.profile.firstName + ' ' + user.profile.lastName,
            ...user,
          }));
          secondaryContacts.push(...users);
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
      setSecondaryContacts(secondaryContacts);
    });
  };

  //funcion futura para que el reporte se agrega auntomaticamente
  // const handleIsOpen = useRef<Subscription>(new Subscription());

  // useEffect(() => {
  //   handleIsOpen.current = isGenerateExcelReport$.getSubject.subscribe(
  //     blobExcel => {
  //       if (!blobExcel) return;
  //       fetch(blobExcel)
  //         .then(response => response.blob())
  //         .then(blob => {
  //           const file = new File([blob], 'nombre_del_archivo.xlsx');
  //           addFiles?.([file]);
  //         })
  //         .catch(error => console.error('Error al cargar el blob:', error));
  //     }
  //   );
  //   return () => {
  //     handleIsOpen.current.unsubscribe();
  //   };
  // }, []);
  // const handleReceiverUser = (usersId: number[]) => {
  //   const findUsers = usersId.map(userId => {
  //     const receiverUser = listUser.find(({ id }) => id === userId);
  //     if (!receiverUser) return;
  //     const { name, degree, position, job } = receiverUser;
  //     return { name, degree, position, job };
  //   });
  //   const filterUser = findUsers.filter(user => !!user) as ToData[];
  //   return filterUser;
  // };

  const getHtmlString = (size: 'a4' | 'a5') => {
    const {
      description,
      header,
      title,
      signature,
      receiver,
      secondaryReceiver,
    } = watch();
    const isArea = receiver.value.includes('area');
    let toProfile!: ToData;
    if (isArea && 'manager' in receiver) {
      const { profile } = receiver.manager;
      toProfile = {
        name: profile.firstName + ' ' + profile.lastName,
        degree: profile.degree,
        position: profile.description,
        job: profile.job,
      };
    } else if ('profile' in receiver) {
      toProfile = {
        name: receiver.label,
        degree: receiver.profile.degree,
        position: receiver.profile.description,
        job: receiver.profile.job,
      };
    }
    const ccProfiles =
      secondaryReceiver?.map(receiver => {
        if ('profile' in receiver) {
          return {
            name: receiver.label,
            degree: receiver.profile.degree,
            position: receiver.profile.description,
            job: receiver.profile.job,
          };
        }
      }) ?? [];
    let filteredCcProfiles = ccProfiles.filter(
      profile => profile !== undefined
    ) as ToData[];

    const htmlString = procedureDocument({
      title,
      subject: header,
      body: description ?? '',
      toProfile,
      ccProfiles: filteredCcProfiles,
      fromProfile: profile,
      size,
      type,
      signature: !!signature,
    });
    return htmlString;
  };
  const downLoadPdf = async (size: 'a4' | 'a5') => {
    const isValid = await trigger();
    if (!isValid) return;
    const htmlString = getHtmlString(size);
    if (!htmlString) return;
    isOpenViewHtmlToPdf$.setSubject = {
      isOpen: true,
      fileNamePdf: watch('title'),
      htmlString,
      size,
    };
  };

  const handleInputChange = (event: string) => setValue('description', event);

  const onSubmit: SubmitHandler<MessageSendType> = async data => {
    const secondaryReceiver =
      data.secondaryReceiver?.map(receiver => ({
        userId: receiver.id,
      })) ?? [];
    const htmlString = getHtmlString('a4');
    const blobData = await getHtmlPdfBlob(htmlString, 'a4');

    const isArea = data.receiver.value.includes('area');
    if (!htmlString || !data.receiver) return;
    const values = {
      ...data,
      secondaryReceiver,
      receiverId: !isArea ? data.receiver.id : undefined,
      officeId: isArea ? data.receiver.id : undefined,
      title: watch('title'),
      description: htmlString,
    };
    submit({ values, fileUploadFiles, mainFile: blobData });
  };
  const showCardReport = () => {
    isOpenCardGenerateReport$.setSubject = true;
  };
  const getPdfA5 = async () => {
    const formData = new FormData();
    const htmlString = getHtmlString('a4');
    const blobData = await getHtmlPdfBlob(htmlString, 'a4');
    formData.append('file', blobData);
    axiosInstance
      .post('/generate-pdf/two-pages', formData, { responseType: 'blob' })
      .then(res => {
        isOpenViewHtmlToPdf$.setSubject = {
          isOpen: true,
          fileNamePdf: watch('title'),
          pdfBlob: res.data,
        };
      });
  };
  const downloadOptions = [
    {
      id: 1,
      handleClick: getPdfA5,
      iconOne: 'file-download',
      iconTwo: 'file-download-white',
      text: 'A5',
    },
    {
      id: 2,
      handleClick: () => downLoadPdf('a4'),
      iconOne: 'file-download',
      iconTwo: 'file-download-white',
      text: 'A4',
    },
  ];
  const handleChangeTitle = ({ target }: ChangeEvent<HTMLSelectElement>) => {
    const { options, selectedIndex } = target;
    const title = handleTitle(options[selectedIndex].text);
    setValue('title', title);
  };
  const typeProcedure = TYPE_PROCEDURE[type];
  const Option = (props: OptionProps<any>) => {
    const { data, isSelected } = props;
    const isArea = data.value.includes('area');
    return (
      <components.Option {...props}>
        <div className="AdvancedSelectCrud-option">
          <span
            style={{
              marginRight: '8px',
              display: 'flex',
              gap: 5,
              alignItems: 'center',
            }}
            className={`formRegisterProcedure-text-${isArea ? 'area' : 'user'}`}
          >
            {isArea && (
              <IconAction
                size={2}
                icon={isSelected ? 'office-white' : 'office'}
                position="none"
              />
            )}
            {!isArea && '- '} {data.label}
          </span>

          {isArea && (
            <span className="formRegisterProcedure-count-office">
              {data.quantity}
            </span>
          )}
        </div>
      </components.Option>
    );
  };
  // const usersSelect = contacts.map(user => ({
  //   value: user.id,
  //   label: user.name,
  // }));

  return (
    <form className="imbox-data-content" onSubmit={handleSubmit(onSubmit)}>
      {watch('title') && (
        // <h3 className="messagePage-type-document">{watch('title')}</h3>
        <Input
          {...register('title', { validate: { validateWhiteSpace } })}
          errors={errors}
          placeholder="Asunto"
          name="title"
          styleInput={2}
          type="text"
        />
      )}
      <div className="messagePage-input-contain">
        <Select
          {...register('type', {
            validate: { validateWhiteSpace },
          })}
          onChange={handleChangeTitle}
          name="type"
          data={RADIO_OPTIONS}
          itemKey="id"
          textField="value"
          errors={errors}
          placeholder="Tipo de Documento"
          styleVariant="secondary"
        />

        {type !== 'comunication' && contacts && (
          <Controller
            control={control}
            name="receiver"
            rules={{ required: 'Debes seleccionar una opción' }}
            render={({ field: { onChange } }) => (
              <AdvancedSelect
                placeholder="Dirigida a"
                options={contacts}
                components={{ Option }}
                isClearable
                errors={errors}
                name="receiver"
                onChange={onChange}
              />
            )}
          />
        )}
        {(watch('receiver') || type === 'comunication') && showAddUser && (
          <Button
            type="button"
            text={typeProcedure.addUsersText}
            className="inbox-copy-button"
            onClick={handleAddCopy}
          />
        )}
      </div>

      {isAddReceiver && secondaryContacts && (
        <div className="imbox-receiver-container-copy">
          <span className="imbox-receiver-label">
            {typeProcedure.addUsersText}:{' '}
          </span>
          <Controller
            control={control}
            name="secondaryReceiver"
            rules={{
              required: isAddReceiver && 'Debes seleccionar una opción',
            }}
            render={({ field: { onChange } }) => (
              <AdvancedSelect
                placeholder="Dirigida a"
                options={secondaryContacts}
                isClearable
                errors={errors}
                isMulti
                name="secondaryReceiver"
                onChange={onChange}
              />
            )}
          />
        </div>
      )}
      <Input
        {...register('header', { validate: { validateWhiteSpace } })}
        errors={errors}
        placeholder="Asunto"
        name="header"
        styleInput={2}
        type="text"
      />
      <Editor
        initialValue={initValueEditor}
        init={{
          min_height: 500,
          paste_data_images: false,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen checklist',
            'insertdatetime media table paste code help wordcount',
          ],
          toolbar:
            'undo redo | formatselect | bold italic | table\
          alignleft aligncenter alignright alignjustify | \
          bullist numlist outdent indent | removeformat | code',
        }}
        onEditorChange={handleInputChange}
      />
      <div className="messageRegister-options">
        <label className="messageRegister-check-container">
          <input
            type="checkbox"
            {...register('signature', {
              value: false,
            })}
          />
          Firma
        </label>
        {showReportBtn && (
          <div className="messageRegister-report" onClick={showCardReport}>
            <IconAction icon="clip-icon" position="none" />
            <span>Adjuntar reporte</span>
          </div>
        )}

        <div className="pdf-btn-area-view">
          {downloadOptions.map(
            ({ iconOne, iconTwo, id, handleClick, text }) => (
              <ChipFileDownLoadProcedure
                key={id}
                text={text}
                iconOne={iconOne}
                iconTwo={iconTwo}
                onClick={handleClick}
              />
            )
          )}
        </div>
      </div>

      <DocumentProcedure getFilesList={files => setFileUploadFiles(files)} />
      <Button type="submit" text="Enviar" styleButton={4} />
    </form>
  );
};

export default FormRegisterProcedure;
