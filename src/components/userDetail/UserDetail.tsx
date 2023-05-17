// import React from 'react'
import './UserDetail.css';

const UserDetail = ({ user, index }: any) => {
  return (
    <tr>
      <td>{index + 1}</td>
      <td className="user-info">
        <div className="name-container">
          <img src="/svg/Profile Avatar.svg" alt="" className="icon" />
          <h1 className="list-name">{user.name}</h1>
        </div>
        <span>{user.name}@gmail.com</span>
      </td>
      <td>{user.area}</td>
      <td
        className={`list-status ${
          user.status ? 'user-active' : 'user-inactive'
        }`}
      >
        {user.status}
      </td>
      <td>{user.dni}</td>
      <td>{user.phone}</td>
      <td>&#9997; &#10060;</td>
    </tr>
  );
};

export default UserDetail;
