import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  LoaderText,
  TextArea,
} from '../../../../../../../../components';
import { SubTask } from '../../../../../../../../types';
import './cardSubtaskHold.css';
import { useListUsers } from '../../../../../../../../hooks';
import { SubtaskFile, TaskInputPercentage } from '../../components';
import { RootState } from '../../../../../../../../store';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import {
  TaskCardSelect,
  TaskCardInfo,
  TaskCardHeader,
  TaskCard,
  TaskCardUpload,
} from '../../../../components';
import {
  FeedbackType,
  TaskPermission,
  TaskStatus,
  taskLoaderText,
} from '../../../../models';
import { useAssignUserTask, useReviewTask } from '../../hooks';
import { TbFiles } from 'react-icons/tb';
import TaskCardUploadNormal from '../../../../components/taskCardUpload/TaskCardUploadNormal';
import useSendToReview from '../../hooks/useSendToReview';
import { TaskFeedbackInfo } from '../../components/taskFeedbackInfo';
import { TaskHistory } from '../../components/taskHistory';

interface CardSubtaskHoldGeneral {
  task: SubTask;
}

const CardSubtaskHoldGeneral = ({ task }: CardSubtaskHoldGeneral) => {
  const { users } = useListUsers(null, 'especialidades');
  const userSession = useSelector((state: RootState) => state.userSession);
  const userOption = useMemo(
    () =>
      users.map(user => ({
        ...user,
        value: user.id.toString(),
        label: user.name,
      })),
    [users]
  );

  const [percentage, setPercentage] = useState(0);
  useEffect(() => {
    const percentageValue = task?.lastFeedback?.percentage;
    if (percentageValue) {
      setPercentage(percentageValue);
    }
  }, [task?.lastFeedback?.percentage]);

  const {
    onAssignUser,
    assignedUser,
    onChangeAssignedUser,
    onChangeModerator,
  } = useAssignUserTask(task.id);

  const { feedback, onChangeFeedBack, reviewTask } = useReviewTask({
    task,
    percentage,
  });

  const { sendToReview, setReviewFiles, reviewFiles } = useSendToReview({
    taskId: task.id,
    percentage,
  });

  // task.status = TaskStatus.INREVIEW;
  return (
    <TaskCard task={task}>
      {({ hasPermission, userInCharge, modInCharge, viewHistory }) => (
        <PanelGroup direction="horizontal">
          <Panel defaultSize={65} order={1} className="task-left">
            <div style={{ overflow: 'hidden', height: '100%' }}>
              <TaskCardHeader />
              {viewHistory ? (
                <TaskHistory />
              ) : (
                <div className="task-left-contain">
                  <div className="task-dhyrium-contain">
                    {hasPermission(TaskPermission.VIEW_DELIVERABLES) && (
                      <div className="task-upload-contain">
                        <h2 className="task-label">
                          <TbFiles size={21} color={'black'} />
                          Entregables
                        </h2>
                        {hasPermission(
                          TaskPermission.DELETE_UPLOAD_DELIVERABLES
                        ) ? (
                          <TaskCardUploadNormal
                            onChange={setReviewFiles}
                            value={reviewFiles}
                          />
                        ) : (
                          <SubtaskFile files={task.lastFeedback.files} />
                        )}
                      </div>
                    )}
                    {hasPermission(TaskPermission.VIEW_LOADER) && (
                      <LoaderText
                        text={taskLoaderText[task.status] || ''}
                        className="loader-deliverables"
                      />
                    )}

                    {task.status === TaskStatus.UNRESOLVED && (
                      <div className="task-dhyrium">
                        <figure className="task-dhyrium-figure">
                          <img src="/img/DHYRIUM-gray.png" alt="" />
                        </figure>
                        <span className="task-dhyrium-text">DHYRIUM</span>
                      </div>
                    )}
                  </div>
                  <div className="task-left">
                    <div
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'flex-end',
                      }}
                    >
                      <TaskCardSelect
                        key={userInCharge?.id ?? 0}
                        idDefaultValue={userInCharge?.id}
                        label="Encargado:"
                        viewAssigned={hasPermission(
                          TaskPermission.VIEW_ASSIGN_TASK
                        )}
                        onAssigned={() =>
                          onAssignUser(userSession.id, 'technicalId')
                        }
                        options={userOption}
                        onChange={option =>
                          onChangeAssignedUser(
                            option ? option.id : 0,
                            'technicalId'
                          )
                        }
                        isDisabled={
                          !hasPermission(TaskPermission.ASSIGN_USER_TASK)
                        }
                      />
                      {hasPermission(TaskPermission.VIEW_PERCENTAGE) && (
                        <TaskInputPercentage
                          value={percentage}
                          onChange={setPercentage}
                          disabled={
                            !hasPermission(TaskPermission.EDIT_PERCENTAGE)
                          }
                        />
                      )}
                    </div>
                    <TaskCardSelect
                      key={modInCharge?.id ?? 0}
                      idDefaultValue={modInCharge?.id}
                      label="Evaluador:  "
                      options={userOption}
                      onChange={option =>
                        onChangeModerator(
                          option ? option.id : 0,
                          'evaluatorId',
                          modInCharge?.id
                        )
                      }
                      isDisabled={
                        !hasPermission(TaskPermission.ASSIGN_EVALUATOR_TASK)
                      }
                    />
                    {hasPermission(TaskPermission.VIEW_INPUT_FEEDBACK) && (
                      <TextArea
                        placeholder="Añadir comentario"
                        style={{ resize: 'vertical' }}
                        value={feedback}
                        onChange={onChangeFeedBack}
                      />
                    )}
                    {hasPermission(TaskPermission.VIEW_INFO_FEEDBACK) && (
                      <TaskFeedbackInfo />
                    )}
                  </div>
                </div>
              )}
            </div>
            {!viewHistory && (
              <div className="task-left-btns">
                {hasPermission(TaskPermission.ASSIGN_USER_TASK) && (
                  <Button
                    disabled={!assignedUser.technicalId}
                    text="Continuar"
                    position="right"
                    onClick={() =>
                      onAssignUser(assignedUser.technicalId, 'technicalId')
                    }
                  />
                )}
                {hasPermission(TaskPermission.SEND_FOR_REVIEW) && (
                  <Button
                    text="Mandar a revisar"
                    position="right"
                    onClick={sendToReview}
                  />
                )}
                {hasPermission(TaskPermission.REVIEW_TASKS) && (
                  <>
                    <Button
                      text="Corregir"
                      position="left"
                      color={'dark'}
                      onClick={() => reviewTask(FeedbackType.REJECTED)}
                      variant="outline"
                    />
                    <Button
                      text="Revisado"
                      position="right"
                      onClick={() => reviewTask(FeedbackType.ACCEPTED)}
                    />
                  </>
                )}
              </div>
            )}
          </Panel>
          <PanelResizeHandle className="resizable" />
          <Panel defaultSize={35} order={2} className="task-right">
            <TaskCardInfo />
            <TaskCardUpload typeFile="MODEL" label="Archivos modelos" />
          </Panel>
        </PanelGroup>
      )}
    </TaskCard>
  );
};

export default CardSubtaskHoldGeneral;
