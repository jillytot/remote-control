const printErrors = true; //only applies to json
const printLog = true;

module.exports.logger = data => {
  // console.log(data);
  const { logLevel } = require("../config/server/index");
  if (printLog && logLevel === "debug") {
    let level = data.level || "info";
    const source = data.source || "";
    const message = data.message || data;
    const color = data.color || "blue";

    if (Array.isArray(message)) {
      message.forEach((msg, index) => {
        if (index === 0) {
          //print header
          makeLog({
            level: level,
            source: source,
            color: color,
            message: msg
          });
        } else {
          //print remaining messages
          printLine({ color: color, message: msg });
        }
      });
    } else {
      makeLog({
        level: level,
        source: source,
        color: color,
        message: message
      });
    }
  }

  return;
};

const printLine = ({ color = "yellow", message = null }) => {
  console.log(pickColor(color, message));
};

const makeLog = ({
  level = "info",
  source = "unspecified",
  color = "yellow",
  message = ""
}) => {
  console.log(
    pickLevel(level),
    yellow(source),
    "\n",
    pickColor(color, message)
  );
};

module.exports.simpleLog = data => {
  if (printLog) console.log(data);
};

module.exports.jsonError = (error, data, print) => {
  if (printErrors || print) {
    if (data) {
      console.log("error: ", error, "data: ", data);
    } else {
      console.log("error", error);
    }
  }
  return { status: "error!", error: error };
};

const pickLevel = level => {
  if (level === "info") return green("INFO:");
  if (level === "debug" || level === "default") return purple("DEBUG:");
  if (level === "error") return red("ERROR:");
  if (level === "") return level;
};

const pickColor = (color, message) => {
  if (color === "red") return red(message);
  if (color === "green") return green(message);
  if (color === "yellow") return yellow(message);
  if (color === "blue") return blue(message);
  if (color === "purple") return purple(message);
  if (color === "cyan") return cyan(message);
  if (color === "white" || "") return white(message);
};

//4 for underline, 7 for italic, 1 for bold
const red = message => `\u001b[1;31m ${message}`;
const green = message => `\u001b[0;32m ${message}`;
const yellow = message => `\u001b[0;33m ${message}`;
const blue = message => "\u001b[0;34m" + message;
const purple = message => `\u001b[0;35m ${message}`;
const cyan = message => `\u001b[0;36m ${message}`;
const white = message => `\u001b[0;15m ${message}`;

// this.logger({
//   level: "info",
//   source: "modules/logger",
//   message: ["test1", "test2", "test3", { test: "four" }, ["six", "seven"]]
// });
