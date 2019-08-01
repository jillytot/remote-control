import React from "react";
import "../../styles/common.css";

const TextArea = ({
  name,
  label,
  error,
  type,
  ref,
  rows,
  cols,
  populate,
  value,
  ...rest
}) => {
  console.log("Input Props: ", populate);

  const getType = () => {
    if (type === "chat") return "chat-input";
    if (type === "JSON") return "json-input";
    return "form-control";
  };

  return (
    <React.Fragment>
      <div className="form-container">
        <div className="form-group">
          {label ? (
            <label className="form-label" htmlFor={name}>
              {label}
            </label>
          ) : (
            <React.Fragment />
          )}
          <textarea
            {...rest}
            ref={ref}
            type={type}
            name={name}
            className={getType()}
            autoComplete={type === "chat" ? "off" : ""}
            rows={rows || 2}
            cols={cols || 30}
            value={value || populate}
          >
            Hi
          </textarea>
        </div>
        {type === "chat" ||
          (error && <div className="alert alert-danger">{error}</div>)}
      </div>
    </React.Fragment>
  );
};

export default TextArea;
