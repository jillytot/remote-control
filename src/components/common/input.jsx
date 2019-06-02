import React from "react";
import "../../styles/common.css";

const Input = ({ name, label, error, ...rest }) => {
  return (
    <React.Fragment>
      <div className="form-container">
        <div className="form-group">
          <label className="form-label" htmlFor={name}>
            {label}
          </label>
          <input {...rest} id={name} name={name} className="form-control" />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
      </div>
    </React.Fragment>
  );
};

export default Input;
