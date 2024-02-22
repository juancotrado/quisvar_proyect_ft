import './cardRegisterMessage.css';
import { useEffect, useMemo, useState } from 'react';
import { useListUsers } from '../../../../../../hooks';
import {
  ListUser,
  MessageSendType,
  PdfDataProps,
  quantityType,
  receiverType,
} from '../../../../../../types';
import { RootState } from '../../../../../../store';
import { useSelector } from 'react-redux';
import { Editor } from '@tinymce/tinymce-react';
import { motion } from 'framer-motion';
import { axiosInstance } from '../../../../../../services/axiosInstance';
import {
  Button,
  DropDownSimple,
  Input,
  Select,
} from '../../../../../../components';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  HashFile,
  radioOptions,
  // InitialValueEditor,
  validateWhiteSpace,
  formatDate,
  convertToDynamicObject,
  dataInitialPdf,
  INITIAL_VALUE_EDITOR,
} from '../../../../../../utils';
import { useNavigate } from 'react-router-dom';
import { isOpenCardGenerateReport$ } from '../../../../../../services/sharingSubject';
import { PDFGenerator } from '../../pdfGenerate';
import { JOB_DATA } from '../../../../../userCenter/pages/users/models';
import DocumentProcedure from '../../../../components/documentProcedure/DocumentProcedure';

const YEAR = new Date().getFullYear();

interface CardRegisterMessageProps {
  onClosing?: () => void;
  onSave?: () => void;
}

