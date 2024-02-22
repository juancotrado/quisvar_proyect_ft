import { useMemo, useState } from 'react';
import { axiosInstance } from '../../../../../../../../services/axiosInstance';
import {
  Input,
  Select,
  Button,
  DropDownSimple,
} from '../../../../../../../../components';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useListUsers } from '../../../../../../../../hooks';
import {
  MessageType,
  MessageTypeImbox,
  PdfDataProps,
  quantityType,
} from '../../../../../../../../types';
import { RootState } from '../../../../../../../../store';
import { useSelector } from 'react-redux';
import './cardRegisterMessageReply.css';
import { Editor } from '@tinymce/tinymce-react';
import {
  HashFile,
  radioOptions,
  formatDate,
  convertToDynamicObject,
  dataInitialPdf,
  validateWhiteSpace,
} from '../../../../../../../../utils';
import { PDFGenerator } from '../../../../pdfGenerate';
import { JOB_DATA } from '../../../../../../../userCenter/pages/users/models';
import DocumentProcedure from '../../../../../../components/documentProcedure/DocumentProcedure';

interface MessageSendType {
  title: string;
  header: string;
  description?: string;
  receiverId: number;
  idMessageReply?: number;
  idMessageResend?: number;
  type: MessageTypeImbox;
}
type receiverType = { id: number; value: string };

const YEAR = new Date().getFullYear();

interface CardRegisterMessageReplyProps {
  message: MessageType;
  senderId?: number;
  quantityFiles?: quantityType[] | null;
  onSave?: () => void;
}

const CardRegisterMessageReply = ({
  message,
  senderId,
  quantityFiles,
  onSave,
}: CardRegisterMessageReplyProps) => {
  const { userSession } = useSelector((state: RootState) => state);
  const { lastName, firstName } = userSession.profile;
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MessageSendType>();
  const [fileUploadFiles, setFileUploadFiles] = useState<File[]>([]);
  const { users } = useListUsers('MOD', 'tramites', 'tramite-de-pago');

  const HashUser = HashFile(`${firstName} ${lastName}`);
  const [receiver, setReceiver] = useState<receiverType | null>(null);
  const [pdfData, setpdfData] = useState<PdfDataProps>(dataInitialPdf);

  const contacts = useMemo(
    () =>
      users &&
      users.filter(user => user.id !== userSession.id && user.id !== senderId),
    [userSession, users, senderId]
  );

  const handleInputChange = (event: string) => {
    setValue('description', event);
  };

  const handleTitle = (value: string) => {
    const countFile = quantityFiles?.find(file => file.type === value);
    const newIndex = (countFile ? countFile._count.type : 0) + 1;
    return `${value} N°${newIndex} DHYRIUM-${HashUser}-${YEAR}`;
  };
  const onSubmit: SubmitHandler<MessageSendType> = async data => {
    const values = {
      ...data,
      paymessageId: message.id,
      receiverId: receiver?.id,
      title: handleTitle(watch('type')),
    };
    const headers = {
      'Content-type': 'multipart/form-data',
    };
    const formData = new FormData();
    fileUploadFiles.forEach(_file => formData.append('fileMail', _file));
    formData.append('data', JSON.stringify(values));
    if (receiver)
      axiosInstance
        .post(`/paymail/reply?status=PROCESO`, formData, { headers })
        .then(onSave);
  };

  // const handleDoneMessage = () => {
  //   axiosInstance.patch(`/paymail/done/${message.id}`).then(onSave);
  // };
  const handleReportPDF = () => {
    const header = watch('header');
    const description = watch('description');
    const to = receiver?.value ?? '';
    const toUser = users.find(user => user.id === receiver?.id);
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
            valueInput={(value, id) => {
              setReceiver({ id: +id, value });
            }}
            required
            // otherFunction={handleReportPDF}
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

      <div className="inbox-reply-btn-submit-container">
        <Button className={`inbox-reply-btn-submit`} text="Procede" />
      </div>
    </form>
  );
};

export default CardRegisterMessageReply;
