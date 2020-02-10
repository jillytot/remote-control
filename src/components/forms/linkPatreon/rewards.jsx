import React from "react";
import "./linkPatreon.scss";

const Rewards = ({ reward_id, reward_title, reward_amount }) => {
  console.log(reward_id, reward_title, reward_amount);
  //   console.log(props.props.reward_id);

  let reward = "No reward data found.";
  if (reward_title && reward_id && reward_amount) {
    reward = reward_title;
  }

  return (
    <div className="LinkPatreon__container">
      <div className="LinkPatreon__key">perks: </div>
      <div className="LinkPatreon__value">{reward} </div>
    </div>
  );
};

export default Rewards;
