/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from 'react';
import { axiosInstance } from '../../../../services/axiosInstance';
import { Input, PDFGenerator, Select } from '../../..';
import InputFile from '../../Input/InputFile';
import { SubmitHandler, useForm } from 'react-hook-form';
import Button from '../../button/Button';
import {
  MessageType,
  MessageTypeImbox,
  PdfDataProps,
  // UserRoleType,
  quantityType,
  receiverType,
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
import { motion } from 'framer-motion';
import Portal from '../../../portal/Portal';
import { dropIn } from '../../../../animations/animations';
import DropDownSimple from '../../select/DropDownSimple';
import { SnackbarUtilities } from '../../../../utils/SnackbarManager';

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

// const parseDate = (date: Date) =>
//   formatDate(new Date(date), {
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//   });

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
  const [isAlertOpen, setIsAlertOpen] = useState(false);
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
    if (!receiver)
      return SnackbarUtilities.warning(
        'Asegurese de seleccioner el destinatario.'
      );
    const values = {
      ...data,
      messageId: message.id,
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
      .post(`/mail/reply?status=RECHAZADO`, formData, { headers })
      .then(onSave);
  };
  const sender = message.users.filter(user => user.type === 'SENDER')[0].user;
  const handleArchiverMessage = () => {
    axiosInstance.patch(`/mail/archived/${message.id}`).then(onSave);
  };

  const handleReportPDF = () => {
    const header = watch('header');
    const description = watch('description');
    const to = sender.profile.firstName + ' ' + sender.profile.lastName;
    const toUser = users.find(user => user.id === sender?.id);
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
      toDegree: toUser?.degree,
      toPosition: toUser?.position,
      dni: userSession.profile.dni,
      fromDegree: userSession.profile.degree,
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
        <Button className={`inbox-forward-btn-submit`} text="No Procede" />
        {['SUPER_ADMIN'].includes(userSession.role) && (
          <Button
            onClick={() => setIsAlertOpen(true)}
            className={`inbox-forward-btn-archiver`}
            type="button"
            text="Archivar Tramite"
          />
        )}
      </div>
      {isAlertOpen && (
        <Portal wrapperId="modal">
          <div
            className="alert-modal-main"
            role="dialog"
            onClick={() => setIsAlertOpen(false)}
          >
            <motion.div
              className="alert-modal-children"
              variants={dropIn}
              onClick={e => e.stopPropagation()}
              initial="hidden"
              animate="visible"
              exit="leave"
            >
              <span
                className="close-icon"
                onClick={() => setIsAlertOpen(false)}
              >
                <img src="/svg/close.svg" alt="pencil" />
              </span>
              <>
                <img src="/svg/folder-icon.svg" className="alert-modal-trash" />
                <h3>¿Estas seguro que desea archivar este trámite?</h3>
                <div className="container-btn">
                  <Button
                    text="Cancelar"
                    onClick={() => setIsAlertOpen(false)}
                    className="modal-btn-cancel"
                  />
                  <Button
                    text="Confirmar"
                    onClick={handleArchiverMessage}
                    className="modal-btn-confirm"
                  />
                </div>
              </>
            </motion.div>
          </div>
        </Portal>
      )}
    </form>
  );
};

export default CardRegisterMessageForward;
