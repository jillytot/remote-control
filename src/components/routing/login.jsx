import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "../layout/login/login";
import Signup from "../layout/login/signup";

export default class LoginPage extends Component {
    constructor(props){
        super(props)
        this.state = {}
    }

    render(){
        return (
          <React.Fragment>
            <Signup/>
            ... or login ...
            <Login/>
          </React.Fragment>
        )
    }
}