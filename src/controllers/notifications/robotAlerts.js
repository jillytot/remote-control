module.exports = (robotName, serverName) => {
  let alerts = [];

  const chatAlerts = [
    `Robot ${robotName} is Live!`,
    `Dont panic! Robot ${robotName} is now online! robotYay`,
    `${robotName} is now online, you have 10 seconds to comply!`
  ];

  const emailAlerts = [
    `${robotName} just went live on ${serverName}`,
    `The robot revolution is nigh! ${robotName} just went live on ${serverName}`
    // `${robotName} just went live on ${serverName}, you have 10 seconds to comply!`
  ];

  if (serverName) alerts = emailAlerts;
  else alerts = chatAlerts;
  const randomIndex = Math.floor(Math.random() * Math.floor(alerts.length));
  return alerts[randomIndex];
};
