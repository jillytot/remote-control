module.exports = (robotName, serverName = serverName || "") => {
  let alerts = [];

  const chatAlerts = [
    `Robot ${robotName} is Live!`,
    `Dont panic! Robot ${robotName} is now online! robotYay`
  ];

  const emailAlerts = [
    `${robot} just went live on ${serverName}`,
    `The robot revolution is nigh! ${robot} just went live on ${serverName}`
  ];

  if (serverName !== "") alerts = emailAlerts;
  else alerts = chatAlerts;
  const randomIndex = Math.floor(Math.random() * Math.floor(alerts.length));
  return alerts[randomIndex];
};
