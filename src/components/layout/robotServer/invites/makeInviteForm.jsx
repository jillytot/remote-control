import React, { Component } from "react";
import Form from "../../../common/form";
//{`https://remo.tv/join/${invite.id}`}

export default class MakeInviteForm extends Form {
  state = { data: {} };

  schema = {};

  doSubmit = () => {
    console.log(this.props);
  };

  printInvites = () => {
    const { invites } = this.props;
    return invites.map(invite => {
      return <PrintInvite invite={invite} />;
    });
  };

  render() {
    return (
      <React.Fragment>
        <div>Invite users to your server by giving them this link.</div>
        <div className="print-invites-container">
          {" "}
          {this.printInvites()}
          <form onSubmit={this.handleSubmit}>
            <div className="invite-form">
              {this.renderButton("Generate New Link")}
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

class PrintInvite extends Component {
  state = {
    copySuccess: ""
  };

  handleCopy = e => {
    this.textArea.select();
    document.execCommand("copy");
    e.target.focus();
    this.setState({ copySuccess: "Copied!" });
  };

  render() {
    const { invite } = this.props;
    return (
      <div className="invite-container">
        <textarea
          className="invite-id"
          ref={textarea => (this.textArea = textarea)}
          value={`https://remo.tv/join/${invite.id}`}
        />
        <div className="invite-actions">
          <div className="copy-to-clipboard" onClick={this.handleCopy}>
            copy to clipboard
          </div>
          <div className="copy-success">{this.state.copySuccess}</div>
        </div>
      </div>
    );
  }
}

/*
Make an invite Alias 
Make sure default Invite doesn't show in the list of invites
Use the invite alias to generate the link. 
*/
