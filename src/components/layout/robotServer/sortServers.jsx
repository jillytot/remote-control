const sortServers = (robotServers, followedServers, include) => {
  if (include && include === "all")
    return sortAll(robotServers, followedServers);
  if (include && include === "default")
    return defaultSort(robotServers, followedServers);
  return sortFollowed(robotServers, followedServers);
};

const sortAll = (robotServers, followedServers) => {
  let followedLive = [];
  let live = [];
  let followed = [];
  let rest = [];

  robotServers = robotServers.sort(compare);

  robotServers.map(server => {
    if (
      followedServers.includes(server.server_id) &&
      server.status.liveDevices &&
      server.status.liveDevices.length > 0
    ) {
      server.followed = true;
      followedLive.push(server);
    } else if (
      followedServers.includes(server.server_id) &&
      server.status.liveDevices &&
      server.status.liveDevices.length <= 0
    ) {
      server.followed = true;
      followed.push(server);
    } else if (
      server.status.liveDevices &&
      server.status.liveDevices.length > 0
    ) {
      server.followed = false;
      live.push(server);
    } else {
      server.followed = false;
      rest.push(server);
    }
  });

  const sorted = followedLive.concat(followed, live, rest);
  return sorted;
};

const defaultSort = robotServers => {
  let live = [];
  let rest = [];

  // console.log(robotServers);
  robotServers = robotServers.sort(compare);

  robotServers.map(server => {
    if (server.status.liveDevices && server.status.liveDevices.length > 0) {
      // server.followed = false;
      live.push(server);
    } else {
      // server.followed = false;
      rest.push(server);
    }
  });

  const sorted = live.concat(rest);
  // console.log(sorted);
  return sorted;
};

const sortFollowed = (robotServers, followedServers) => {
  let followedLive = [];
  let followed = [];

  robotServers = robotServers.sort(compare);
  robotServers.map(server => {
    if (
      followedServers.includes(server.server_id) &&
      server.status.liveDevices &&
      server.status.liveDevices.length > 0
    ) {
      server.followed = true;
      followedLive.push(server);
    } else if (
      followedServers.includes(server.server_id) &&
      server.status.liveDevices &&
      server.status.liveDevices.length <= 0
    ) {
      server.followed = true;
      followed.push(server);
    }
  });

  const sorted = followedLive.concat(followed);
  return sorted;
};

export default sortServers;

const compare = (a, b) => {
  const serverA = a.created;
  const serverB = b.created;

  let comparison = 0;
  if (serverA > serverB) {
    comparison = 1;
  } else if (serverA < serverB) {
    comparison = -1;
  }
  return comparison * -1;
};
