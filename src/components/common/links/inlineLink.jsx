import React from "react";

const InlineLink = ({ link, text }) => {
  return (
    <a
      href={link}
      onClick={e => {
        e.preventDefault();
        window.open(link, "_blank");
      }}
    >
      {text || link}
    </a>
  );
};

export default InlineLink;
