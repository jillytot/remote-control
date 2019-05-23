import React from "react";
import Login from "./login/login";
import User from "./nav/user";
import Signup from "./login/signup";
import RobotServer from "./robotServer/robotServer";

const Layout = ({ socket, user, setUser, handleAuth }) => {
  return (
    <React.Fragment>
      {socket ? (
        <React.Fragment>
          {user ? (
            <React.Fragment>
              <User user={user} socket={socket} />
              <RobotServer socket={socket} user={user} />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Signup
                socket={socket}
                setUser={setUser}
                handleAuth={handleAuth}
              />
              ... or login ...
              <Login
                socket={socket}
                setUser={setUser}
                handleAuth={handleAuth}
              />
            </React.Fragment>
          )}
        </React.Fragment>
      ) : (
        <div> ...Connection To Server Offline... </div>
      )}
    </React.Fragment>
  );
};

export default Layout;
