module.exports = robotName => {
  alerts = [
    `${robotName} is Live!`,
    `Dont panic! ${robotName} is now online! robotYay`
  ];
  const randomIndex = Math.floor(Math.random() * Math.floor(alerts.length));
  return alerts[randomIndex];
};
