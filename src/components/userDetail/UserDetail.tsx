// import React from 'react'
import './UserDetail.css';

const UserDetail = ({ user, index }: any) => {
  return (
    <tr>
      <td>{index + 1}</td>
      <td className="user-info">
        <div className="name-container">
          <img src="/svg/Profile Avatar.svg" alt="" className="icon" />
          <h1 className="list-name">
            {user.profile.firstName + ' ' + user.profile.lastName}
          </h1>
        </div>
        <span>{user.email}</span>
      </td>
      <td>{user.workAreaId}</td>
      <td
        className={`list-status ${
          user.status ? 'user-active' : 'user-inactive'
        }`}
      >
        {user.status ? 'Activo' : 'Inactivo'}
      </td>
      <td>{user.profile.dni}</td>
      <td>{user.profile.phone}</td>
      <td>&#9997; &#10060;</td>
    </tr>
  );
};

export default UserDetail;
