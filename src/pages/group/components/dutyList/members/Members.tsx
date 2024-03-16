import { useForm } from 'react-hook-form';
// import { Input } from '../../../../../components';
import { _date } from '../../../../../utils';
import { DutyMember } from '../../../types';
import './members.css';
import { Dispatch, useEffect, useState } from 'react';
import { axiosInstance } from '../../../../../services/axiosInstance';
import { Button, Select } from '../../../../../components';
import { PROJECT_STATUS } from '../../../../userCenter/pages/users/models';
interface MembersProps {
  members: DutyMember[];
  dutyId: number;
  onSave: () => void;
  editMember: Dispatch<React.SetStateAction<DutyMember[]>>;
}
const Members = ({ members, dutyId, onSave, editMember }: MembersProps) => {
  const [sendItems, setSendItems] = useState<DutyMember[]>([]);
  const {
    register,
    // handleSubmit,
    //setValue,
    reset,
    // watch,
    // formState: { errors },
  } = useForm<DutyMember[]>();
  useEffect(() => {
    if (members) {
      setSendItems(members);
      reset({ ...members });
    }
  }, [members, reset]);
  // console.log(members);

  const handleChange = (idx: number, field: string, value: string) => {
    console.log(field, value);
    if (!value) return;
    const updatedItems = [...sendItems];
    updatedItems[idx] = {
      ...updatedItems[idx],
      [field]: value,
    };
    setSendItems(updatedItems);

    editMember(updatedItems);

    // const toSend = sendItems?.find((value,index) => value.id = idx)
    // console.log(updatedItems);
  };
  const handleAddRow = () => {
    axiosInstance.post(`dutyMembers/${dutyId}`).then(() => onSave?.());
  };
  const handleDeleteRow = (id: number) => {
    axiosInstance.delete(`dutyMembers/${id}`).then(() => onSave?.());
  };

  const textColor = (value: string) => {
    return value === 'APTO'
      ? 'green'
      : value === 'EN REVISION'
      ? 'orange'
      : 'red';
  };

  return (
    <div className="member-container">
      {sendItems &&
        sendItems.map((member, idx) => (
          <div className="member-body" key={idx}>
            <input
              {...register(`${idx}.position` as const)}
              className={`member-list right-border ${
                idx !== 0 && 'top-border'
              }`}
              onBlur={e => {
                if (e.target.value === member.position) return;
                handleChange(idx, 'position', e.target.value);
              }}
            />
            <input
              {...register(`${idx}.fullName` as const)}
              className={`member-list right-border ${
                idx !== 0 && 'top-border'
              }`}
              onBlur={e => {
                if (e.target.value === member.fullName) return;
                handleChange(idx, 'fullName', e.target.value);
              }}
            />
            <input
              {...register(`${idx}.progress` as const)}
              className={`member-list right-border ${
                idx !== 0 && 'top-border'
              }`}
              onBlur={e => {
                if (e.target.value === member.progress) return;
                handleChange(idx, 'progress', e.target.value);
              }}
            />
            <input
              type="date"
              {...register(`${idx}.lastMeeting` as const)}
              className={`member-list right-border ${
                idx !== 0 && 'top-border'
              }`}
              onBlur={e => {
                if (e.target.value === member.lastMeeting) return;
                handleChange(idx, 'lastMeeting', e.target.value);
              }}
            />
            <input
              type="date"
              {...register(`${idx}.futureMeeting` as const)}
              className={`member-list right-border ${
                idx !== 0 && 'top-border'
              }`}
              onBlur={e => {
                if (e.target.value === member.futureMeeting) return;
                handleChange(idx, 'futureMeeting', e.target.value);
              }}
            />
            <Select
              {...register(`${idx}.status` as const)}
              className={`member-select right-border ${
                idx !== 0 && 'top-border'
              }`}
              style={{ color: textColor(member.status) }}
              onChange={e => {
                if (e.target.value === member.status) return;
                handleChange(idx, 'status', e.target.value);
              }}
              data={PROJECT_STATUS}
              itemKey="value"
              textField="value"
            />
            <input
              {...register(`${idx}.request` as const)}
              className={`member-list right-border ${
                idx !== 0 && 'top-border'
              }`}
              onBlur={e => {
                if (e.target.value === member.request) return;
                handleChange(idx, 'request', e.target.value);
              }}
            />
            {!member.fullName && (
              <button
                onClick={() => handleDeleteRow(member.id as number)}
                style={{ position: 'absolute' }}
              >
                X
              </button>
            )}
          </div>
        ))}
      <Button icon="add1" onClick={handleAddRow} className="member-add" />
    </div>
  );
};

export default Members;
