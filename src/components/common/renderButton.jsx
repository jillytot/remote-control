import React, { useRef } from "react";

const renderButton = (label, validate) => {
  //   const buttonRef = useRef(label);
  return (
    <button disabled={() => validate()} className="btn ">
      {label}
    </button>
  );
};

export default renderButton;
