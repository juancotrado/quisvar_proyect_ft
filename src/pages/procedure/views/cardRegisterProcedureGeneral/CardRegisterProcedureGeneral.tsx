import { SubmitHandler, useForm } from 'react-hook-form';
import {
  Button,
  DropDownSimple,
  Input,
  InputFile,
  Select,
} from '../../../../components';
import './cardRegisterProcedureGeneral.css';
import { MessageSendType, receiverType } from '../../../../types';
import { INITIAL_VALUE_EDITOR, validateWhiteSpace } from '../../../../utils';
import { RADIO_OPTIONS } from '../../models';
import { Editor } from '@tinymce/tinymce-react';
import { useMemo, useState } from 'react';
import { useListUsers } from '../../../../hooks';
import { RootState } from '../../../../store';
import { useSelector } from 'react-redux';
import { procedureDocument } from '../../pdfGenerator';
import html2pdf from 'html2pdf.js';

const CardRegisterProcedureGeneral = () => {
  const [receiver, setReceiver] = useState<receiverType | null>(null);
  const { id: userSessionId } = useSelector(
    (state: RootState) => state.userSession
  );

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

  const downLoadPdf = () => {};

  // const handleTitle = (value: string) => {
  //   const countFile = countMessage?.find(file => file.type === value);
  //   const newIndex = (countFile ? countFile._count.type : 0) + 1;
  //   return `${value} N°${newIndex} DHYRIUM-${HashUser}-${YEAR}`;
  // };
  const handleInputChange = (event: string) => setValue('description', event);

  const onSubmit: SubmitHandler<MessageSendType> = async data => {
    console.log(data);
    const htmlString = procedureDocument({
      title: 'asd',
      from: 'asd',
      to: 'asdsa',
      subject: 'string',
      date: 'string',
      body: 'string',
    });
    const options = {
      margin: [11, 22, 11, 22],
      filename: 'time_sheet_report.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      useCORS: true,
      jsPDF: { format: 'a4', orientation: 'p' },
    };

    html2pdf().set(options).from(htmlString).save();
  };
  return (
    <div className="inbox-send-container-main">
      <div className="imnbox-title">
        <h3 className="imbox-container-title">Nuevo Trámite</h3>

        <div className="imbox-container-options">
          <Button
            className="imbox-resize-icon"
            icon="close"
            // onClick={handleClose}
          />
        </div>
      </div>
      <form className="imbox-data-content" onSubmit={handleSubmit(onSubmit)}>
        {watch('type') && (
          <h3 className="messagePage-type-document">
            {/* {handleTitle(watch('type'))} */}
            TITULO DEL TRAMITE
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
              // onClick={handleAddCopy}
            />
          )}
        </div>

        {/* {isAddReceiver && (
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
        )} */}
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

          // {...register('description')}
        />

        <div className="pdf-btn-area-view">
          <div className="pdf-btn-view-white">
            <img
              className="chip-file-icon-doc normal"
              src={`/svg/file-download.svg`}
            />
            <img
              className="chip-file-icon-doc hover"
              src={`/svg/file-download-white.svg`}
            />

            <span className="download-text">{'A5'}</span>
          </div>
          <div className="pdf-btn-view-white" onClick={downLoadPdf}>
            <img
              className="chip-file-icon-doc normal"
              src={`/svg/file-download.svg`}
            />
            <img
              className="chip-file-icon-doc hover"
              src={`/svg/file-download-white.svg`}
            />
            <span className="download-text">{'A4'}</span>
          </div>
        </div>
        <div className="message-file-add">
          <h4 className="message-add-document">Agregar Documentos:</h4>
          <InputFile
            className="message-file-area"
            // getFilesList={files => addFiles(files)}
          />
          {/* {fileUploadFiles && (
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
          )} */}
        </div>

        <Button type="submit" text="Enviar" styleButton={4} />
      </form>
    </div>
  );
};

export default CardRegisterProcedureGeneral;
