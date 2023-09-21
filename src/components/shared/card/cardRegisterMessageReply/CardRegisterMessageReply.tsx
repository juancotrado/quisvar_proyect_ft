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

interface MessageSendType {
  title: string;
  header: string;
  description?: string;
  receiverId: number;
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
  const { users } = useListUsers(RolePerm);
  const receiverUser = users.find(us => us.id === receiverId);
  const listUser = receiverUser ? [receiverUser, ...users] : users;
  const contacts = useMemo(
    () => listUser.filter(user => user.id !== userSession.id),
    [userSession, listUser]
  );

  useEffect(() => {
    setValue('title', `Respuesta a Solicitud de ${message.type}`);
    setValue('header', message.title);
    setValue('type', message.type);
  }, [message]);

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
      receiverId,
      idMessageReply,
      idMessageResend,
    };
    const headers = {
      'Content-type': 'multipart/form-data',
    };
    const formData = new FormData();
    fileUploadFiles.forEach(_file => formData.append('fileMail', _file));
    formData.append('data', JSON.stringify(values));
    formData.append('senderId', `${senderId}`);
    // axiosInstance
    //   .post(`/mail`, formData, { headers })
    //   .then(res => console.log(res.data));
  };
  return (
    <div className="imbox-send-container-main">
      <form className="imbox-data-content" onSubmit={handleSubmit(onSubmit)}>
        <div className="imbox-data-details-title">
          <label className="imbox-input-title">
            <Input
              {...register('title')}
              className="imbox-input-content not-allowed bold"
              name="title"
              defaultValue={`Respuesta a Solicitud de ${message.type}`}
              type="text"
              disabled
            />
          </label>
          <label className="imbox-input-title ">
            <Input
              {...register('header')}
              className="imbox-input-content not-allowed subtitle"
              name="title"
              type="text"
              defaultValue={message.title}
              disabled
            />
          </label>
        </div>
        <TextArea
          className="imbox-text-area-description"
          placeholder="Redacte su mensaje aqui"
          {...register('description')}
          name="description"
        />
        {fileUploadFiles && (
          <div className="imbox-container-file-list">
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
          className="imbox-file-area"
          getFilesList={files => addFiles(files)}
        />
        <DropDownSimple
          classNameInput="imbox-receiver-choice-dropdown-input"
          type="search"
          data={contacts}
          textField="name"
          itemKey="id"
          selector
          droper
          // valueInput={(value, id) => setReceiver({ id: +id, value })}
        />
        <div className="imbox-btn-submit-container">
          <Button className="imbox-btn-submit" type="submit" text="Enviar" />
        </div>
      </form>
    </div>
  );
};

export default CardRegisterMessageReply;
