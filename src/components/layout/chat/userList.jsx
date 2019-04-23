import React from "react";

const UserList = ({ users }) => {
  console.log("Users from UserList", users);
  return (
    <ul>
      {Object.keys(users).map(user => {
        let { name, id } = users[user];
        return <li key={id}>{name}</li>;
      })}
    </ul>
  );
};

export default UserList;
