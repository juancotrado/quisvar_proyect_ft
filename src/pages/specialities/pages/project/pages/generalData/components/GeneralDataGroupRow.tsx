import { User } from '../../../../../../../types';
import { capitalizeText, getRole } from '../../../../../../../utils';

interface GeneralDataGroupRowProps {
  user: User;
  index: number;
}
const GeneralDataGroupRow = ({ user, index }: GeneralDataGroupRowProps) => {
  return (
    <div key={user.id} className="generalData-infor-group-contain">
      <span className="generalData-infor-group-text generalData-table-text-alter">
        {index}
      </span>
      <span className="generalData-infor-group-text generalData-table-text-alter">
        {user.profile.firstName} {user.profile.lastName}
      </span>
      <span className="generalData-infor-group-text generalData-table-text-alter">
        {capitalizeText(`${getRole(user.role)} ${user.profile.description}`)}
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
