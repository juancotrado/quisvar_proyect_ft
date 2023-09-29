/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEvent, useEffect, useState } from 'react';
import { axiosInstance } from '../../../../services/axiosInstance';
import { Input, PDFGenerator } from '../../..';
import InputFile from '../../Input/InputFile';
import { SubmitHandler, useForm } from 'react-hook-form';
import Button from '../../button/Button';
import {
  MessageType,
  MessageTypeImbox,
  PdfDataProps,
  // UserRoleType,
  quantityType,
} from '../../../../types/types';
import { RootState } from '../../../../store';
import { useSelector } from 'react-redux';
import ChipFileMessage from '../cardRegisterMessage/ChipFileMessage';
import { Editor } from '@tinymce/tinymce-react';
import {
  HashFile,
  addFilesList,
  deleteFileOnList,
  radioOptions,
} from '../../../../utils/files/files.utils';
import './cardRegisterMessageForward.css';
import formatDate from '../../../../utils/formatDate';
import {
  convertToDynamicObject,
  dataInitialPdf,
} from '../../../../utils/pdfReportFunctions';
import useListUsers from '../../../../hooks/useListUsers';
import { validateWhiteSpace } from '../../../../utils/customValidatesForm';

interface MessageSendType {
  title: string;
  header: string;
  description?: string;
  receiverId: number;
  idMessageReply?: number;
  idMessageResend?: number;
  type: MessageTypeImbox;
}
const YEAR = new Date().getFullYear();

const parseDate = (date: Date) =>
  formatDate(new Date(date), {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

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

  const addFiles = (newFiles: File[]) => {
    const _files = addFilesList(fileUploadFiles, newFiles);
    setFileUploadFiles(_files);
  };

  const deleteFiles = (delFiles: File) => {
    const _files = deleteFileOnList(fileUploadFiles, delFiles);
    if (_files) setFileUploadFiles(_files);
  };

  const handleChangeRadio = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    const countFile = quantityFiles?.find(file => file.type === value);
    const newIndex = (countFile ? countFile._count.type : 0) + 1;
    const newTitleValue = `${value} N°${newIndex} DHYRIUM-${HashUser}-${YEAR}`;
    setValue('title', newTitleValue);
  };

  const onSubmit: SubmitHandler<MessageSendType> = async data => {
    const values = {
      ...data,
      messageId: message.id,
      receiverId: sender.id,
    };
    const headers = {
      'Content-type': 'multipart/form-data',
    };
    const formData = new FormData();
    fileUploadFiles.forEach(_file => formData.append('fileMail', _file));
    formData.append('data', JSON.stringify(values));
    axiosInstance
      .post(`/mail/reply?status=RECHAZADO`, formData, { headers })
      .then(onSave);
  };

  const sender = message.users.filter(user => user.type === 'SENDER')[0].user;
  const handleArchiverMessage = () => {
    axiosInstance.patch(`/mail/archived/${message.id}`).then(onSave);
  };
  useEffect(() => {
    const header = watch('header');
    const description = watch('description');
    const title = watch('title');
    const to = sender.profile.firstName + ' ' + sender.profile.lastName;
    const toUser = users.find(user => user.id === sender?.id);
    setpdfData({
      from: userSession.profile.firstName + ' ' + userSession.profile.lastName,
      header,
      body: convertToDynamicObject(description ?? ''),
      title,
      to,
      date: formatDate(new Date(), {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour12: true,
      }),
      toDegree: toUser?.degree,
      toPosition: toUser?.position,
      dni: userSession.profile.dni,
      fromDegree: userSession.profile.degree,
      fromPosition: userSession.profile.description,
    });
  }, [watch('description'), watch('header'), watch('title')]);
  return (
    <form
      className="inbox-forward-data-content"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="inbox-forward-type-container">
        {radioOptions.map(radio => (
          <label
            key={radio.value}
            htmlFor={radio.id}
            className="imbox-type-send"
          >
            <input
              id={radio.id}
              className="imbox-input-radio"
              {...register('type')}
              onChange={handleChangeRadio}
              value={radio.value}
              type="radio"
              name={radio.name}
              required
            />
            {radio.id === 'Coordinación' ? `Hoja de ${radio.id}` : radio.id}
          </label>
        ))}
      </div>
      <div className="inbox-forward-receiver-container">
        <div className="inbox-receiver-container-info">
          <span>Para:</span>
          <span className="inbox-receiver-forward-chip">
            {sender.profile.lastName} {sender.profile.firstName}
          </span>
        </div>
        {/* <Button
          type="button"
          text="Cc"
          className="inbox-copy-button"
          // onClick={handleAddCopy}
        /> */}
        {/* {receiver && (
          )} */}
      </div>
      <label className="imbox-input-title">
        Asunto:
        <Input
          {...register('header', { validate: { validateWhiteSpace } })}
          errors={errors}
          className="imbox-input-content"
          name="header"
          type="text"
        />
      </label>
      <label className="imbox-input-title">
        Fecha:<span>{parseDate(new Date())}</span>
      </label>
      <div className="inbox-editor-container">
        <Editor
          // initialValue={initialValueEditor}
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
      <InputFile
        className="inbox-forward-file-area"
        getFilesList={files => addFiles(files)}
      />
      <PDFGenerator data={pdfData} />
      <div className="inbox-forward-btn-submit-container">
        <Button
          className={`inbox-forward-btn-submit`}
          // onClick={() => {}}
          text="No Procede"
        />
        {['SUPER_ADMIN', 'ASSISTANT'].includes(userSession.role) && (
          <Button
            onClick={() => handleArchiverMessage}
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
