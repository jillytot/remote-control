import React from "react";
//import Login from "./login/login";
import User from "./nav/user";
import Signup from "./login/signup";
import RobotServer from "./robotServer/robotServer";

const Layout = ({ socket, user, setUser, handleAuth }) => {
  return (
    <React.Fragment>
      {socket !== null ? (
        <React.Fragment>
          {!user ? (
            <Signup socket={socket} setUser={setUser} handleAuth={handleAuth} />
          ) : (
            <React.Fragment>
              <User user={user} socket={socket} />
            </React.Fragment>
          )}
          <RobotServer socket={socket} user={user} />
        </React.Fragment>
      ) : (
        <div> Connection Offline </div>
      )}
    </React.Fragment>
  );
};

export default Layout;
