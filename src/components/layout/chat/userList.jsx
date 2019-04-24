import React from "react";

const UserList = ({ users }) => {
  console.log("Users from UserList", users);
  return (
    <div className="user-list-container">
      <div className="ulist">
        {Object.keys(users).map(user => {
          let { name, id } = users[user];
          return (
            <div className="user-list" key={id}>
              {name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserList;
