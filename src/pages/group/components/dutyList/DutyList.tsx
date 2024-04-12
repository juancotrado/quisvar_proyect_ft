import { useForm } from 'react-hook-form';
import { Duty, DutyMember } from '../../types';
import './dutyList.css';
import { useEffect, useState } from 'react';
// import { Input } from '../../../../components';
import { validateWhiteSpace } from '../../../../utils';
import { Members } from './members';
interface DutyListProps {
  data: Duty;
}
const DutyList = ({ data }: DutyListProps) => {
  const [editMembers, setEditMembers] = useState<DutyMember[]>([]);
  const {
    register,
    // handleSubmit,
    // setValue,
    reset,
    // watch,
    // formState: { errors },
  } = useForm<Duty>();

  console.log(data);

  useEffect(() => {
    if (data) {
      reset({
        ...data,
      });
    }
  }, [data]);
  console.log(editMembers);
  return (
    <div className="dl-container">
      <input {...register('titleMeeting', { validate: validateWhiteSpace })} />
      <div className="dl-theader">
        <h2 className="dl-title">COMPROMISOS</h2>
        <h2 className="dl-title">INFORMES</h2>
        <h2 className="dl-title">ASISTENCIA</h2>
      </div>
      <div className="dl-header">
        <h2 className="dl-title">#</h2>
        <h2 className="dl-title">APELLIDOS Y NOMBRES</h2>
        <h2 className="dl-title">ASISTENCIA</h2>
        <h2 className="dl-title">TAREAS</h2>
        <h2 className="dl-title">COMENTARIOS</h2>
        <h2 className="dl-title">COMPROMISO DIARIO</h2>
        <h2 className="dl-title">COMPROMISO GRUPAL</h2>
      </div>
      <div className="dl-body">
        <Members
          members={data.members}
          dutyId={data.id}
          onSave={() => {}}
          editMember={e => setEditMembers(e)}
        />
        <input {...register('dutyGroup', { validate: validateWhiteSpace })} />
      </div>
    </div>
  );
};

export default DutyList;
