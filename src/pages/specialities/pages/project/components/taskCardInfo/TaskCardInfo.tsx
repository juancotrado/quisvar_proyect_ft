import { useContext } from 'react';
import { TaskContext } from '../taskCard/TaskCard';
import { PiHourglassMedium } from 'react-icons/pi';
import { PiCalendarDots } from 'react-icons/pi';
import { StatusText } from '../statusText';
import './taskCardInfo.css';

interface DataTaskInfo {
  icon: JSX.Element;
  label: string;
  value: string;
}

const TaskCardInfo = () => {
  const { task } = useContext(TaskContext);

  const data: (DataTaskInfo | JSX.Element)[][] = [
    [
      {
        icon: <PiHourglassMedium />,
        label: 'Dias restantes',
        value: '1.5 días',
      },
      <StatusText status={task.status} />,
    ],
    [
      {
        icon: <PiCalendarDots />,
        label: 'Fecha de inicio',
        value: '8 de setiembre del 2023',
      },
      {
        icon: <PiHourglassMedium />,
        label: 'Total de días',
        value: '2 días',
      },
    ],
  ];
  const isDataTaskInfo = (
    item: DataTaskInfo | JSX.Element
  ): item is DataTaskInfo =>
    item &&
    typeof item === 'object' &&
    'icon' in item &&
    'label' in item &&
    'value' in item;

  return (
    <div className="taskCardInfo">
      {data.map((row, i) => (
        <div
          key={i}
          className="taskCardInfo-row"
          style={{ gridTemplateColumns: `2fr 1fr` }}
        >
          {row.map((item, i) =>
            isDataTaskInfo(item) ? (
              <div className="taskCardInfo-column" key={i}>
                <span className="taskCardInfo-column-value">{item.value}</span>
                <span className="taskCardInfo-column-label">
                  {item.icon} {item.label}
                </span>
              </div>
            ) : (
              <div className="taskCardInfo-column-status" key={i}>
                {item}
              </div>
            )
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskCardInfo;
