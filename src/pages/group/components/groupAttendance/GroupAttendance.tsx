import { ListItems } from '..';
import { GroupUsersRes } from '../../types';
import './groupAttendance.css';
interface GroupAttendanceProps {
  groupUsers: GroupUsersRes[];
}
const GroupAttendance = ({ groupUsers }: GroupAttendanceProps) => {
  const handleRadioChange = (status: string, usersId: number) => {
    console.log(status, usersId);
  };
  return (
    <div className="ga-table">
      <div className="ga-header">
        <h1 className="ga-title">#</h1>
        <h1 className="ga-title">NOMBRE</h1>
        <div className="ga-attendance">
          <h1 className="gah-title head-p">P</h1>
          <h1 className="gah-title head-t">T</h1>
          <h1 className="gah-title head-f">F</h1>
          <h1 className="gah-title head-g">G</h1>
          <h1 className="gah-title head-m">M</h1>
          <h1 className="gah-title head-l">L</h1>
        </div>
        <h1 className="ga-title" style={{ textAlign: 'center' }}>
          COMPROMISO DIARIO
        </h1>
      </div>
      {groupUsers &&
        groupUsers.map((item, idx) => (
          <ListItems
            groupUsers={item}
            key={item.id}
            idx={idx}
            onRadioChange={(e, v) => {
              // console.log(e, v);
              handleRadioChange(e, v);
            }}
          />
        ))}
    </div>
  );
};

export default GroupAttendance;
