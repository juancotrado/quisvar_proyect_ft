import { useMemo, useState } from 'react';
import { axiosInstance } from '../../../../../../../../services/axiosInstance';
import {
  Input,
  Select,
  DropDownSimple,
  Button,
} from '../../../../../../../../components';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  MessageType,
  PdfDataProps,
  quantityType,
  receiverType,
} from '../../../../../../../../types';
import { RootState } from '../../../../../../../../store';
import { useSelector } from 'react-redux';
import { Editor } from '@tinymce/tinymce-react';
import {
  HashFile,
  radioOptions,
  convertToDynamicObject,
  dataInitialPdf,
  validateWhiteSpace,
  SnackbarUtilities,
  formatDate,
} from '../../../../../../../../utils';
import './cardRegisterMessageForward.css';
import { useListUsers, useRole } from '../../../../../../../../hooks';
import { PDFGenerator } from '../../../../pdfGenerate';
import { JOB_DATA } from '../../../../../../../userCenter/pages/users/models';
import { MessageSendType, YEAR } from '../../models';
import DocumentProcedure from '../../../../../../components/documentProcedure/DocumentProcedure';
import { isOpenConfirmAction$ } from '../../../../../../../../services/sharingSubject';

interface CardRegisterMessageForwardProps {
  message: MessageType;
  quantityFiles?: quantityType[] | null;
  onSave?: () => void;
}
const CardRegisterMessageForward = ({
  message,
  quantityFiles,
  onSave,
}: CardRegisterMessageForwardProps) => {
  const { userSession } = useSelector((state: RootState) => state);
  const { users } = useListUsers('MOD', 'tramites', 'tramite-de-pago');
  const { hasAccess } = useRole('MOD', 'tramites', 'tramite-de-pago');
  const { lastName, firstName } = userSession.profile;
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MessageSendType>();
  const [fileUploadFiles, setFileUploadFiles] = useState<File[]>([]);
  const HashUser = HashFile(`${firstName} ${lastName}`);
  const [pdfData, setpdfData] = useState<PdfDataProps>(dataInitialPdf);
  const handleInputChange = (event: string) => setValue('description', event);
  const [receiver, setReceiver] = useState<receiverType | null>(null);
  const usersId = message.users
    .filter(user => user.role !== 'SECONDARY')
    .map(user => user.userId);
  const contacts = useMemo(
    () =>
      users?.filter(
        user => usersId.includes(user.id) && user.id !== userSession.id
      ),
    [userSession, users]
  );

  const handleTitle = (value: string) => {
    const countFile = quantityFiles?.find(file => file.type === value);
    const newIndex = (countFile ? countFile._count.type : 0) + 1;
    return `${value} N°${newIndex} DHYRIUM-${HashUser}-${YEAR}`;
  };
  const onSubmit: SubmitHandler<MessageSendType> = async data => {
    if (!receiver)
      return SnackbarUtilities.warning(
        'Asegurese de seleccioner el destinatario.'
      );
    const values = {
      ...data,
      paymessageId: message.id,
      receiverId: receiver.id,
      title: handleTitle(watch('type')),
    };
    const headers = {
      'Content-type': 'multipart/form-data',
    };
    const formData = new FormData();
    fileUploadFiles.forEach(_file => formData.append('fileMail', _file));
    formData.append('data', JSON.stringify(values));
    axiosInstance
      .post(`/paymail/reply?status=RECHAZADO`, formData, { headers })
      .then(onSave);
  };
  const sender = message.users.filter(user => user.type === 'SENDER')[0].user;
  const handleArchiverMessage = () => {
    axiosInstance.patch(`/paymail/archived/${message.id}`).then(onSave);
  };

  const handleReportPDF = () => {
    const header = watch('header');
    const description = watch('description');
    const to = sender.profile.firstName + ' ' + sender.profile.lastName;
    const toUser = users.find(user => user.id === sender?.id);
    const filterJob = (value?: string, job?: string) => {
      if (value !== 'Titulado') return value;
      return JOB_DATA.filter(item => item.value === job)[0].abrv;
    };
    setpdfData({
      from: userSession.profile.firstName + ' ' + userSession.profile.lastName,
      header,
      body: convertToDynamicObject(description ?? ''),
      title: handleTitle(watch('type')),
      to,
      date: formatDate(new Date(), {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour12: true,
      }),
      toDegree: filterJob(toUser?.degree, toUser?.job),
      toPosition: toUser?.position,
      dni: userSession.profile.dni,
      fromDegree: filterJob(
        userSession.profile.degree,
        userSession.profile.job
      ),
      fromPosition: userSession.profile.description,
    });
  };

  const handleArchiver = () => {
    isOpenConfirmAction$.setSubject = {
      isOpen: true,
      function: () => handleArchiverMessage,
    };
  };
  return (
    <form className="messagePage-send-mail" onSubmit={handleSubmit(onSubmit)}>
      {watch('type') && (
        <h3 className="messagePage-type-document">
          {' '}
          {handleTitle(watch('type'))}
        </h3>
      )}

      <div className="messagePage-input-contain">
        <Select
          {...register('type', {
            validate: { validateWhiteSpace },
          })}
          name="type"
          data={radioOptions}
          itemKey="id"
          textField="value"
          errors={errors}
          placeholder="Tipo de Documento"
          className="messagePage-input"
        />
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
      </div>
      <Input
        {...register('header', { validate: { validateWhiteSpace } })}
        errors={errors}
        className="messagePage-input"
        placeholder="Asunto"
        name="header"
        type="text"
      />
      <div className="inbox-editor-container">
        <Editor
          init={{
            height: '100%',
            resize: false,
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
      </div>

      <PDFGenerator data={pdfData} handleFocus={handleReportPDF} />
      <DocumentProcedure getFilesList={files => setFileUploadFiles(files)} />

      <div className="inbox-forward-btn-submit-container">
        <Button className={`inbox-forward-btn-submit`} text="No Procede" />
        {hasAccess && (
          <Button
            onClick={handleArchiver}
            className={`inbox-forward-btn-archiver`}
            type="button"
            text="Archivar Tramite"
          />
        )}
      </div>
    </form>
  );
};

export default CardRegisterMessageForward;
