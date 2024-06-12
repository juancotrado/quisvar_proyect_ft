import { useContext } from 'react';
import { IconActionExtend } from '../../../../../../components';
import { ProjectContext } from '../../../../../../context';
import { useParams } from 'react-router-dom';

const DaysTaskEdit = () => {
  const { stageId } = useParams();
  const { handleIsEditDayTask, dayTask, handleSaveDaysTask } =
    useContext(ProjectContext);
  return (
    <IconActionExtend
      iconPrimary={dayTask.isEdit ? 'icon_save' : 'day-edit'}
      fontWeightPrimary={dayTask.isEdit ? '600' : '500'}
      onClickPrimary={
        dayTask.isEdit ? () => handleSaveDaysTask(stageId) : handleIsEditDayTask
      }
      onClickSecondary={handleIsEditDayTask}
      textPrimary={dayTask.isEdit ? 'Guardar dias' : 'Editar dias'}
      viewIconSecondary={dayTask.isEdit}
    />
  );
};

export default DaysTaskEdit;
