import { useMemo, useState } from 'react';
import {
  MessageSendType,
  ProcedureSubmit,
  receiverType,
} from '../../../../types';
import { useTitleProcedure } from '../../hooks';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useListUsers } from '../../../../hooks';
import { RADIO_OPTIONS, ToData, TypeProcedure } from '../../models';
import { procedureDocument } from '../../pdfGenerator';
import {
  isOpenCardGenerateReport$,
  isOpenViewHtmlToPdf$,
} from '../../../../services/sharingSubject';
import { TYPE_PROCEDURE } from '../../pages/paymentProcessing/models';
import {
  Button,
  DropDownSimple,
  IconAction,
  Input,
  Select,
} from '../../../../components';
import { validateWhiteSpace } from '../../../../utils';
import { Editor } from '@tinymce/tinymce-react';
import { ChipFileDownLoadProcedure, DocumentProcedure } from '..';

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
  const [receiver, setReceiver] = useState<receiverType | null>(null);
  const [isAddReceiver, setIsAddReceiver] = useState(false);
  const [listCopy, setListCopy] = useState<receiverType[]>([]);
  const { handleTitle } = useTitleProcedure('/paymail/imbox/quantity');
  const [fileUploadFiles, setFileUploadFiles] = useState<File[]>([]);

  const { profile, id: userSessionId } = useSelector(
    (state: RootState) => state.userSession
  );
  const handleAddCopy = () => {
    setIsAddReceiver(true);
  };
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MessageSendType>();
  const { users: listUser } = useListUsers(
    'MOD',
    'tramites',
    'tramite-regular'
  );
  const contacts = useMemo(
    () =>
      listUser.filter(
        user => user.id !== userSessionId && user.id !== receiver?.id
      ),
    [userSessionId, listUser, receiver]
  );
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
  const handleReceiverUser = (usersId: number[]) => {
    const findUsers = usersId.map(userId => {
      const receiverUser = listUser.find(({ id }) => id === userId);
      if (!receiverUser) return;
      const { name, degree, position } = receiverUser;
      return { name, degree, position };
    });
    const filterUser = findUsers.filter(user => !!user) as ToData[];
    return filterUser;
  };

  const getHtmlString = (size: 'a4' | 'a5') => {
    const idUserReceiver = listCopy.map(user => user.id);
    const { description, header, type } = watch();
    const usersReceiver = handleReceiverUser([
      +(receiver?.id || 0),
      ...idUserReceiver,
    ]);
    const [toProfile, ...ccProfiles] = usersReceiver;
    const htmlString = procedureDocument({
      title: handleTitle(type),
      subject: header,
      body: description ?? '',
      toProfile,
      ccProfiles,
      fromProfile: profile,
      size,
      type: 'comunication',
    });
    return htmlString;
  };
  const downLoadPdf = (size: 'a4' | 'a5') => {
    const htmlString = getHtmlString(size);
    if (!htmlString) return;
    isOpenViewHtmlToPdf$.setSubject = {
      isOpen: true,
      fileNamePdf: handleTitle(watch('type')),
      htmlString,
      size,
    };
  };

  const handleAddUser = (user: receiverType) => {
    const getId = listCopy.find(list => list.id == user.id);
    if (!getId) setListCopy([...listCopy, user]);
  };

  const handleRemoveUser = (user: receiverType) => {
    const filterValue = listCopy.filter(list => list.id !== user.id);
    if (!filterValue.length) setIsAddReceiver(false);
    setListCopy(filterValue);
  };
  const handleInputChange = (event: string) => setValue('description', event);

  const onSubmit: SubmitHandler<MessageSendType> = async data => {
    const secondaryReceiver = listCopy.map(list => ({ userId: list.id }));
    const htmlString = getHtmlString('a4');
    if (!htmlString || !receiver) return;
    const values = {
      ...data,
      secondaryReceiver,
      receiverId: receiver.id,
      title: handleTitle(watch('type')),
      description: htmlString,
    };
    submit({ values, fileUploadFiles });
  };
  const showCardReport = () => {
    isOpenCardGenerateReport$.setSubject = true;
  };
  const downloadOptions = [
    {
      id: 1,
      handleClick: () => downLoadPdf('a5'),
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
  const typeProcedure = TYPE_PROCEDURE[type];
  return (
    <form className="imbox-data-content" onSubmit={handleSubmit(onSubmit)}>
      {watch('type') && (
        <h3 className="messagePage-type-document">
          {handleTitle(watch('type'))}
        </h3>
      )}
      <div className="messagePage-input-contain">
        <Select
          {...register('type', {
            validate: { validateWhiteSpace },
          })}
          name="type"
          data={RADIO_OPTIONS}
          itemKey="id"
          textField="value"
          errors={errors}
          placeholder="Tipo de Documento"
          className="messagePage-input"
        />
        {type !== 'comunication' && (
          <div className="imbox-receiver-choice-dropdown">
            <DropDownSimple
              classNameInput="messagePage-input"
              type="search"
              data={contacts}
              textField="name"
              itemKey="id"
              placeholder="Dirigido a"
              selector
              droper
              valueInput={(value, id) => setReceiver({ id: +id, value })}
              required
            />
          </div>
        )}
        {(receiver || type === 'comunication') && showAddUser && (
          <Button
            type="button"
            text={typeProcedure.addUsersText}
            className="inbox-copy-button"
            onClick={handleAddCopy}
          />
        )}
      </div>

      {isAddReceiver && (
        <div className="imbox-receiver-container-copy">
          <span className="imbox-receiver-label">
            {typeProcedure.addUsersText}:{' '}
          </span>
          {listCopy.map(list => (
            <div className="imbox-receiver-chip" key={list.id}>
              <span className="imbox-receiver-chip-name">{list.value}</span>
              <img
                className="imbox-receiver-chip-icon-close "
                onClick={() => handleRemoveUser(list)}
                src="/svg/circle-xmark-solid.svg"
              />
            </div>
          ))}
          <DropDownSimple
            classNameInput="messagePage-input"
            type="search"
            data={contacts}
            placeholder="Buscar...."
            textField="name"
            itemKey="id"
            droper
            valueInput={(value, id) => handleAddUser({ id: +id, value })}
          />
        </div>
      )}
      <Input
        {...register('header', { validate: { validateWhiteSpace } })}
        errors={errors}
        className="messagePage-input"
        placeholder="Asunto"
        name="header"
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
