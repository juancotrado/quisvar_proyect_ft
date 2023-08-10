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
import { CardGenerateReport, Input } from '../../components';
import { SubmitHandler, useForm } from 'react-hook-form';
import formatDate, { getTimeOut, parseUTC } from '../../utils/formatDate';
import { isOpenModal$ } from '../../services/sharingSubject';

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
  //const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const { userSession } = useSelector((state: RootState) => state);
  const [specialities, setSpecialities] = useState<Options[] | null>(null);
  const [projects, setProjects] = useState<Options[]>();
  const { id } = userSession;
  const [subTask, setSubTask] = useState<SubtaskIncludes[] | null>(null);

  //const { register, handleSubmit } = useForm<DateRange>();

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

    axiosInstance
      .get(`/reports/user/?initial=${initial}&until=${until}&status=DONE`)
      .then(res => handleEditExcel(res.data, initialDate, untilDate));
  };
  const handleEditExcel = async (
    data: ProjectReport[],
    initialDate: string,
    untilDate: string
  ) => {
    // Cargar la plantilla desde un archivo
    const { firstName, lastName, dni, phone } = userSession.profile;
    const response = await fetch('/templates/report_templateV4.xlsx');
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
      projectRow.getCell('B').border = {
        left: { style: 'medium' },
        right: { style: 'medium' },
      };
      projectRow.getCell('J').border = {
        left: { style: 'thin' },
        right: { style: 'medium' },
      };
      projectRow.getCell('D').border = {
        left: { style: 'thin' },
        right: { style: 'thin' },
      };
      projectRow.getCell('F').border = {
        left: { style: 'thin' },
        right: { style: 'thin' },
      };
      projectRow.getCell('H').border = {
        left: { style: 'thin' },
        right: { style: 'thin' },
      };
      for (let col = 2; col <= 10; col++) {
        const projectCell = projectRow.getCell(col);
        projectCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D9E1F2' },
        };
      }
      projectRow.getCell;
      rowNumber++;
      project.subtasks.forEach(subTask => {
        const subtaskRow = wk.insertRow(rowNumber, [
          null,
          subTask.item,
          subTask.name.toUpperCase(),
          +subTask.price,
          parseUTC(subTask.assignedAt),
          parseUTC(subTask.untilDate),
          subTask.percentage / 100,
          subTask.status == 'DONE' ? 0.3 : 0.7,
          null,
          getTimeOut(subTask.assignedAt, subTask.untilDate) + ' Horas',
        ]);
        // wk.mergeCells(`C${rowNumber}:D${rowNumber}`);
        subtaskRow.getCell('B').border = {
          left: { style: 'medium' },
          right: { style: 'medium' },
        };
        subtaskRow.getCell('J').border = {
          left: { style: 'thin' },
          right: { style: 'medium' },
        };

        subtaskRow.getCell('D').border = {
          left: { style: 'thin' },
          right: { style: 'thin' },
        };
        subtaskRow.getCell('F').border = {
          left: { style: 'thin' },
          right: { style: 'thin' },
        };
        subtaskRow.getCell('H').border = {
          left: { style: 'thin' },
          right: { style: 'thin' },
        };
        subtaskRow.getCell('C').font = {
          bold: true,
          color: { argb: '4472C4' },
        };
        subtaskRow.getCell('I').value = {
          formula: `=+D${rowNumber}*G${rowNumber}`,
          date1904: false,
        };
        subtaskRow.getCell('I').numFmt =
          '_-"S/"* #,##0.00_-;-"S/"* #,##0.00_-;_-"S/"* "-"??_-;_-@_-';
        subtaskRow.getCell('D').numFmt =
          '_-"S/"* #,##0.00_-;-"S/"* #,##0.00_-;_-"S/"* "-"??_-;_-@_-';
        subtaskRow.getCell('G').numFmt = '0%';
        subtaskRow.getCell('H').numFmt = '0%';
        rowNumber++;
      });
    });
    const endLine = rowNumber;

    const sumTotalCell = 'I' + (endLine + 2);
    wk.getCell(sumTotalCell).value = {
      formula: `SUM(I28:G${endLine})`,
      date1904: false,
    };
    const salaryAdvanceCell = 'I' + (endLine + 3);
    wk.getCell(salaryAdvanceCell).value = {
      formula: `${sumTotalCell}*30/100`,
      date1904: false,
    };
    wk.getCell('I' + (endLine + 6)).value = {
      formula: `${salaryAdvanceCell}-I${endLine + 4}-I${endLine + 5}`,
      date1904: false,
    };
    wk.getCell(`I${endLine + 7}`).value = {
      formula: `${sumTotalCell}-${salaryAdvanceCell}`,
      date1904: false,
    };
    wk.getCell('H18').value = {
      formula: `=${salaryAdvanceCell}`,
      date1904: false,
    };
    wk.mergeCells(`H${endLine + 10}:I${endLine + 10}`);
    wk.mergeCells(`H${endLine + 11}:I${endLine + 11}`);
    const dniFinishcell = wk.getCell(`H${endLine + 10}`);
    dniFinishcell.value = 'DNI: ' + dni;
    dniFinishcell.font = {
      bold: true,
    };
    dniFinishcell.border = {
      top: { style: 'medium' },
    };
    dniFinishcell.alignment = { vertical: 'middle', horizontal: 'center' };
    const fullNameCell = wk.getCell(`H${endLine + 11}`);
    fullNameCell.value = firstName + ' ' + lastName;
    fullNameCell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    wk.pageSetup.printArea = 'A1:K' + (endLine + 13);

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
  const showModal = () => {
    isOpenModal$.setSubject = true;
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
      <div className="generate-report">
        {isOn && (
          // <CardGenerateReport />
          <Button onClick={showModal} text="Generar Reporte" />
          // <div>
          //   <form onSubmit={handleSubmit(onSubmitDateRange)}>
          //     <Input
          //       type="date"
          //       {...register('initial')}
          //       name="initial"
          //       label="Inicio"
          //     ></Input>
          //     <Input
          //       type="date"
          //       {...register('until')}
          //       name="until"
          //       label="Fin"
          //     ></Input>
          //     <Button text="Generar Reporte" />
          //   </form>
          // </div>
        )}
      </div>
      <CardGenerateReport />
    </div>
  );
};

export default ListPersonalTask;
