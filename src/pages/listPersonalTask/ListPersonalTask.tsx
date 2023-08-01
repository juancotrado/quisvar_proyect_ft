import './listpersonalTask.css';
import { ChangeEvent, useEffect, useState } from 'react';
import { axiosInstance } from '../../services/axiosInstance';
import { motion } from 'framer-motion';
import list_icon from '/svg/task_list.svg';
import MyTaskCard from '../../components/shared/card/myTaskCard/MyTaskCard';
import {
  ProjectReport,
  ProjectType,
  SubTask,
  SubtaskIncludes,
} from '../../types/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import SelectOptions from '../../components/shared/select/Select';
import Button from '../../components/shared/button/Button';
import * as ExcelJS from 'exceljs';
import { Input } from '../../components';
import { SubmitHandler, useForm } from 'react-hook-form';
import formatDate from '../../utils/formatDate';

const spring = {
  type: 'spring',
  stiffness: 150,
  damping: 30,
};

interface DateRange {
  initial: string;
  until: string;
}

type Options = { id: number; name: string };

const ListPersonalTask = () => {
  const [isOn, setIsOn] = useState(false);
  // const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const { userSession } = useSelector((state: RootState) => state);
  const [specialities, setSpecialities] = useState<Options[] | null>(null);
  const [projects, setProjects] = useState<Options[]>();
  const { id } = userSession;
  const [subTask, setSubTask] = useState<SubtaskIncludes[] | null>(null);

  const { register, handleSubmit } = useForm<DateRange>();

  useEffect(() => {
    axiosInstance.get(`/users/${id}/subTasks`).then(res => {
      setSubTask(res.data);
      specialitiesList();
    });
  }, [userSession, id]);

  const toggleSwitch = () => {
    setIsOn(!isOn);
  };

  const specialitiesList = async () => {
    return await axiosInstance
      .get(`/specialities`)
      .then(res => setSpecialities(res.data));
  };

  const handleProjectsList = async ({
    target,
  }: ChangeEvent<HTMLSelectElement>) => {
    const specialityId = target.value;
    const res = await axiosInstance.get(`/specialities/${specialityId}`);
    return setProjects(res.data.projects);
  };

  const handleSubTaskList = async ({
    target,
  }: ChangeEvent<HTMLSelectElement>) => {
    const projectId = target.value;
    return await axiosInstance
      .get(`/users/${id}/subTasks?project=${projectId}`)
      .then(res => {
        setSubTask(res.data);
      });
  };
  const onSubmitDateRange: SubmitHandler<DateRange> = data => {
    const { initial, until } = data;
    const dateInitial = formatDate(new Date(initial), {
      day: 'numeric',
      weekday: 'long',
      month: 'long',
      year: 'numeric',
    });
    const dateUntil = formatDate(new Date(until), {
      day: 'numeric',
      weekday: 'long',
      month: 'long',
      year: 'numeric',
    });

    const rangeDate = dateInitial + ' al ' + dateUntil;
    console.log(dateInitial, dateUntil);
    axiosInstance
      .get(`/reports/user/?initial=${initial}&until=${until}`)
      .then(res => handleEditExcel(res.data, rangeDate));
  };
  const handleEditExcel = async (data: ProjectReport[], rangeDate: string) => {
    // Cargar la plantilla desde un archivo
    const { firstName, lastName, dni, phone } = userSession.profile;
    const response = await fetch('/templates/report_template.xlsx');
    const buffer = await response.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);

    // Obtener la hoja de cálculo
    const worksheet = workbook.getWorksheet('PERIDO 18');
    workbook.addWorksheet('sheet', {
      properties: { tabColor: { argb: 'FF00FF00' } },
    });
    // worksheet.autoFilter = {
    //   from: 'A1',
    //   to: 'C1',
    // };
    // worksheet.columns = [
    //   { header: 'Id', key: 'id', width: 10 },
    //   { header: 'Name', key: 'name', width: 32 },
    //   { header: 'D.O.B.', key: 'dob', width: 10, outlineLevel: 1 },
    //   { header: 'Price', key: 'price', width: 10, outlineLevel: 1 },
    // ];
    // worksheet.insertRow(2, {
    //   id: 2,
    //   name: 'John Doe',
    //   dob: new Date(1970, 1, 1),
    //   price: 10,
    // });
    worksheet.getCell('B5').value = firstName + ' ' + lastName;
    worksheet.getCell('H3').value = dni;
    worksheet.getCell('H4').value = phone;
    worksheet.getCell('L1').value = rangeDate;

    let rowNumber = 12;
    data.forEach(project => {
      worksheet.insertRow(rowNumber, [
        '',
        project.name.toUpperCase(),
        '',
        '',
        '',
        '',
        '',
      ]).font = {
        bold: true,
        color: { argb: 'F50000' },
      };
      worksheet.getRow(rowNumber).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'D9E1F2' },
      };
      rowNumber++;
      project.subtasks.forEach(subTask => {
        const priceFinal = +subTask.price * (subTask.percentage / 100);
        worksheet.insertRow(rowNumber, [
          subTask.item,
          subTask.name.toUpperCase(),
          subTask.price,
          subTask.percentage + '%',
          '',
          '',
          priceFinal,
        ]);
        worksheet.getCell('B' + rowNumber).font = {
          bold: true,
          color: { argb: '4472C4' },
        };
        rowNumber++;
      });
    });
    const endLine = rowNumber;

    // console.log(String('J' + endLine));
    // console.log(String('J' + endLine + 3));
    worksheet.getCell(String('G' + (endLine + 1))).value = {
      formula: `SUM(G12:G${endLine})`,
    };
    worksheet.getCell(String('J' + (endLine + 3))).value = dni;
    worksheet.getCell(String('J' + (endLine + 4))).value =
      firstName + ' ' + lastName;

    // worksheet.addTable({
    //   name: 'MyTable',
    //   ref: 'A20',
    //   headerRow: true,
    //   totalsRow: true,
    //   style: {
    //     theme: 'TableStyleDark3',
    //     showRowStripes: true,
    //   },
    //   columns: [
    //     { name: 'Date', totalsRowLabel: 'Totals:', filterButton: true },
    //     { name: 'Amount', totalsRowFunction: 'sum', filterButton: false },
    //   ],
    //   rows: [
    //     [new Date('2019-07-20'), 70.1],
    //     [new Date('2019-07-21'), 70.6],
    //     [new Date('2019-07-22'), 70.1],
    //   ],
    // });

    // const table = worksheet.getTable('GozuDeMrd');
    // const table2 = worksheet.getTable('MyTable');

    // console.log(table);
    // console.log(table2);
    // table.addRow(['gozu de mrd', 100.1,'gozu de mrd','gozu de mrd','gozu de mrd','gozu de mrd','gozu de mrd'], 3);
    // Editar la hoja de cálculo con tus datos

    // worksheet.getCell('B1').value = 'Jhon Carlos Castillo Atencio';

    // worksheet.addRow({id: 2, name: 'Jane Doe', dob: new Date(1965,1,7)});;
    // worksheet.mergeCells('H3:J3');hghhgfg

    // Guardar los cambios en un nuevo archivo o en la misma plantilla
    const editedBuffer = await workbook.xlsx.writeBuffer();
    const editedBlob = new Blob([editedBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const editedUrl = URL.createObjectURL(editedBlob);
    const a = document.createElement('a');
    a.href = editedUrl;
    a.download = 'edited-data.xlsx';
    a.click();
    URL.revokeObjectURL(editedUrl);
  };

  return (
    <div className="my-container-list ">
      <div className="my-title-list">
        <div className="my-title-content">
          <img className="task-icon" src={list_icon} alt="task-list" />
          <h2>Mis tareas</h2>
        </div>
        {specialities && (
          <div className="my-project-list">
            <span>Especialidad: </span>
            <SelectOptions
              data={specialities}
              itemKey="id"
              textField="name"
              name="Speciality"
              onChange={e => handleProjectsList(e)}
              className="my-select-speciality"
            />
            <span>Proyecto: </span>
            <SelectOptions
              data={projects}
              itemKey="id"
              textField="name"
              name="projects"
              onChange={e => handleSubTaskList(e)}
              className="my-select-speciality"
            />
          </div>
        )}
      </div>
      <div className="container-list-task">
        <div className="header-of-header">
          <span>Ordenar por:</span>
          <div className="switch" data-ison={isOn} onClick={toggleSwitch}>
            <motion.div
              className={`handle ${isOn ? 'handle2' : ''}`}
              layout
              transition={spring}
            >
              <span className="span-list-task">
                {isOn ? 'Hecho' : 'En Proceso'}
              </span>
            </motion.div>
          </div>
        </div>
        <div className="cards">
          {subTask &&
            subTask
              ?.filter(({ status }) =>
                !isOn
                  ? ['INREVIEW', 'PROCESS', 'DENIED'].includes(status)
                  : status === 'DONE'
              )
              .map(subTask => (
                <div key={subTask.id} className="sub-cards">
                  <MyTaskCard subTask={subTask} />
                </div>
              ))}
        </div>
      </div>
      <div>
        {isOn && (
          <div>
            <form onSubmit={handleSubmit(onSubmitDateRange)}>
              <Input
                type="date"
                {...register('initial')}
                name="initial"
                label="Inicio"
              ></Input>
              <Input
                type="date"
                {...register('until')}
                name="until"
                label="Fin"
              ></Input>
              <Button text="Generar Reporte" />
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListPersonalTask;
