const WebSocket = require("ws");
const axios = require("axios");
const Discord = require("discord.js");

const client = new Discord.Client();

const ws = new WebSocket("ws://35.185.203.47:3231");

let firstLoop = false;
const ignoreFirstLoop = false;

ws.on("open", () => {
  console.log("open");
  ws.send(
    JSON.stringify({
      e: "AUTHENTICATE",
      d: { token: "redacted.redacted.redacted" }
    })
  );
});

let validated = null;

ws.on("message", async message => {
  const messageData = JSON.parse(message);
  const event = messageData.e;
  const data = messageData.d;

  if (event === "VALIDATED") {
    validated = data;
    console.log("validated", validated);
  }
});

async function checkChannel(channelId) {
  //returns true if online
  try {
    const response = await axios.get(
      `http://dev.remo.tv:1567/receive?name=${channelId}-video`
    );
    console.log("edge case?");
    return false;
  } catch (e) {
    if (e.response.data === "Bad Request\n") {
      return true;
    } else {
      return false;
    }
  }
}

async function getRobotServers() {
  const response = await axios.get(
    "http://35.185.203.47:3231/api/dev/robot-server/list"
  );
  return response.data;
}

setInterval(async () => {
  const onlineChannels = [];
  const servers = await getRobotServers();
  for (server of servers) {
    let unlisted = false;
    if (server.settings && server.settings.unlisted) {
      unlisted = true;
    }
    if (
      server.status &&
      server.status.liveDevices &&
      server.status.liveDevices.length > 0 &&
      unlisted === false
    ) {
      for (channel of server.channels) {
        const channelStatus = await checkChannel(channel.id);
        if (channelStatus && onlineChannels.includes(channel.id) === false) {
          onlineChannels.push(channel.id);
        }

        if (lastChannels.includes(channel.id) === false) {
          if (firstLoop === false || ignoreFirstLoop === false) {
            await announce(server, channel);
          }
        }
      }
    }
  }

  firstLoop = false;

  lastChannels = onlineChannels;
}, 5000);

const randomFooters = [
  "creative random footer 1",
  "creative random footer 2",
  "creative random footer 3"
];

async function announce(server, channel) {
  console.log(server, channel);
  const embed = new Discord.MessageEmbed()
    .setColor("#0ff")
    .setTitle(`${channel.name} just went live in ${server.server_name}!`)
    .setURL(`http://dev.remo.tv:5000/${server.server_name}/${channel.id}`)
    .setAuthor(
      "dev.remo.tv",
      "https://cdn.discordapp.com/avatars/617844654309638174/5dc2eed17b2a4b27d8c4296682221b43.png",
      "http://dev.remo.tv:5000"
    );

  if (channel.id === "chan-5376b814-1908-45d1-bb5e-790a1d05c1b1") {
    embed.setFooter("LED bot is awesome!");
  } else {
    const randomFooter =
      randomFooters[Math.floor(Math.random() * randomFooters.length)];
    embed.setFooter(randomFooter);
  }

  const announceChannel = await client.channels.get("617821476921278484");

  await announceChannel.send(embed);
}

let lastChannels = [];

client.login("redacted");
