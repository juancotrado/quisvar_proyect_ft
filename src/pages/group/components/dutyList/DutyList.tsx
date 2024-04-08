import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Duty, DutyMember, GroupAttendanceRes, ProjectList } from '../../types';
// import { URL } from '../../../../services/axiosInstance';
import './dutyList.css';
import {
  Button,
  //ButtonDelete,
  Input,
  //UploadFileInput,
} from '../../../../components';
import { axiosInstance } from '../../../../services/axiosInstance';
import { _date } from '../../../../utils';
import { Members } from './members';
import { SubmitHandler, useForm } from 'react-hook-form';
// import { axiosInstance } from '../../../../services/axiosInstance';
// import { normalizeFileName } from '../../../../utils';
interface Comments {
  feedback?: string;
  asitec?: string;
}
interface DutyListProps {
  groupUsers: GroupAttendanceRes[];
  idList?: number;
  onSave: () => void;
  hasDuty?: Duty[];
  isToday?: boolean;
  file?: string;
}
const DutyList = ({
  groupUsers,
  idList,
  onSave,
  hasDuty,
}: // isToday,
// file,
DutyListProps) => {
  const [projectList, setProjectList] = useState<ProjectList[]>();
  const [searchTerm, setSearchTerm] = useState('');
  const [editMember, setEditMember] = useState<DutyMember[]>([]);
  const [dutyId, setDutyId] = useState<number>();
  const [index, setIndex] = useState<number>();
  const [dutyItem, setDutyItem] = useState<Duty>();
  const {
    register,
    handleSubmit,
    //setValue,
    reset,
    // watch,
    // formState: { errors },
  } = useForm<Comments[]>();
  const projects = useCallback(() => {
    axiosInstance.get('duty/projects').then(res => setProjectList(res.data));
  }, []);

  useEffect(() => {
    projects();
  }, [idList]);
  useEffect(() => {
    const resetData = hasDuty?.map(() => {
      return {
        feedback: '',
        asitec: '',
      };
    });
    if (resetData) {
      reset({ ...resetData });
    }
  }, [hasDuty, reset]);
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  const filter = useMemo(() => {
    if (searchTerm === '') return [];
    return projectList?.filter(value => value.cui.startsWith(searchTerm));
  }, [searchTerm]);
  const addProject = () => {
    if (!searchTerm) return;
    const data = {
      CUI: filter?.[0].cui,
      project: filter?.[0].projectName,
      listId: idList,
      members: groupUsers.map(({ user }) => {
        return {
          fullName: user.profile.firstName + ' ' + user.profile.lastName,
          status: 'NO APTO',
        };
      }),
    };
    axiosInstance.post(`duty/`, data).then(() => onSave?.());
    // console.log(data)
  };
  const onSubmit: SubmitHandler<Comments[]> = async values => {
    // console.log(values);
    const { CUI, listId, project } = dutyItem as Duty;
    const data = {
      CUI,
      project,
      asitec: values[index as number].asitec,
      feedback: values[index as number].feedback,
      listId,
      members: editMember,
    };
    // console.log(data);
    axiosInstance.patch(`duty/items/${dutyId}`, data).then(() => onSave?.());
  };
  return (
    <div className="dl-content">
      {hasDuty && hasDuty?.length > 0 && (
        <>
          <div className="dl-header">
            <h1 className="dl-title dl-center">#</h1>
            <h1 className="dl-title">CUI</h1>
            <h1 className="dl-title">PROYECTO</h1>
            <h1 className="dl-title dl-center">ESTUDIO BASICOS</h1>
            <h1 className="dl-title dl-center">eNCARGADO</h1>
            <h1 className="dl-title dl-center">AVANCE</h1>
            <h1 className="dl-title">ULTIMA VIDEO CONFERENCIA</h1>
            <h1 className="dl-title">VIDEO CONFERENCIA PROGRAMADA</h1>
            <h1 className="dl-title">SITUACION</h1>
            <h1 className="dl-title">PETICIONES</h1>
            <h1 className="dl-title">OBSERVACIONES</h1>
            <h1 className="dl-title">Asitec</h1>
          </div>
          {hasDuty.map((item, idx) => {
            // console.log(item.feedback);
            return (
              <form
                onSubmit={handleSubmit(onSubmit)}
                key={item.id}
                className="dl-form"
              >
                <div className="dl-body">
                  <div className="dl-list right-border">{idx + 1}</div>
                  <div className="dl-list right-border">{item.CUI}</div>
                  <div className="dl-list right-border">{item.project}</div>
                  <Members
                    members={item.members}
                    dutyId={item.id}
                    onSave={onSave}
                    editMember={setEditMember}
                  />
                  {/* <input className="dl-list" defaultValue={item.feedback} onBlur={e => setFeedback(e.target.value)}/>
                <input className="dl-list" defaultValue={item.asitec} onBlur={e => setAsitec(e.target.value)}/> */}
                  <input
                    {...register(`${idx}.feedback`)}
                    className="dl-list right-border"
                    // defaultValue={item.feedback}
                  />
                  <input
                    {...register(`${idx}.asitec`)}
                    className="dl-list"
                    // defaultValue={item.asitec}
                  />
                </div>
                <Button
                  onClick={() => {
                    setDutyId(item.id);
                    setDutyItem(item);
                    setIndex(idx);
                  }}
                  type="submit"
                  text="Guardar"
                  icon="save"
                  className="dl-save-btn"
                />
              </form>
            );
          })}
        </>
      )}
      <div>
        <Input
          type="text"
          placeholder="CUI"
          label="Buscar CUI de proyecto"
          onChange={handleSearchChange}
          value={searchTerm}
        />
        {filter?.[0] && <h5>{filter?.[0].projectName}</h5>}
        <Button
          onClick={addProject}
          text="Agregar"
          icon="add2"
          className="dl-add-btn"
        />
      </div>
    </div>
  );
};

export default DutyList;
