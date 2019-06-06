import React from "react";
import "../../styles/common.css";

const Input = ({ name, label, error, type, ...rest }) => {
  // console.log("Input Props: ", type);

  return (
    <React.Fragment>
      <div className="form-container">
        <div className="form-group">
          <label className="form-label" htmlFor={name}>
            {label}
          </label>
          <input
            {...rest}
            id={name}
            name={name}
            className={type === "chat" ? "chat-input" : "form-control"}
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
      </div>
    </React.Fragment>
  );
};

export default Input;
