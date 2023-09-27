import './cardRegisterMessage.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import InputFile from '../../Input/InputFile';
import useListUsers from '../../../../hooks/useListUsers';
import Button from '../../button/Button';
import DropDownSimple from '../../select/DropDownSimple';
import ChipFileMessage from './ChipFileMessage';
import {
  MessageSendType,
  PdfDataProps,
  UserRoleType,
  quantityType,
  receiverType,
} from '../../../../types/types';
import { RootState } from '../../../../store';
import { useSelector } from 'react-redux';
import { Editor } from '@tinymce/tinymce-react';
import { motion } from 'framer-motion';
import { InitialValueEditor } from '../../../../utils/canvas';
import { axiosInstance } from '../../../../services/axiosInstance';
import { Input, PDFGenerator } from '../../..';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  HashFile,
  addFilesList,
  deleteFileOnList,
  radioOptions,
} from '../../../../utils/files/files.utils';
import { useNavigate } from 'react-router-dom';
import formatDate from '../../../../utils/formatDate';
import {
  convertToObject,
  dataInitialPdf,
  getTextParagraph,
} from '../../../../utils/pdfReportFunctions';
import {
  isGenerateExcelReport$,
  isOpenCardGenerateReport$,
} from '../../../../services/sharingSubject';
import { Subscription } from 'rxjs';

const YEAR = new Date().getFullYear();
const RolePerm: UserRoleType[] = ['SUPER_ADMIN', 'ADMIN', 'SUPER_MOD', 'MOD'];

interface CardRegisterMessageProps {
  onClosing?: () => void;
  onSave?: () => void;
}

