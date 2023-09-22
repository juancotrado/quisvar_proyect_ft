/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react';
import { axiosInstance } from '../../../../services/axiosInstance';
import { Input, TextArea } from '../../..';
import InputFile from '../../Input/InputFile';
import { SubmitHandler, useForm } from 'react-hook-form';
import useListUsers from '../../../../hooks/useListUsers';
import Button from '../../button/Button';
import DropDownSimple from '../../select/DropDownSimple';
import { MessageType, UserRoleType } from '../../../../types/types';
import { RootState } from '../../../../store';
import { useSelector } from 'react-redux';
import './cardRegisterMessageReply.css';
import ChipFileMessage from '../cardRegisterMessage/ChipFileMessage';
import { Editor } from '@tinymce/tinymce-react';

interface MessageSendType {
  title: string;
  header: string;
  description?: string;
  receiverId: number;
  idMessageReply?: number;
  idMessageResend?: number;
  type: 'INFORME' | 'MEMORANDUM' | 'CARTA';
}
const RolePerm: UserRoleType[] = ['SUPER_ADMIN', 'ADMIN', 'SUPER_MOD', 'MOD'];

const Hash = (name: string) => {
  const newValue = name.split(' ');
  const parseValue = newValue.map(value => value.slice(0, 1).toUpperCase());
  return parseValue.join('');
};
type quantityType = {
  type: 'INFORME' | 'MEMORANDUM' | 'CARTA';
  _count: { type: number };
};
type receiverType = { id: number; value: string };

interface CardRegisterMessageReplyProps {
  message: MessageType;
  receiverId?: number;
  senderId: number;
  idMessageReply?: number;
  idMessageResend?: number;
}

const CardRegisterMessageReply = ({
  message,
  receiverId,
  senderId,
  idMessageReply,
  idMessageResend,
}: CardRegisterMessageReplyProps) => {
  const { handleSubmit, register, setValue } = useForm<MessageSendType>();
  const [fileUploadFiles, setFileUploadFiles] = useState<File[]>([]);
  const { userSession } = useSelector((state: RootState) => state);
  const [isReply, setIsReply] = useState(false);
  const { users } = useListUsers(RolePerm);
  const receiverUser = users.filter(us => us.id === receiverId);

  useEffect(() => {
    setValue('title', `Respuesta a Solicitud de ${message.type}`);
    setValue('header', message.title);
    setValue('type', message.type);
  }, [message]);

  const InitialValueEditor = `<p style="text-align: justify;" >Por medio del presente documento me dirijo a usted con la finalidad de hacerle llegar un cordial saludo, y al mismo tiempo comunicarle lo siguiente:</p><p>&nbsp;</p><p>&nbsp;</p><p style="text-align: center;">Atentamente, ${userSession.profile.lastName.toUpperCase()} ${userSession.profile.firstName.toUpperCase()} </p>`;

  const contacts = useMemo(
    () =>
      users.filter(
        user => user.id !== userSession.id && user.id !== receiverId
      ),
    [userSession, users]
  );
  const [userPick, setUserPick] = useState<receiverType | null>(null);

  const handleInputChange = (event: string) => {
    console.log('<--------------------------------->');
    console.log(event);
  };

  const addFiles = (newFiles: File[]) => {
    if (!fileUploadFiles) return setFileUploadFiles(newFiles);
    const concatFiles = [...fileUploadFiles, ...newFiles];
    const uniqueFiles = Array.from(
      new Set(concatFiles.map(file => file.name))
    ).map(name => concatFiles.find(file => file.name === name)) as File[];
    setFileUploadFiles(uniqueFiles);
  };

  const deleteFiles = (delFiles: File) => {
    if (fileUploadFiles) {
      const newFiles = Array.from(fileUploadFiles).filter(
        file => file !== delFiles
      );
      if (!newFiles) return;
      setFileUploadFiles(newFiles);
    }
  };

  const onSubmit: SubmitHandler<MessageSendType> = async data => {
    const values = {
      ...data,
      senderId,
      receiverId: userPick?.id,
    };
    const headers = {
      'Content-type': 'multipart/form-data',
    };
    const formData = new FormData();
    fileUploadFiles.forEach(_file => formData.append('fileMail', _file));
    formData.append('data', JSON.stringify(values));
    formData.append('senderId', `${senderId}`);
    axiosInstance
      .post(`/mail`, formData, { headers })
      .then(res => console.log(res.data));
  };
  return (
    <div className="imbox-reply-send-container-main">
      <form
        className="imbox-reply-data-content"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="imbox-reply-data-details-title">
          <label className="imbox-reply-input-title">
            <Input
              {...register('title')}
              className="imbox-reply-input-content not-allowed bold"
              name="title"
              defaultValue={`Respuesta a Solicitud de ${message.type}`}
              type="text"
              disabled
            />
          </label>
          <label className="imbox-reply-input-title ">
            <Input
              {...register('header')}
              className="imbox-reply-input-content not-allowed subtitle"
              name="title"
              type="text"
              defaultValue={message.title}
              disabled
            />
          </label>
        </div>
        <Editor
          initialValue={InitialValueEditor}
          init={{
            min_height: 400,
            paste_data_images: false,
            font_size_classes: 'size-editor',
            menubar: false,
            plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen checklist',
              'insertdatetime media table paste code help wordcount autocorrect',
            ],
            toolbar:
              'undo redo | formatselect | bold italic | table\
              alignleft aligncenter alignright alignjustify | \
              bullist numlist outdent indent | removeformat | code',
          }}
          onEditorChange={handleInputChange}
        />
        {fileUploadFiles && (
          <div className="message-container-file-list">
            {fileUploadFiles.map((file, i) => (
              <ChipFileMessage
                text={file.name}
                key={i}
                onClose={() => deleteFiles(file)}
              />
            ))}
          </div>
        )}
        <InputFile
          className="imbox-reply-file-area"
          getFilesList={files => addFiles(files)}
        />
        <div className="imbox-reply-btn-submit-container">
          <Button
            className={`imbox-reply-btn-submit ${isReply && 'button-selected'}`}
            type="button"
            onClick={() => {
              setIsReply(true);
              setValue('idMessageResend', undefined);
              setValue('idMessageReply', message.id);
            }}
            text="Responder"
          />
          <Button
            onClick={() => {
              setIsReply(false);
              setValue('idMessageReply', undefined);
              setValue('idMessageResend', message.id);
            }}
            className={`imbox-reply-btn-submit ${
              !isReply && 'button-selected'
            }`}
            type="button"
            text="Reenviar"
          />
        </div>
        {isReply && (
          <div>
            <DropDownSimple
              classNameInput="imbox-reply-receiver-choice-dropdown-input"
              type="search"
              data={receiverUser}
              textField="name"
              itemKey="id"
              selector
              droper
              valueInput={(value, id) => setUserPick({ id: +id, value })}
              placeholder="Seleccionar usuario"
            />
          </div>
        )}
        {!isReply && (
          <div>
            <DropDownSimple
              placeholder="Seleccionar usuario"
              classNameInput="imbox-reply-receiver-choice-dropdown-input"
              type="search"
              data={contacts}
              textField="name"
              itemKey="id"
              selector
              droper
              valueInput={(value, id) => setUserPick({ id: +id, value })}
            />
          </div>
        )}
        <div className="imbox-reply-btn-submit-container">
          <Button className="imbox-reply-btn-submit" text="Enviar" />
        </div>
      </form>
    </div>
  );
};

export default CardRegisterMessageReply;
