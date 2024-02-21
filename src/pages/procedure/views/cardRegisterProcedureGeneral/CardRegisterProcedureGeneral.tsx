import { SubmitHandler, useForm } from 'react-hook-form';
import { Button, DropDownSimple, Input, Select } from '../../../../components';
import './cardRegisterProcedureGeneral.css';
import { MessageSendType, receiverType } from '../../../../types';
import { INITIAL_VALUE_EDITOR, validateWhiteSpace } from '../../../../utils';
import { RADIO_OPTIONS, ToData } from '../../models';
import { Editor } from '@tinymce/tinymce-react';
import { useMemo, useState } from 'react';
import { useListUsers } from '../../../../hooks';
import { RootState } from '../../../../store';
import { useSelector } from 'react-redux';
import { procedureDocument } from '../../pdfGenerator';
import html2pdf from 'html2pdf.js';
import { ChipFileDownLoadProcedure, DocumentProcedure } from '../../components';
import { useTitleProcedure } from '../../hooks';
import { axiosInstance } from '../../../../services/axiosInstance';
import { isOpenViewHtmlToPdf$ } from '../../../../services/sharingSubject';

interface CardRegisterProcedureGeneralProps {
  onSave?: () => void;
  onClosing: () => void;
}

const CardRegisterProcedureGeneral = ({
  onClosing,
  onSave,
}: CardRegisterProcedureGeneralProps) => {
  const [receiver, setReceiver] = useState<receiverType | null>(null);
  const [isAddReceiver, setIsAddReceiver] = useState(false);
  const [listCopy, setListCopy] = useState<receiverType[]>([]);
  const { handleTitle } = useTitleProcedure('/paymail/imbox/quantity');
  const [fileUploadFiles, setFileUploadFiles] = useState<File[]>([]);

  const { profile, id: userSessionId } = useSelector(
    (state: RootState) => state.userSession
  );
  const handleAddCopy = () => {
    setIsAddReceiver(true);
  };
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MessageSendType>();
  const { users: listUser } = useListUsers(
    'MOD',
    'tramites',
    'tramite-regular'
  );
  const contacts = useMemo(
    () =>
      listUser.filter(
        user => user.id !== userSessionId && user.id !== receiver?.id
      ),
    [userSessionId, listUser, receiver]
  );

  const handleReceiverUser = (usersId: number[]) => {
    const findUsers = usersId.map(userId => {
      const receiverUser = listUser.find(({ id }) => id === userId);
      if (!receiverUser) return;
      const { name, degree, position } = receiverUser;
      return { name, degree, position };
    });
    const filterUser = findUsers.filter(user => !!user) as ToData[];
    return filterUser;
  };

  const getHtmlString = (size: 'a4' | 'a5') => {
    if (!receiver) return;
    const idUserReceiver = listCopy.map(user => user.id);
    const { description, header, type } = watch();
    const usersReceiver = handleReceiverUser([+receiver.id, ...idUserReceiver]);
    const [toProfile, ...ccProfiles] = usersReceiver;
    const htmlString = procedureDocument({
      title: handleTitle(type),
      subject: header,
      body: description ?? '',
      toProfile,
      ccProfiles,
      fromProfile: profile,
      size,
      type: 'comunication',
    });
    return htmlString;
  };
  const downLoadPdf = (size: 'a4' | 'a5') => {
    const htmlString = getHtmlString(size);
    if (!htmlString) return;
    const { header } = watch();

    isOpenViewHtmlToPdf$.setSubject = {
      isOpen: true,
      fileNamePdf: header,
      htmlString,
      size,
    };
    // const options = {
    //   margin: [14, 22, 14, 22],
    //   filename: 'time_sheet_report.pdf',
    //   image: { type: 'jpeg', quality: 1 },
    //   html2canvas: { scale: 2, useCORS: true },
    //   useCORS: true,
    //   jsPDF: { format: size, orientation: 'p' },
    // };

    // html2pdf().set(options).from(htmlString).save();
  };

  const handleAddUser = (user: receiverType) => {
    const getId = listCopy.find(list => list.id == user.id);
    if (!getId) setListCopy([...listCopy, user]);
  };

  const handleRemoveUser = (user: receiverType) => {
    const filterValue = listCopy.filter(list => list.id !== user.id);
    if (!filterValue.length) setIsAddReceiver(false);
    setListCopy(filterValue);
  };
  const handleInputChange = (event: string) => setValue('description', event);

  const onSubmit: SubmitHandler<MessageSendType> = async data => {
    const formData = new FormData();
    const secondaryReceiver = listCopy.map(list => ({ userId: list.id }));
    const htmlString = getHtmlString('a4');
    if (!htmlString) return;
    const values = {
      ...data,
      secondaryReceiver,
      senderId: userSessionId,
      receiverId: receiver?.id,
      title: handleTitle(watch('type')),
      description: htmlString,
    };
    fileUploadFiles.forEach(_file => formData.append('fileMail', _file));
    formData.append('data', JSON.stringify(values));
    formData.append('category', `GLOBAL`);
    axiosInstance.post(`/mail`, formData).then(onSave);
  };

  const downloadOptions = [
    {
      id: 1,
      handleClick: () => downLoadPdf('a5'),
      iconOne: 'file-download',
      iconTwo: 'file-download-white',
      text: 'A5',
    },
    {
      id: 2,
      handleClick: () => downLoadPdf('a4'),
      iconOne: 'file-download',
      iconTwo: 'file-download-white',
      text: 'A4',
    },
  ];

  return (
    <div className="inbox-send-container-main">
      <div className="imnbox-title">
        <h3 className="imbox-container-title">Nuevo Trámite</h3>

        <div className="imbox-container-options">
          <Button
            className="imbox-resize-icon"
            icon="close"
            onClick={onClosing}
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
            data={RADIO_OPTIONS}
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

        <div className="pdf-btn-area-view">
          {downloadOptions.map(
            ({ iconOne, iconTwo, id, handleClick, text }) => (
              <ChipFileDownLoadProcedure
                key={id}
                text={text}
                iconOne={iconOne}
                iconTwo={iconTwo}
                onClick={handleClick}
              />
            )
          )}
        </div>
        <DocumentProcedure getFilesList={files => setFileUploadFiles(files)} />
        <Button type="submit" text="Enviar" styleButton={4} />
      </form>
    </div>
  );
};

export default CardRegisterProcedureGeneral;
