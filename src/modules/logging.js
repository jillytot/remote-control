const printErrors = true; //only applies to json
const printLog = true;

module.exports.logger = data => {
  let level = data.level || "default";
  const source = data.source || "";
  const message = data.message || data;
  const color = data.color || "blue";

  console.log("something", "something else");

  if (printLog)
    console.log(
      pickLevel(level),
      yellow(source),
      "\n",
      pickColor(color, message)
    );
  return;
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
  if (level === "info") return green("info:");
  if (level === "debug" || level === "default") return purple("debug:");
  if (level === "error") return red("error:");
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
const green = message => `\u001b[1;32m ${message}`;
const yellow = message => `\u001b[1;33m ${message}`;
const blue = message => `\u001b[0;34m ${message}`;
const purple = message => `\u001b[1;35m ${message}`;
const cyan = message => `\u001b[1;36m ${message}`;
const white = message => `\u001b[0;15m ${message}`;
