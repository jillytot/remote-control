module.exports = username => {
  alerts = [
    `${username} has joined the server!`,
    `Dont panic! ${username} has joined the server.`,
    `${username} has arrived, resistance is futile.`,
    `${username} has hacked into the mainframe.`,
    `${username} detected, raising shields.`,
    `${username} is now one of us! One of us!`,
    `${username} just joined, 10/10 would join again.`,
    `Welcome ${username}! robotYay robotHi`,
    `Program "${username}" has been installed successfully!`
  ];
  const randomIndex = Math.floor(Math.random() * Math.floor(alerts.length));
  return alerts[randomIndex];
};
