import './subtaskUsers.css';
type DataUser = { id: number; name: string };

interface SubtaskUsersProps {
  usersData: DataUser[];
  handleRemoveUser?: (data: DataUser) => void;
}
const SubtaskUsers = ({ usersData, handleRemoveUser }: SubtaskUsersProps) => {
  return (
    <div className="subtaskUsers-users-contain">
      <h4 className="subtaskUsers-title-information">
        <figure className="subtaskUsers-figure">
          <img src="/svg/user-task.svg" alt="W3Schools" />
        </figure>
        Lista de Usuarios Asignados:
      </h4>
      {usersData.map(_user => (
        <div key={_user.id} className="subtaskUsers-list-user">
          <h5 className="subtaskUsers-user-info">
            <figure className="subtaskUsers-figure">
              <img src="/svg/person-add.svg" alt="W3Schools" />
            </figure>
            {_user.name}
          </h5>
          {handleRemoveUser && (
            <button type="button" onClick={() => handleRemoveUser(_user)}>
              <img src="/svg/close.svg" className="subtaskUsers-user-delete" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default SubtaskUsers;