const CardRegisterMessage = ({
  onClosing,
  onSave,
}: CardRegisterMessageProps) => {
  const { users: listUser } = useListUsers(
    'MOD',
    'tramites',
    'tramite-de-pago'
  );
  const navigate = useNavigate();
  const [isAddReceiver, setIsAddReceiver] = useState(false);
  const userSession = useSelector((state: RootState) => state.userSession);
  const [receiver, setReceiver] = useState<receiverType | null>(null);
  const [listCopy, setListCopy] = useState<receiverType[]>([]);
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MessageSendType>();
  const [fileUploadFiles, setFileUploadFiles] = useState<File[]>([]);
  const [countMessage, setCountMessage] = useState<quantityType[] | null>([]);
  const { lastName, firstName } = userSession.profile;
  const HashUser = HashFile(`${firstName} ${lastName}`);
  // const initialValueEditor = InitialValueEditor();

  const [pdfData, setpdfData] = useState<PdfDataProps>(dataInitialPdf);

  const filterJob = (value?: string, job?: string) => {
    if (value !== 'Titulado') return value;
    return JOB_DATA.filter(item => item.value === job)[0].abrv;
  };
  //funcion futura para que el reporte se agrega auntomaticamente
  // const handleIsOpen = useRef<Subscription>(new Subscription());

  // useEffect(() => {
  //   handleIsOpen.current = isGenerateExcelReport$.getSubject.subscribe(
  //     blobExcel => {
  //       if (!blobExcel) return;
  //       fetch(blobExcel)
  //         .then(response => response.blob())
  //         .then(blob => {
  //           const file = new File([blob], 'nombre_del_archivo.xlsx');
  //           addFiles?.([file]);
  //         })
  //         .catch(error => console.error('Error al cargar el blob:', error));
  //     }
  //   );
  //   return () => {
  //     handleIsOpen.current.unsubscribe();
  //   };
  // }, []);

  const contacts = useMemo(
    () =>
      listUser.filter(
        user => user.id !== userSession.id && user.id !== receiver?.id
      ),
    [userSession, listUser, receiver]
  );

  useEffect(() => {
    getQuantityServices();
  }, []);

  const getQuantityServices = () =>
    axiosInstance
      .get('/paymail/imbox/quantity')
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

  const handleInputChange = (event: string) => {
    setValue('description', event);
  };

  const handleAddCopy = () => {
    setIsAddReceiver(true);
  };

  const handleTitle = (value: string) => {
    const countFile = countMessage?.find(file => file.type === value);
    const newIndex = (countFile ? countFile._count.type : 0) + 1;
    return `${value} N°${newIndex} DHYRIUM-${HashUser}-${YEAR}`;
  };

  const handleReportPDF = () => {
    const secondaryReceiver = listCopy.map(list => ({ userId: list.id }));
    const cc: ListUser[] = secondaryReceiver.map(item => {
      const toUser = listUser.find(user => user.id === item.userId);
      if (toUser) {
        const { name, degree, position, job } = toUser;
        return { name, degree: filterJob(degree, job) as string, position };
      }
      return { name: '', degree: '', position: '' };
    });

    const header = watch('header');
    const description = watch('description');
    const to = receiver?.value ?? '';
    const toUser = listUser.find(user => user.id === receiver?.id);

    setpdfData({
      from: userSession.profile.firstName + ' ' + userSession.profile.lastName,
      header,
      body: convertToDynamicObject(description ?? ''),
      title: handleTitle(watch('type')),
      cc,
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
  const onSubmit: SubmitHandler<MessageSendType> = async data => {
    const formData = new FormData();
    const headers = { 'Content-type': 'multipart/form-data' };
    const secondaryReceiver = listCopy.map(list => ({ userId: list.id }));
    const values = {
      ...data,
      secondaryReceiver,
      senderId: userSession.id,
      receiverId: receiver?.id,
      title: handleTitle(watch('type')),
    };
    //----------------------------------------------------------------
    fileUploadFiles.forEach(_file => formData.append('fileMail', _file));
    formData.append('data', JSON.stringify(values));
    formData.append('senderId', `${userSession.id}`);

    axiosInstance.post(`/paymail`, formData, { headers }).then(handleSave);
  };

  const handleSave = () => {
    onSave?.();
    navigate('?loader=true');
  };
  const handleClose = () => {
    onClosing?.();
  };
  const showCardReport = () => {
    isOpenCardGenerateReport$.setSubject = true;
  };
  return (
    <motion.div className="inbox-send-container-main">
      <div className="imnbox-title">
        <h3 className="imbox-container-title">Nuevo Trámite</h3>

        <div className="imbox-container-options">
          <Button
            className="imbox-resize-icon"
            icon="close"
            onClick={handleClose}
          />
        </div>
      </div>
      <form className="imbox-data-content" onSubmit={handleSubmit(onSubmit)}>
        {watch('type') && (
          <h3 className="messagePage-type-document">
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
          {receiver && (
            <Button
              type="button"
              text=" + Cc"
              className="inbox-copy-button"
              onClick={handleAddCopy}
            />
          )}
        </div>

        {isAddReceiver && (
          <div className="imbox-receiver-container-copy">
            <span className="imbox-receiver-label">Cc: </span>
            {listCopy.map(list => (
              <div className="imbox-receiver-chip" key={list.id}>
                <span className="imbox-receiver-chip-name">{list.value}</span>
                <img
                  className="imbox-receiver-chip-icon-close "
                  onClick={() => handleRemoveUser(list)}
                  src="/svg/circle-xmark-solid.svg"
                />
              </div>
            ))}
            <DropDownSimple
              classNameInput="messagePage-input"
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
        <Input
          {...register('header', { validate: { validateWhiteSpace } })}
          errors={errors}
          className="messagePage-input"
          placeholder="Asunto"
          name="header"
          type="text"
        />
        <Editor
          initialValue={INITIAL_VALUE_EDITOR}
          init={{
            min_height: 500,
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

        <div className="messageRegister-options">
          <div className="messageRegister-report" onClick={showCardReport}>
            <figure className="messageRegister-figure">
              <img src={`/svg/clip-icon.svg`} alt="W3Schools" />
            </figure>
            <span>Adjuntar reporte</span>
          </div>
          <PDFGenerator data={pdfData} handleFocus={handleReportPDF} />
        </div>
        <DocumentProcedure getFilesList={files => setFileUploadFiles(files)} />

        <Button type="submit" text="Enviar" styleButton={4} />
      </form>
    </motion.div>
  );
};

export default CardRegisterMessage;