const parseDate = (date: Date) =>
  formatDate(new Date(date), {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

const CardRegisterMessage = ({
  onClosing,
  onSave,
}: CardRegisterMessageProps) => {
  const { users } = useListUsers(RolePerm);
  const navigate = useNavigate();
  const [isOpened, setIsOpened] = useState(false);
  const [isDroped, setIsDroped] = useState(false);
  const [isAddReceiver, setIsAddReceiver] = useState(false);
  const { userSession } = useSelector((state: RootState) => state);
  const [receiver, setReceiver] = useState<receiverType | null>(null);
  const [listCopy, setListCopy] = useState<receiverType[]>([]);
  const { handleSubmit, register, setValue, watch } =
    useForm<MessageSendType>();
  const [fileUploadFiles, setFileUploadFiles] = useState<File[]>([]);
  const [countMessage, setCountMessage] = useState<quantityType[] | null>([]);
  const { lastName, firstName } = userSession.profile;
  const HashUser = HashFile(`${firstName} ${lastName}`);
  const initialValueEditor = InitialValueEditor();

  const [pdfData, setpdfData] = useState<PdfDataProps>(dataInitialPdf);

  const handleIsOpen = useRef<Subscription>(new Subscription());

  useEffect(() => {
    handleIsOpen.current = isGenerateExcelReport$.getSubject.subscribe(
      blobExcel => {
        console.log({ blobExcel });
        if (!blobExcel) return;
        fetch(blobExcel)
          .then(response => response.blob())
          .then(blob => {
            const file = new File([blob], 'nombre_del_archivo.xlsx');
            addFiles?.([file]);
          })
          .catch(error => console.error('Error al cargar el blob:', error));
      }
    );
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, []);
  const contacts = useMemo(
    () =>
      users.filter(
        user => user.id !== userSession.id && user.id !== receiver?.id
      ),
    [userSession, users, receiver]
  );

  useEffect(() => {
    getQuantityServices();
  }, []);

  const getQuantityServices = () =>
    axiosInstance
      .get('/mail/imbox/quantity')
      .then(res => setCountMessage(res.data));

  const handleAddUser = (user: receiverType) => {
    const getId = listCopy.find(list => list.id == user.id);
    if (!getId) setListCopy([...listCopy, user]);
  };

  const handleRemoveUser = (user: receiverType) => {
    const filterValue = listCopy.filter(list => list.id !== user.id);
    if (!filterValue.length) setIsAddReceiver(false);
    setListCopy(filterValue);
  };

  const handleChangeRadio = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    const countFile = countMessage?.find(file => file.type === value);
    const newIndex = (countFile ? countFile._count.type : 0) + 1;
    const newTitleValue = `${value} N°${newIndex} DHYRIUM-${HashUser}-${YEAR}`;
    setValue('title', newTitleValue);
  };

  const handleInputChange = (event: string) => {
    setValue('description', event);
  };

  const handleRemoveReceiver = () => {
    setReceiver(null);
    setIsAddReceiver(false);
  };
  const handleAddCopy = () => setIsAddReceiver(true);

  const addFiles = (newFiles: File[]) => {
    const _files = addFilesList(fileUploadFiles, newFiles);
    setFileUploadFiles(_files);
  };

  const deleteFiles = (delFiles: File) => {
    const _files = deleteFileOnList(fileUploadFiles, delFiles);
    if (_files) setFileUploadFiles(_files);
  };
  // console.log(users.find(user => user.id === receiver?.id))

  useEffect(() => {
    const header = watch('header');
    const description = watch('description');
    const title = watch('title');
    const to = receiver?.value ?? '';
    const toUser = users.find(user => user.id === receiver?.id);
    setpdfData({
      from: userSession.profile.firstName + ' ' + userSession.profile.lastName,
      header,
      body: getTextParagraph(description ?? ''),
      tables: convertToObject(description ?? ''),
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

  const onSubmit: SubmitHandler<MessageSendType> = async data => {
    const formData = new FormData();
    const headers = { 'Content-type': 'multipart/form-data' };
    const secondaryReceiver = listCopy.map(list => ({ userId: list.id }));
    const values = {
      ...data,
      secondaryReceiver,
      senderId: userSession.id,
      receiverId: receiver?.id,
    };
    //----------------------------------------------------------------
    fileUploadFiles.forEach(_file => formData.append('fileMail', _file));
    formData.append('data', JSON.stringify(values));
    formData.append('senderId', `${userSession.id}`);

    axiosInstance.post(`/mail`, formData, { headers }).then(handleSave);
  };

  const handleSave = () => {
    onSave?.();
    navigate('/tramites?loader=true');
  };
  const handleClose = () => onClosing?.();
  const handleDroped = () => {
    setIsDroped(!isDroped);
    !isDroped && setIsOpened(false);
  };
  const showCardReport = () => {
    isOpenCardGenerateReport$.setSubject = true;
  };

  return (
    <motion.div
      className="imbox-send-container-main"
      initial={{
        opacity: 0,
        width: '36vw',
        height: isDroped ? 30 : '76vh',
      }}
      animate={{
        opacity: 1,
        width: isOpened ? '86vw' : '36vw',
        height: isDroped ? 30 : isOpened ? '94vh' : '76vh',
        transition: { duration: 0.4 },
        overflow: isDroped ? 'hidden' : 'auto',
      }}
      exit={{ opacity: 0, transition: { delay: 0.3 } }}
    >
      <div className="imnbox-title">
        <h3 className="imbox-container-title" onClick={handleDroped}>
          Nuevo Trámite
        </h3>

        <div className="imbox-container-options">
          {!isDroped && (
            <Button
              className="imbox-resize-icon"
              icon={`${isOpened ? 'resize-down' : 'resize-up'}`}
              onClick={() => setIsOpened(!isOpened)}
            />
          )}
          <Button
            className="imbox-resize-icon"
            icon="minus"
            onClick={handleDroped}
          />
          <Button
            className="imbox-resize-icon"
            icon="close"
            onClick={handleClose}
          />
        </div>
      </div>
      <form className="imbox-data-content" onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register('title')}
          className="imbox-input-content-title not-allowed"
          name="title"
          type="text"
          disabled
        />
        <span>
          Tipo de Documento <span style={{ color: 'red' }}>*</span>
        </span>
        <div className="imbox-type-container">
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
        <div className="imbox-receiver-container">
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
          {receiver && (
            <Button
              type="button"
              text="Cc"
              className="inbox-copy-button"
              onClick={handleAddCopy}
            />
          )}
        </div>
        {isAddReceiver && (
          <div className="imbox-receiver-container-copy">
            <span className="imbox-receiver-label">Cc: </span>
            {listCopy.map(list => (
              <div className="imbox-receiver-chip">
                <span className="imbox-receiver-chip-name">{list.value}</span>
                <img
                  className="imbox-receiver-chip-icon-close "
                  onClick={() => handleRemoveUser(list)}
                  src="/svg/circle-xmark-solid.svg"
                />
              </div>
            ))}
            <DropDownSimple
              classNameInput="imbox-receiver-choice-dropdown-input"
              type="search"
              data={contacts}
              placeholder="Buscar...."
              textField="name"
              itemKey="id"
              droper
              valueInput={(value, id) => handleAddUser({ id: +id, value })}
            />
          </div>
        )}
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
        <Editor
          initialValue={initialValueEditor}
          init={{
            max_height: 500,
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
        {/* <TextArea
          className="imbox-text-area-description"
          placeholder="Redacte su mensaje aqui"
          {...register('description')}
          name="description"
        /> */}
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
        <div onClick={showCardReport}>generar report</div>
        <InputFile
          className="imbox-file-area"
          getFilesList={files => addFiles(files)}
        />
        <PDFGenerator data={pdfData} />
        <div className="imbox-btn-submit-container">
          <Button className="imbox-btn-submit" type="submit" text="Enviar" />
        </div>
      </form>
    </motion.div>
  );
};

export default CardRegisterMessage;
