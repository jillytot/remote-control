import React, { Component } from "react";
import Form from "../../../common/form";
import axios from "axios";
import { invite, disableInvite } from "../../../../config/client/index";

export default class MakeInviteForm extends Form {
  state = { data: {} };
  schema = {};

  componentDidMount() {
    this.setState({ invites: this.props.invites });
  }

  handleDelete = async e => {
    const token = localStorage.getItem("token");
    axios
      .post(disableInvite, e, {
        headers: { authorization: `Bearer ${token}` }
      })
      .then(res => {
        if (res.data && !res.data.error) {
          let invites = [];
          this.state.invites.forEach(invite => {
            if (invite.id === res.data.id) {
              //do nothing
            } else {
              invites.push(invite);
            }
          });
          this.setState({ invites: invites });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  doSubmit = async () => {
    const token = localStorage.getItem("token");
    const { server_id } = this.props.server;
    await axios
      .post(
        invite,
        { server_id: server_id },
        {
          headers: { authorization: `Bearer ${token}` }
        }
      )
      .then(res => {
        if (res.data && !res.data.error) {
          let { invites } = this.state;
          invites.push(res.data);
          // console.log(res.data, invites);
          this.setState({ invites: invites });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  printInvites = () => {
    const { invites } = this.state;
    // console.log(invites, this.state);
    if (invites)
      return invites.map((invite, index) => {
        if (invite.alias && !invite.is_default)
          return (
            <PrintInvite
              invite={invite}
              onDelete={this.handleDelete}
              key={index}
            />
          );
        return <React.Fragment key={index} />;
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
    copySuccess: "",
    confirmDelete: false
  };

  handleCopy = e => {
    this.textArea.select();
    document.execCommand("copy");
    e.target.focus();
    this.setState({ copySuccess: "Copied!" });
  };

  handleConfirmDelete = () => {
    const { invite, onDelete } = this.props;
    const { confirmDelete } = this.state;

    if (!confirmDelete) {
      return (
        <div
          className="delete-invite"
          onClick={() => {
            this.setState({ confirmDelete: true });
          }}
        >
          delete
        </div>
      );
    }
    return (
      <React.Fragment>
        <div className="confirm-delete">
          {" "}
          confirm delete ?{" "}
          <div
            className="delete-invite"
            onClick={() => {
              this.setState({ confirmDelete: false });
              onDelete(invite);
            }}
          >
            Yes
          </div>
          <div className="margin-left-12"> / </div>
          <div
            className="delete-invite"
            onClick={() => {
              this.setState({ confirmDelete: false });
            }}
          >
            No
          </div>
        </div>
      </React.Fragment>
    );
  };

  render() {
    const { invite } = this.props;
    return (
      <div className="invite-container">
        <textarea
          className="invite-id"
          ref={textarea => (this.textArea = textarea)}
          value={`https://remo.tv/join/${invite.alias}`}
          readOnly
        />
        <div className="actions-container">
          <div className="invite-actions">
            <div className="copy-to-clipboard" onClick={this.handleCopy}>
              copy to clipboard
            </div>
            <div className="copy-success">{this.state.copySuccess}</div>
          </div>
          {this.handleConfirmDelete()}
        </div>
      </div>
    );
  }
}
