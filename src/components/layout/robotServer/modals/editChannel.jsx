import React from "react";

const EditChannel = ({ channel, server, user, modal, onCloseModal }) => {
  if (server.owner_id === user.id) {
    return (
      <React.Fragment>
        <div
          className="edit-channel"
          onClick={() => modal(handleModal(onCloseModal))}
        >
          ...
        </div>
      </React.Fragment>
    );
  } else {
    return <React.Fragment />;
  }
};

export default EditChannel;

const handleModal = ({ onCloseModal }) => {
  return [
    {
      body: <div onCloseModal={onCloseModal}> Hi </div>
    },
    { header: "" },
    { footer: "" }
  ];
};
