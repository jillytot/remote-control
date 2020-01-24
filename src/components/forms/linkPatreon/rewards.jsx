import React from "react";

const Rewards = ({ reward_id, reward_title, reward_amount }) => {
  console.log(reward_id, reward_title, reward_amount);
  //   console.log(props.props.reward_id);

  let reward = "No reward data found.";
  if (reward_title && reward_id && reward_amount) {
    reward = reward_title;
  }

  return (
    <div className="info-container">
      <div className="info-key">perks: </div>
      <div className="info-value">{reward} </div>
    </div>
  );
};

export default Rewards;

const rewardMap = [
  { reward_id: 4079650, reward_amount: 100 },
  { reward_id: 4079645, reward_amount: 500 }
];
