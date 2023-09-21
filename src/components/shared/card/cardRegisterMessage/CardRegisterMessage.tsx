import React, { useEffect, useMemo, useState } from 'react';
import { axiosInstance } from '../../../../services/axiosInstance';
import { Input, TextArea } from '../../..';
import InputFile from '../../Input/InputFile';
import { SubmitHandler, useForm } from 'react-hook-form';
import useListUsers from '../../../../hooks/useListUsers';
import Button from '../../button/Button';
import DropDownSimple from '../../select/DropDownSimple';
import { UserRoleType } from '../../../../types/types';
import { RootState } from '../../../../store';
import { useSelector } from 'react-redux';
import './cardRegisterMessage.css';

interface MessageSendType {
  title: string;
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
// const InitialValues: MessageSendType = {
//   title: '',
//   description: '',
//   receiverId: 0,
//   type: 'INFORME',
// };

const CardRegisterMessage = () => {
  const { users } = useListUsers(RolePerm);
  const [quantityFiles, setQuantityFiles] = useState<quantityType[] | null>(
    null
  );
  const { userSession } = useSelector((state: RootState) => state);
  const [receiver, setReceiver] = useState<receiverType | null>(null);
  const { handleSubmit, register, setValue } = useForm<MessageSendType>();
  const [fileUploadFiles, setFileUploadFiles] = useState<File[]>([]);
  const contacts = useMemo(
    () => users.filter(user => user.id !== userSession.id),
    [userSession, users]
  );
  const { lastName, firstName } = userSession.profile;

  const HashUser = Hash(`${firstName} ${lastName}`);
  const Year = new Date().getFullYear();

  useEffect(() => {
    getQuantityServices();
  }, []);

  const getQuantityServices = () =>
    axiosInstance
      .get('/mail/imbox/quantity')
      // .then(res => console.log(res.data));
      .then(res => setQuantityFiles(res.data));

  const handleChangeRadio = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    const countFile = quantityFiles?.find(file => file.type === value);
    const newIndex = (countFile ? countFile._count.type : 0) + 1;
    const newTitleValue = `${value} N°${newIndex} ${HashUser}-${Year}`;
    setValue('title', newTitleValue);
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
      senderId: userSession.id,
      receiverId: receiver?.id,
    };
    console.log(values);
  };
  return (
    <div className="imbox-send-container-main">
      <div className="imnbox-title">
        <h3>Nuevo Trámite</h3>
        <img className="imbox-close-icon" src="/svg/close.svg" alt="close" />
      </div>
      <form className="imbox-data-content" onSubmit={handleSubmit(onSubmit)}>
        <div className="imbox-receiver-container">
          <span className="imbox-receiver-label">Dirigido a: </span>
          <div className="imbox-receiver-choice-dropdown">
            {receiver ? (
              <div className="imbox-receiver-chip">
                <span>{receiver.value}</span>
                <img
                  className="imbox-receiver-chip-icon-close "
                  onClick={() => setReceiver(null)}
                  src="/svg/circle-xmark-solid.svg"
                />
              </div>
            ) : (
              <DropDownSimple
                classNameInput="imbox-receiver-choice-dropdown-input"
                type="search"
                data={contacts}
                textField="name"
                itemKey="id"
                selector
                droper
                valueInput={(value, id) => setReceiver({ id: +id, value })}
              />
            )}
          </div>
        </div>
        <span>
          Tipo de Documento <span style={{ color: 'red' }}>*</span>
        </span>
        <div className="imbox-type-container">
          <label htmlFor="carta" className="imbox-type-send">
            <input
              className="imbox-input-radio"
              {...register('type')}
              id="carta"
              onChange={handleChangeRadio}
              value="CARTA"
              type="radio"
              name="type"
            />
            Carta
          </label>
          <label htmlFor="informe" className="imbox-type-send">
            <input
              className="imbox-input-radio"
              {...register('type')}
              onChange={handleChangeRadio}
              id="informe"
              value="INFORME"
              type="radio"
              name="type"
            />
            Informe
          </label>
          <label htmlFor="memorandum" className="imbox-type-send">
            <input
              className="imbox-input-radio"
              {...register('type')}
              onChange={handleChangeRadio}
              id="memorandum"
              value="MEMORANDUM"
              type="radio"
              name="type"
            />
            Memorandum
          </label>
        </div>
        <label className="imbox-input-title">
          Asunto:
          <Input
            {...register('title')}
            className="imbox-input-content"
            name="title"
            type="text"
            disabled
          />
        </label>
        <TextArea
          className="imbox-text-area-description"
          placeholder="Redacte su mensaje aqui"
          {...register('description')}
          name="description"
        />
        {fileUploadFiles && fileUploadFiles.length && (
          <div>
            {fileUploadFiles.map((file, i) => (
              <div key={i} onClick={() => deleteFiles(file)}>
                {file.name} {file.size}
              </div>
            ))}
          </div>
        )}
        <InputFile getFilesList={files => addFiles(files)} />
        <Button type="submit" text="Enviar" />
      </form>
    </div>
  );
};

export default CardRegisterMessage;