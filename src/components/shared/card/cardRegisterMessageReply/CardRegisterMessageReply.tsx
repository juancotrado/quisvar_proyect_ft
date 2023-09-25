import { ChangeEvent, useMemo, useState } from 'react';
import { axiosInstance } from '../../../../services/axiosInstance';
import { Input } from '../../..';
import InputFile from '../../Input/InputFile';
import { SubmitHandler, useForm } from 'react-hook-form';
import useListUsers from '../../../../hooks/useListUsers';
import Button from '../../button/Button';
import DropDownSimple from '../../select/DropDownSimple';
import {
  MessageType,
  UserRoleType,
  quantityType,
} from '../../../../types/types';
import { RootState } from '../../../../store';
import { useSelector } from 'react-redux';
import './cardRegisterMessageReply.css';
import ChipFileMessage from '../cardRegisterMessage/ChipFileMessage';
import { Editor } from '@tinymce/tinymce-react';
import formatDate from '../../../../utils/formatDate';
import { HashFile, radioOptions } from '../../../../utils/files/files.utils';

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

type receiverType = { id: number; value: string };

const YEAR = new Date().getFullYear();

const parseDate = (date: Date) =>
  formatDate(new Date(date), {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

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
  const { handleSubmit, register, setValue } = useForm<MessageSendType>();
  const [fileUploadFiles, setFileUploadFiles] = useState<File[]>([]);
  const { users } = useListUsers(RolePerm);
  const HashUser = HashFile(`${firstName} ${lastName}`);
  const [receiver, setReceiver] = useState<receiverType | null>(null);

  // const InitialValueEditor = `<p style="text-align: justify;" >Por medio del presente documento me dirijo a usted con la finalidad de hacerle llegar un cordial saludo, y al mismo tiempo comunicarle lo siguiente:</p><p>&nbsp;</p><p>&nbsp;</p><p style="text-align: center;">Atentamente, ${userSession.profile.lastName.toUpperCase()} ${userSession.profile.firstName.toUpperCase()} </p>`;

  const contacts = useMemo(
    () =>
      users.filter(user => user.id !== userSession.id && user.id !== senderId),
    [userSession, users, senderId]
  );

  const handleInputChange = (event: string) => {
    setValue('description', event);
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
  const handleChangeRadio = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    const countFile = quantityFiles?.find(file => file.type === value);
    const newIndex = (countFile ? countFile._count.type : 0) + 1;
    const newTitleValue = `${value} N°${newIndex} DHYRIUM-${HashUser}-${YEAR}`;
    setValue('title', newTitleValue);
    console.log(countFile);
  };
  const handleRemoveReceiver = () => setReceiver(null);
  const onSubmit: SubmitHandler<MessageSendType> = async data => {
    const values = {
      ...data,
      messageId: message.id,
      receiverId: receiver?.id,
    };
    const headers = {
      'Content-type': 'multipart/form-data',
    };
    const formData = new FormData();
    fileUploadFiles.forEach(_file => formData.append('fileMail', _file));
    formData.append('data', JSON.stringify(values));
    if (receiver)
      axiosInstance.post(`/mail/reply`, formData, { headers }).then(onSave);
  };

  const handleDoneMessage = () => {
    axiosInstance.patch(`/mail/done/${message.id}`).then(onSave);
  };

  return (
    <form
      className="inbox-reply-data-content"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="inbox-reply-type-container">
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
            />
            {radio.id === 'Coordinación' ? `Hoja de ${radio.id}` : radio.id}
          </label>
        ))}
      </div>
      <div className="inbox-reply-receiver-container">
        <div className="inbox-receiver-container-info">
          <span className="imbox-receiver-label">Para: </span>
          <div className="imbox-receiver-choice-dropdown">
            {receiver ? (
              <div className="imbox-receiver-chip">
                <span>{receiver.value}</span>
                <img
                  className="imbox-receiver-chip-icon-close "
                  onClick={handleRemoveReceiver}
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
        className="inbox-reply-file-area"
        getFilesList={files => addFiles(files)}
      />
      <div className="inbox-reply-btn-submit-container">
        <Button
          onClick={handleDoneMessage}
          className={`inbox-reply-btn-done`}
          type="button"
          text="Finalizar Tramite"
        />
        <Button
          className={`inbox-reply-btn-submit`}
          // onClick={() => {}}
          text="Procede"
        />
      </div>
    </form>
  );
};

export default CardRegisterMessageReply;
