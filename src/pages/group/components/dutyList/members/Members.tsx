import { Controller, useForm } from 'react-hook-form';
// import { Input } from '../../../../../components';
import { _date } from '../../../../../utils';
import { DutyMember } from '../../../types';
import './members.css';
import { Dispatch, useEffect, useState } from 'react';
import { axiosInstance } from '../../../../../services/axiosInstance';
import { AdvancedSelect, Button } from '../../../../../components';
// import { PROJECT_STATUS } from '../../../../userCenter/pages/users/models';
interface MembersProps {
  members: DutyMember[];
  dutyId: number;
  onSave: () => void;
  editMember: Dispatch<React.SetStateAction<DutyMember[]>>;
}

const options = [
  { color: '#57d9a3b6', value: 'PUNTUAL', label: 'PUNTUAL' },
  { color: '#ffd240ab', value: 'TARDE', label: 'TARDE' },
  { color: '#df00003a', value: 'SIMPLE', label: 'FALTA' },
  { color: '#df00006e', value: 'GRAVE', label: 'GRAVE' },
  { color: '#c00000a2', value: 'MUY_GRAVE', label: 'MUY GRAVE' },
  { color: '#2263e58f', value: 'PERMISO', label: 'LICENCIA' },
];

const Members = ({ members, dutyId, onSave, editMember }: MembersProps) => {
  const [sendItems, setSendItems] = useState<DutyMember[]>([]);
  const {
    register,
    // handleSubmit,
    //setValue,
    control,
    reset,
    // watch,
    // formState: { errors },
  } = useForm<DutyMember[]>();
  useEffect(() => {
    if (members) {
      setSendItems(members);
      const xd = members.map(member => {
        return {
          id: member.id,
          position: member.position,
          fullName: member.fullName,
          feedBack: member.feedBack,
          dailyDuty: member.dailyDuty,
          attendance: member.attendance,
        };
      });
      reset(xd);
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
  };
  const handleAddRow = () => {
    axiosInstance.post(`dutyMembers/${dutyId}`).then(() => onSave?.());
  };

  return (
    <div className="member-container">
      {sendItems &&
        sendItems.map((member, idx) => (
          <div className="member-body" key={idx}>
            <h1>{idx + 1}</h1>
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
            <Controller
              control={control}
              name={`${idx}.attendance` as const}
              rules={{ required: 'Debes seleccionar una opción' }}
              render={({ field: { onChange } }) => (
                <AdvancedSelect
                  // placeholder="Dirigida a"
                  options={options}
                  isClearable
                  // errors={errors}
                  name="to"
                  onChange={onChange}
                />
              )}
            />
            <h1 className="member-list">xd</h1>
            <input
              {...register(`${idx}.feedBack` as const)}
              className={`member-list right-border ${
                idx !== 0 && 'top-border'
              }`}
              onBlur={e => {
                if (e.target.value === member.feedBack) return;
                handleChange(idx, 'feedBack', e.target.value);
              }}
            />
            <input
              {...register(`${idx}.dailyDuty` as const)}
              className={`member-list right-border ${
                idx !== 0 && 'top-border'
              }`}
              onBlur={e => {
                if (e.target.value === member.dailyDuty) return;
                handleChange(idx, 'dailyDuty', e.target.value);
              }}
            />
          </div>
        ))}
      <Button icon="add1" onClick={handleAddRow} className="member-add" />
    </div>
  );
};

export default Members;
