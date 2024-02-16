import { useCallback, useEffect, useState } from 'react';
import { Button, Input, Select } from '../../../../components';
import './groupMeetingFilter.css';
import { axiosInstance } from '../../../../services/axiosInstance';
import { Group } from '../../../../types';
import { SubmitHandler, useForm } from 'react-hook-form';
import { GroupRes } from '../../types';
import { _date, formatDate } from '../../../../utils';
import { DutyPdf } from '../groupContent/views';

const GroupMeetingFilter = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [groups, setGroups] = useState<Group[]>();
  const [items, setItems] = useState<GroupRes[]>();
  const getgroups = useCallback(async () => {
    await axiosInstance.get('/groups/all').then(res => setGroups(res.data));
  }, []);
  const {
    register,
    handleSubmit,
    // setValue,
    // reset,
    // watch,
    // formState: { errors },
  } = useForm<any>();
  useEffect(() => {
    getgroups();
  }, []);

  const onSubmit: SubmitHandler<any> = values => {
    axiosInstance
      .get(
        `/attendanceGroup/filter/${values.groupId}?startDate=${values.startDate}&endDate=${values.endDate}`
      )
      .then(res => {
        setItems(res.data);
      });
  };

  return (
    <div className="gmf-content">
      <h1 className="gr-title">REUNIONES</h1>
      <section className="gmf-information">
        <form onSubmit={handleSubmit(onSubmit)} className="gmf-filters">
          <Input
            {...register('startDate', { required: true })}
            name="startDate"
            label="Fecha Inicial"
            type="date"
            defaultValue={startDate}
            classNameMain="gmf-input"
            onChange={e => setStartDate(e.target.value)}
          />
          <Input
            type="date"
            {...register('endDate', { required: true })}
            name="endDate"
            label="Fecha Final"
            defaultValue={endDate}
            classNameMain="gmf-input"
            onChange={e => setEndDate(e.target.value)}
          />
          <div>
            <Select
              {...register('groupId', { required: true })}
              itemKey="id"
              data={groups}
              textField="name"
              name="groupId"
              label="Grupos"
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
        <div className="gmf-table">
          <div className="gmf-header">
            <h1 className="gmf-title">N</h1>
            <h1 className="gmf-title">Fecha</h1>
            <h1 className="gmf-title">Titulo</h1>
            <h1 className="gmf-title">Documento</h1>
          </div>
        </div>
        <div className="gmf-res-content">
          {items &&
            items.map((item, idx) => {
              const info = {
                title: item.title ?? '',
                group: item.groups.name ?? '',
                mod:
                  (item.groups?.moderator?.profile?.firstName ?? '---') +
                  ' ' +
                  (item.groups?.moderator?.profile?.lastName ?? '---'),
                createdAt: item.createdAt as string,
              };
              return (
                <div className="gmf-body" key={item.id}>
                  <h1 className="gmf-item">{idx + 1}</h1>
                  <h1 className="gmf-item">
                    {formatDate(new Date(item.createdAt), {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </h1>
                  <h1 className="gmf-item">{item.title}</h1>
                  <h1 className="gmf-doc">
                    <DutyPdf
                      info={info}
                      attendance={item.attendance}
                      duty={item.duty}
                    />
                  </h1>
                </div>
              );
            })}
        </div>
      </section>
    </div>
  );
};

export default GroupMeetingFilter;
