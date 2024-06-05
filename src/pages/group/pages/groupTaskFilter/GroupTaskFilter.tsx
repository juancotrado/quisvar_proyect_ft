import { useState } from 'react';
import { useCallback, useEffect } from 'react';
import { Button, Input, Select } from '../../../../components';
import { _date } from '../../../../utils';
import './groupTaskFilter.css';
import { SubmitHandler, useForm } from 'react-hook-form';
import { axiosInstance } from '../../../../services/axiosInstance';
import { Group } from '../../../../types';
import { DayTasks } from '../../types';
import TaskFilterTable from './views/taskFilterTable/TaskFilterTable';
import { Outlet } from 'react-router-dom';
const now = new Date();

interface Filter {
  groupId: number;
}
const GroupTaskFilter = () => {
  const [time, setTime] = useState<string>();
  const [groups, setGroups] = useState<Group[]>();
  const [week, setWeek] = useState<DayTasks[]>();
  const getgroups = useCallback(async () => {
    await axiosInstance.get('/groups/all').then(res => setGroups(res.data));
  }, []);
  const {
    register,
    handleSubmit,
    // setValue,
    // reset,
    watch,
    // formState: { errors },
  } = useForm<Filter>();
  useEffect(() => {
    getgroups();
    getDate(_date(now));
  }, []);
  const onSubmit: SubmitHandler<Filter> = values => {
    axiosInstance
      .get(`dutyMembers/report/${values.groupId}?&date=${time}`)
      .then(res => {
        setWeek(res.data);
      });
  };
  const getDate = (e?: string) => {
    setTime(e);
    axiosInstance
      .get(`dutyMembers/report/${watch('groupId')}?&date=${e}`)
      .then(res => {
        setWeek(res.data);
      });
  };
  return (
    <div className="gtf-main">
      <h1 className="gtf-title">TABLERO DE TAREAS</h1>
      <span className="gd-date">
        <img src="/svg/calendary-icon.svg" className="attendance-icon" />
        <Input
          type="date"
          onChange={e => getDate(e.target.value)}
          classNameMain="attendace-date-filter"
          style={{ padding: '0 1rem' }}
          max={_date(now)}
          defaultValue={_date(now)}
        />
        <form onSubmit={handleSubmit(onSubmit)} className="gmf-filters">
          <div>
            <Select
              {...register('groupId')}
              data={groups}
              extractValue={({ id }) => id}
              renderTextField={({ name }) => name}
              placeholder="Grupos"
              name="groupId"
              className="gmf-input"
            />
          </div>
          <Button
            text="Filtrar"
            type="submit"
            className="gmf-btn"
            icon="filter"
          />
        </form>
      </span>
      <div className="gtf-table">
        {week &&
          week.map((day, idx) => <TaskFilterTable data={day} key={idx} />)}
      </div>

      <Outlet />
    </div>
  );
};

export default GroupTaskFilter;
