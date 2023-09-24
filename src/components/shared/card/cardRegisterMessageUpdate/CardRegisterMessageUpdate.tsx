/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEvent, useEffect, useState } from 'react';
import { axiosInstance } from '../../../../services/axiosInstance';
import { Input } from '../../..';
import InputFile from '../../Input/InputFile';
import { SubmitHandler, useForm } from 'react-hook-form';
import Button from '../../button/Button';
import { MessageType, quantityType } from '../../../../types/types';
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
import './cardRegisterMessageUpdate.css';
import formatDate from '../../../../utils/formatDate';

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

const parseDate = (date: Date) =>
  formatDate(new Date(date), {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

interface CardRegisterMessageUpdateProps {
  message: MessageType;
  receiverId?: number;
  quantityFiles?: quantityType[] | null;
}

const CardRegisterMessageUpdate = ({
  message,
  quantityFiles,
}: CardRegisterMessageUpdateProps) => {
  const { userSession } = useSelector((state: RootState) => state);
  const { lastName, firstName } = userSession.profile;
  const { handleSubmit, register, setValue } = useForm<MessageSendType>();
  const [fileUploadFiles, setFileUploadFiles] = useState<File[]>([]);
  const HashUser = HashFile(`${firstName} ${lastName}`);

  const handleInputChange = (event: string) => setValue('description', event);

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

  const handleChangeRadio = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    const countFile = quantityFiles?.find(file => file.type === value);
    const newIndex = (countFile ? countFile._count.type : 0) + 1;
    const newTitleValue = `${value} N°${newIndex} DHYRIUM-${HashUser}-${YEAR}`;
    setValue('title', newTitleValue);
  };

  const onSubmit: SubmitHandler<MessageSendType> = async data => {
    const messageId = message.id;
    const headers = {
      'Content-type': 'multipart/form-data',
    };
    const formData = new FormData();
    fileUploadFiles.forEach(_file => formData.append('fileMail', _file));
    formData.append('data', JSON.stringify(data));
    // formData.append('senderId', `${senderId}`);
    axiosInstance
      .put(`/mail/${messageId}`, formData, { headers })
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
  };

  const sender = message.users.filter(user => user.type === 'RECEIVER')[0].user;

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
            className={`imbox-type-send inbox-radio-not-allowed inbox-update-radio-type-${
              message.type === radio.value && 'choose'
            }`}
          >
            <input
              id={radio.id}
              {...register('type')}
              onChange={handleChangeRadio}
              value={radio.value}
              type="radio"
              disabled
              name={radio.name}
            />
            {radio.id === 'Coordinación' ? `Hoja de ${radio.id}` : radio.id}
          </label>
        ))}
      </div>
      <div className="inbox-forward-receiver-container inbox-radio-not-allowed">
        <div className="inbox-receiver-container-info">
          <span>Para:</span>
          <span className="inbox-receiver-forward-chip">
            {sender.profile.lastName} {sender.profile.firstName}
          </span>
        </div>
      </div>
      <label className="imbox-input-title">
        Asunto:
        <Input
          {...register('header')}
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
