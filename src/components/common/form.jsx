import Joi from "joi-browser";
import React, { Component } from "react";
import Input from "./input";
import Select from "./select";
import TextArea from "./textArea";
import TextAreaChat from "./textAreaChat";
//import HotKeyListener from "../hotKeyListener";
import "../../styles/common.css";

class Form extends Component {
  state = {
    data: {},
    errors: {},
    validation: true
  };

  validate = () => {
    //Options for Joi
    const options = { abortEarly: false };

    //Validation using Joi
    const { error } = Joi.validate(this.state.data, this.schema, options);

    if (!error) {
      return null;
    }

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  handleSubmit = e => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    this.doSubmit();
  };

  handleChange = ({ currentTarget: input }) => {
    // console.log(input.value);
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data, errors });
  };

  handleButtonType = label => {
    if (label === "Delete Robot") {
      console.log(label);
      return "btn btn-delete";
    } else if (label === "Chat") {
      return "chat-btn";
    } else {
      return "btn";
    }
  };

  renderButton = label => {
    //require validation?
    if (this.state.validation === true) {
      return (
        <button
          className={this.handleButtonType(label)}
          disabled={this.validate()}
        >
          {label}
        </button>
      );
    }
    return <button className={this.handleButtonType(label)}>{label}</button>;
  };

  renderSelect(name, label, options) {
    const { data, errors } = this.state;

    return (
      <Select
        name={name}
        value={data[name]}
        label={label}
        options={options}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }

  renderInput(name, label, type) {
    const { data, errors } = this.state;
    return (
      <Input
        type={type}
        name={name}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
        value={data[name]}
        passError={e => {
          this.handlePassError(e);
        }}
      />
    );
  }

  handlePassError = e => {
    console.log(e);
    this.setState({ error: e });
  };

  renderTextArea(name, label, type, populate, rows, cols) {
    const { data, errors } = this.state;
    return (
      <TextArea
        type={type}
        name={name}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
        value={data[name]}
        populate={populate}
        rows={rows}
        cols={cols}
      />
    );
  }

  handleKeyPress = e => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      // console.log("ON ENTER", e);
      this.handleSubmit(e); //solution 100
    }
  };

  renderChatInput(name, label, type) {
    const { data, errors } = this.state;
    return (
      <TextAreaChat
        type={type}
        name={name}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
        value={data[name]}
        onKeyDown={e => this.handleKeyPress(e)}
      />
    );
  }
}

export default Form;
