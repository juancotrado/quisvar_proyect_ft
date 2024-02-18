import { GroupRes } from '../../../../types';
import './groupMeetingDetails.css';
interface GroupDetailsProps {
  item: GroupRes;
  onClose: () => void;
}
const GroupMeetingDetails = ({ item, onClose }: GroupDetailsProps) => {
  console.log(item);
  return (
    <div>
      <span onClick={onClose}>x</span>
    </div>
  );
};

export default GroupMeetingDetails;
