import React, {Component} from "react";
import "./user.css";
import "./../../../styles/common.css";
import { LOGOUT } from "../../../events/definitions";
import defaultImages from "../../../imgs/placeholders";
import { Link, Redirect } from "react-router-dom";
import socket from '../../socket';

export default class NavBar extends Component {
  constructor(props){
    super(props)
    this.state = {
      redirect: false
    }
  }

  logout = () => {
    localStorage.removeItem("token");
    socket.emit(LOGOUT)
    this.setState({redirect: true})
  }

  render(){
    return (
      this.state.redirect ? (
        <Redirect to="/login"></Redirect>
      ) : (
        <div className="nav-container">
          <Link to="/">
            {" "}
            <div className="logo-container">
              <img className="logo" alt="" src={defaultImages.remoLogo} />
            </div>
          </Link>

          <div className="user-container">
            <div className="user">
              {this.props.user.username}{" "}
              <button className="user-logout btn" onClick={this.logout}>
                logout
              </button>
            </div>
          </div>
        </div>
      )
    )
  }
}