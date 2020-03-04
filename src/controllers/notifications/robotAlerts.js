module.exports = robotName => {
  alerts = [
    `Robot ${robotName} is Live!`,
    `Dont panic! Robot ${robotName} is now online! robotYay`
  ];
  const randomIndex = Math.floor(Math.random() * Math.floor(alerts.length));
  return alerts[randomIndex];
};
