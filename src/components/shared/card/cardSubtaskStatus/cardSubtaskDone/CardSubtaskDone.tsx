import { SubTask } from '../../../../../types/types';
import SubtaskFile from '../../../../subtasks/subtaskFiles/SubtaskFile';
import SubTaskStatusLabel from '../../../../subtasks/subTaskStatusLabel/SubTaskStatusLabel';
import SubtasksShippingHistory from '../../../../subtasks/subtasksShippingHistory/SubtasksShippingHistory';
import './cardSubtaskDone.css';

interface CardSubtaskDone {
  subTask: SubTask;
}

const CardSubtaskDone = ({ subTask }: CardSubtaskDone) => {
  const { status } = subTask;
  const feedBacksReverse = subTask.feedBacks.reverse();
  return (
    <div className="cardSubtaskDone">
      <section className="cardSubtaskDone-left-details ">
        {subTask.feedBacks.length !== 0 && (
          <SubtasksShippingHistory feedBacks={feedBacksReverse} />
        )}
      </section>
      <section className="cardSubtaskDone-details">
        <SubTaskStatusLabel status={status} />

        <div className="cardSubtaskDone-info">
          <p className="cardSubtaskDone-info-date">Creación: 21/01/23</p>

          <div className="cardSubtaskDone-files-models">
            <h2 className="cardSubtaskDone-files-models-title">
              Archivos Modelo:
            </h2>
            <SubtaskFile
              files={subTask.files}
              typeFile="MATERIAL"
              showDeleteBtn={false}
            />
          </div>
          <h2 className={'cardSubtaskProcess-info-price'}>
            Precio: S/. {subTask.price}
          </h2>
        </div>
      </section>
    </div>
  );
};

export default CardSubtaskDone;
