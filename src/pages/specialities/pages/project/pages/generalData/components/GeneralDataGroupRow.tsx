import { User } from '../../../../../../../types';
import { capitalizeText } from '../../../../../../../utils';
import './generalDataGroupRow.css';
interface GeneralDataGroupRowProps {
  user: User;
  index: number;
}
const GeneralDataGroupRow = ({ user, index }: GeneralDataGroupRowProps) => {
  console.log('users', user);
  return (
    <div key={user.id} className="generalData-infor-group-contain">
      <span className="generalData-infor-group-text generalData-table-text-alter">
        {index}
      </span>
      <span
        className={`generalData-infor-group-text generalData-table-text-alter ${
          index === 1 && 'generalDataGroupRowProps-color-admin'
        }`}
      >
        {user.profile.firstName} {user.profile.lastName}
      </span>
      <span className="generalData-infor-group-text generalData-table-text-alter">
        {capitalizeText(`${user?.role?.name}`)}
      </span>
      <span className="generalData-infor-group-text generalData-table-text-alter">
        {user.profile.job}
      </span>
      <span className="generalData-infor-group-text generalData-table-text-alter">
        {user.profile.degree}
      </span>
    </div>
  );
};

export default GeneralDataGroupRow;
