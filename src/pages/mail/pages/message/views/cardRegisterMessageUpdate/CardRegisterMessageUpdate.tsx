/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from 'react';
import { axiosInstance } from '../../../../../../services/axiosInstance';
import {
  Input,
  Select,
  InputFile,
  Button,
  DropDownSimple,
} from '../../../../../../components';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  MessageType,
  PdfDataProps,
  quantityType,
  receiverType,
} from '../../../../../../types';
import { RootState } from '../../../../../../store';
import { useSelector } from 'react-redux';
import { Editor } from '@tinymce/tinymce-react';
import {
  HashFile,
  addFilesList,
  deleteFileOnList,
  radioOptions,
  validateWhiteSpace,
  formatDate,
  dataInitialPdf,
  convertToDynamicObject,
} from '../../../../../../utils';
import './cardRegisterMessageUpdate.css';
import { useListUsers } from '../../../../../../hooks';
import { PDFGenerator } from '../../../../pdfGenerate';
import { ChipFileMessage } from '../../../../components';
import { JOB_DATA } from '../../../../../UserList/models';

interface MessageSendType {
  title: string;
  header: string;
  description?: string;
  receiverId: number;
  idMessageReply?: number;
  idMessageResend?: number;
  type: MessageType['type'];
}
const YEAR = new Date().getFullYear();

interface CardRegisterMessageUpdateProps {
  message: MessageType;
  receiverId?: number;
  quantityFiles?: quantityType[] | null;
  onSave?: () => void;
}

const CardRegisterMessageUpdate = ({
  message,
  quantityFiles,
  // receiverId,
  onSave,
}: CardRegisterMessageUpdateProps) => {
  const { userSession } = useSelector((state: RootState) => state);
  const { users } = useListUsers();
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
  const contacts = useMemo(
    () => users?.filter(user => user.id !== userSession.id),
    [userSession, users]
  );
  useEffect(() => {
    setValue('header', message.header);
    setValue('title', message.title);
    setValue('description', message.description);
    setValue('type', message.type);
  }, [message]);

  const addFiles = (newFiles: File[]) => {
    const _files = addFilesList(fileUploadFiles, newFiles);
    setFileUploadFiles(_files);
  };

  const deleteFiles = (delFiles: File) => {
    const _files = deleteFileOnList(fileUploadFiles, delFiles);
    if (_files) setFileUploadFiles(_files);
  };

  const handleTitle = (value: string) => {
    const countFile = quantityFiles?.find(file => file.type === value);
    const newIndex = (countFile ? countFile._count.type : 0) + 1;
    return `${value} N°${newIndex} DHYRIUM-${HashUser}-${YEAR}`;
  };
  const onSubmit: SubmitHandler<MessageSendType> = async data => {
    if (!receiver) return;
    const messageId = message.id;
    const value = {
      ...data,
      receiverId: receiver.id,
      title: handleTitle(watch('type')),
    };
    const headers = {
      'Content-type': 'multipart/form-data',
    };
    const formData = new FormData();
    fileUploadFiles.forEach(_file => formData.append('fileMail', _file));
    formData.append('data', JSON.stringify(value));
    axiosInstance
      .put(`/paymail/${messageId}`, formData, { headers })
      .then(onSave);
  };

  const sender = message.users.filter(user => user.type === 'SENDER')[0].user;
  const handleReportPDF = () => {
    const header = watch('header');
    const description = watch('description');
    const to = sender.profile.firstName + ' ' + sender.profile.lastName;
    const toUser = users.find(user => user.id === sender?.id);
    const filterJob = (value?: string, job?: string) => {
      if (value !== 'Titulado') value;
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
    <form
      className="inbox-forward-data-content"
      onSubmit={handleSubmit(onSubmit)}
    >
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
          initialValue={message.description}
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
      <div className="message-file-add">
        <h4 className="message-add-document">Agregar Documentos:</h4>
        <InputFile
          className="message-file-area"
          getFilesList={files => addFiles(files)}
        />
        {fileUploadFiles && (
          <div className="inbox-container-file-grid">
            {fileUploadFiles.map((file, i) => (
              <ChipFileMessage
                className="message-files-list"
                text={file.name}
                key={i}
                onClose={() => deleteFiles(file)}
              />
            ))}
          </div>
        )}
      </div>
      <div className="inbox-forward-btn-submit-container">
        <Button
          className={`inbox-forward-btn-submit`}
          // onClick={() => {}}
          text="Enviar"
        />
      </div>
    </form>
  );
};

export default CardRegisterMessageUpdate;
