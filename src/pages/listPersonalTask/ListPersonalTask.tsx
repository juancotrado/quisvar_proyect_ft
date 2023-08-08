import './listpersonalTask.css';
import { ChangeEvent, useEffect, useState } from 'react';
import { axiosInstance } from '../../services/axiosInstance';
import { motion } from 'framer-motion';
import list_icon from '/svg/task_list.svg';
import MyTaskCard from '../../components/shared/card/myTaskCard/MyTaskCard';
import { ProjectReport, SubtaskIncludes } from '../../types/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import SelectOptions from '../../components/shared/select/Select';
import Button from '../../components/shared/button/Button';
import * as ExcelJS from 'exceljs';
import { Input } from '../../components';
import { SubmitHandler, useForm } from 'react-hook-form';
import formatDate, { parseUTC } from '../../utils/formatDate';

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
    const initialDate = formatDate(new Date(initial), {
      day: 'numeric',
      weekday: 'long',
      month: 'long',
      year: 'numeric',
    });
    const untilDate = formatDate(new Date(until), {
      day: 'numeric',
      weekday: 'long',
      month: 'long',
      year: 'numeric',
    });

    const rangeDate = initialDate + ' al ' + untilDate;
    console.log(initialDate, untilDate);
    axiosInstance
      .get(`/reports/user/?initial=${initial}&until=${until}`)
      .then(res => handleEditExcel(res.data, initialDate, untilDate));
  };
  const handleEditExcel = async (
    data: ProjectReport[],
    initialDate: string,
    untilDate: string
  ) => {
    // Cargar la plantilla desde un archivo
    const { firstName, lastName, dni, phone } = userSession.profile;
    const response = await fetch('/templates/report_templateV2.xlsx');
    const buffer = await response.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);

    // Obtener la hoja de cálculo
    const wk = workbook.getWorksheet('PERIDO 18');
    const wk1 = workbook.addWorksheet('sheet');
    // Insertar contenido en las celdas
    wk1.getCell('A1').value = 'Contenido en A1';
    wk1.getCell('A10').value = 'Contenido en A10';

    // Configurar un salto de página después de la fila 10 (A10)
    wk1.getRow(10).addPageBreak(1, 4);

    wk.getCell('E10').value = firstName + ' ' + lastName;
    wk.getCell('D14').value = +dni;
    wk.getCell('D15').value = +phone;
    wk.getCell('E4').value = initialDate;
    wk.getCell('E5').value = untilDate;

    let rowNumber = 28;
    data.forEach(project => {
      const projectRow = wk.insertRow(rowNumber, [
        null,
        project.district,
        project.name.toUpperCase(),
      ]);

      projectRow.font = {
        bold: true,
        color: { argb: 'F50000' },
      };
      projectRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'D9E1F2' },
      };
      rowNumber++;
      project.subtasks.forEach(subTask => {
        const insertedRows = wk.insertRow(rowNumber, [
          null,
          subTask.item,
          subTask.name.toUpperCase(),
          null,
          +subTask.price,
          subTask.status,
          1,
          subTask.percentage / 100,
          subTask.status == 'DONE' ? 0.3 : 0.7,
          null,
          parseUTC(subTask.untilDate),
        ]);

        insertedRows.getCell('C').font = {
          bold: true,
          color: { argb: '4472C4' },
        };
        insertedRows.getCell('J').value = {
          formula: `=+E${rowNumber}*G${rowNumber}*H${rowNumber}*I${rowNumber}`,
          date1904: false,
        };
        insertedRows.getCell('J').numFmt =
          '_-"S/"* #,##0.00_-;-"S/"* #,##0.00_-;_-"S/"* "-"??_-;_-@_-';
        insertedRows.getCell('E').numFmt =
          '_-"S/"* #,##0.00_-;-"S/"* #,##0.00_-;_-"S/"* "-"??_-;_-@_-';
        insertedRows.getCell('G').numFmt = '0%';
        insertedRows.getCell('H').numFmt = '0%';
        insertedRows.getCell('I').numFmt = '0%';
        rowNumber++;
      });
    });
    const endLine = rowNumber;

    // const sumTotalCell = 'G' + (endLine + 1);
    // wk.getCell(sumTotalCell).value = {
    //   formula: `SUM(G12:G${endLine})`,
    //   date1904: false,
    // };
    // wk.getCell('X3').value = {
    //   formula: `=ROUND(${sumTotalCell}*0.3, 0)`,
    //   date1904: false,
    // };
    wk.mergeCells(`I${endLine + 10}:J${endLine + 10}`);
    wk.mergeCells(`I${endLine + 11}:J${endLine + 11}`);
    const dniFinishcell = wk.getCell(`I${endLine + 10}`);
    dniFinishcell.value = 'DNI: ' + dni;
    dniFinishcell.font = {
      bold: true,
    };
    dniFinishcell.border = {
      top: { style: 'medium' },
    };
    dniFinishcell.alignment = { vertical: 'middle', horizontal: 'center' };
    const fullNameCell = wk.getCell(`I${endLine + 11}`);
    fullNameCell.value = firstName + ' ' + lastName;
    fullNameCell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    wk.pageSetup.printArea = 'A1:L' + (endLine + 13);

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
