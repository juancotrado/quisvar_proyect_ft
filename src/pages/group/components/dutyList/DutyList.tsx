import { ChangeEvent, useEffect, useState } from 'react';
import { Duty, GroupAttendanceRes } from '../../types';
import { URL } from '../../../../services/axiosInstance';
import './dutyList.css';
import {
  Button,
  ButtonDelete,
  Input,
  UploadFileInput,
} from '../../../../components';
import { axiosInstance } from '../../../../services/axiosInstance';
import { normalizeFileName } from '../../../../utils';
interface DutyListProps {
  groupUsers: GroupAttendanceRes[];
  idList?: number;
  onSave: () => void;
  hasDuty?: Duty[];
  isToday?: boolean;
  file?: string;
}
type sendData = {
  fullName: string;
  description: string;
  untilDate: string;
  listId?: number;
};
const DutyList = ({
  groupUsers,
  idList,
  onSave,
  hasDuty,
  isToday,
  file,
}: DutyListProps) => {
  // console.log(groupUsers)
  const data = groupUsers.map(({ user, description }) => {
    return {
      fullName: user.profile.firstName + ' ' + user.profile.lastName,
      description: description,
      untilDate: '',
      listId: idList,
    };
  });
  useEffect(() => {
    // console.log(hasDuty)
    setEdit(false);
    if (hasDuty?.length === 0) {
      setItems(data);
    } else {
      setItemsEdit(hasDuty as Duty[]);
    }
  }, [idList]);
  const [items, setItems] = useState<sendData[]>([]);
  const [itemsEdit, setItemsEdit] = useState<Duty[]>([]);
  const [edit, setEdit] = useState<boolean>(false);

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setItems(updatedItems);
  };
  const handleInputEdit = (index: number, field: string, value: string) => {
    const editItems = [...itemsEdit];
    editItems[index] = {
      ...editItems[index],
      [field]: value,
    };
    setItemsEdit(editItems);
  };
  const handleAddRow = () => {
    setItems([
      ...items,
      { fullName: '', description: '', untilDate: '', listId: idList },
    ]);
  };

  const handleDeleteRow = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };
  const handleSubmit = () => {
    // console.log(items)
    axiosInstance.post(`/duty`, items).then(() => {
      onSave();
    });
  };
  const formattedDate = (value: string) => {
    return value.split('T')[0];
  };
  const handleUpdate = () => {
    axiosInstance.patch(`/duty/items`, itemsEdit).then(() => {
      onSave();
    });
  };
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const pdf = e.target.files?.[0];
    console.log(pdf);
    const formData = new FormData();
    formData.append('file', pdf ?? '');
    const headers = {
      'Content-type': 'multipart/form-data',
    };
    axiosInstance
      .patch(`/attendanceGroup/file/${idList}`, formData, { headers })
      .then(() => {
        onSave?.();
      });
  };
  return (
    <div className="dl-content">
      <div className="dl-header">
        <h1 className="dl-title dl-center">#</h1>
        <h1 className="dl-title">PARTICIPANTE</h1>
        <h1 className="dl-title">COMPROMISO DIARIO</h1>
        <h1 className="dl-title dl-center">FECHA LIMITE</h1>
      </div>
      {isToday &&
        hasDuty &&
        hasDuty?.length === 0 &&
        items &&
        items.map((item, idx) => {
          // console.log(item)
          return (
            <div className="dl-body" key={idx}>
              <h1 className="dl-list dl-center">{idx + 1}</h1>
              {groupUsers.length > idx ? (
                <h1 className="dl-list">{item.fullName}</h1>
              ) : (
                <input
                  type="text"
                  className="dl-list"
                  value={item.fullName}
                  onChange={e =>
                    handleInputChange(idx, 'fullName', e.target.value)
                  }
                />
              )}
              <input
                type="text"
                className="dl-list"
                value={item.description}
                onChange={e =>
                  handleInputChange(idx, 'description', e.target.value)
                }
              />
              <Input
                type="date"
                classNameMain="dl-list"
                className=""
                value={item.untilDate}
                required
                onChange={e =>
                  handleInputChange(idx, 'untilDate', e.target.value)
                }
              />
              {groupUsers.length <= idx && (
                <span
                  className="dl-delete-btn"
                  onClick={() => handleDeleteRow(idx)}
                >
                  x
                </span>
              )}
            </div>
          );
        })}
      {hasDuty &&
        hasDuty?.length > 0 &&
        itemsEdit.map((item, idx) => (
          <div className="dl-body" key={item.id}>
            <h1 className="dl-list dl-center">{idx + 1}</h1>
            {/* <h1 className="dl-list">{item.fullName}</h1> */}
            {/* {item.fullName ? (
              <h1 className="dl-list">{item.fullName}</h1>
            ) : (
              <input
                type="text"
                className="dl-list"
                value={item.description}
                onChange={e =>
                  handleInputChange(idx, 'fullName', e.target.value)
                }
              />
            )} */}
            <input
              type="text"
              className="dl-list"
              value={item.fullName}
              disabled={!edit}
              onChange={e => handleInputEdit(idx, 'fullName', e.target.value)}
            />
            <input
              type="text"
              className="dl-list"
              defaultValue={item.description}
              disabled={!edit}
              onChange={e =>
                handleInputEdit(idx, 'description', e.target.value)
              }
              // onBlur={e => console.log(e.target.value)}
            />
            <Input
              type="date"
              classNameMain="dl-list"
              className=""
              value={formattedDate(item.untilDate as string)}
              onChange={e => handleInputEdit(idx, 'untilDate', e.target.value)}
              disabled={!edit}
              required
            />
            {groupUsers.length <= idx && !hasDuty && (
              <span
                className="dl-delete-btn"
                onClick={() => handleDeleteRow(idx)}
              >
                x
              </span>
            )}
          </div>
        ))}
      {isToday && hasDuty?.length === 0 && (
        <div className="dl-btns">
          <Button
            text="GUARDAR"
            className="attendance-add-btn"
            onClick={handleSubmit}
            type="submit"
          />
          <Button
            text="AÑADIR"
            className="attendance-add-btn"
            onClick={handleAddRow}
          />
        </div>
      )}
      {hasDuty && hasDuty?.length > 0 && (
        <div className="dl-btns">
          {edit ? (
            <>
              <Button
                text="Cancelar"
                className="attendance-add-btn"
                onClick={() => setEdit(false)}
                style={{ backgroundColor: 'red' }}
              />
              <Button
                text="Actualizar"
                className="attendance-add-btn"
                style={{ backgroundColor: 'green' }}
                onClick={handleUpdate}
              />
            </>
          ) : (
            <Button
              text="Editar"
              className="attendance-add-btn"
              onClick={() => setEdit(true)}
            />
          )}
        </div>
      )}
      <div className="divider"></div>

      {!file ? (
        <UploadFileInput
          name="Cargar Acta Firmada"
          subName="O arrastre y suelte el archivo aquí"
          accept="application/pdf"
          onChange={handleFileUpload}
        />
      ) : (
        <div className="cc-img-area">
          <a
            className="cc-img-title"
            target="_blank"
            href={`${URL}/file-user/groups/daily/${file}`}
          >
            {normalizeFileName(file)}
          </a>
          <ButtonDelete
            icon="trash"
            className="role-delete-icon"
            url={`/attendanceGroup/file/${idList}`}
            type="button"
            onSave={() => {
              onSave?.();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DutyList;
