import React from "react";
import "./inlineInput.scss";

const InlineInput = React.forwardRef((props, ref) => {
  const { name, label, error, type, passError, ...rest } = props;
  return (
    <React.Fragment>
      <label className="inlineInput__label" htmlFor={name}>
        {label}
      </label>
      <input
        {...rest}
        ref={ref}
        type={type}
        name={name}
        className="inlineInput__control"
      />
      {passError(error)}
    </React.Fragment>
  );
});

export default InlineInput;
