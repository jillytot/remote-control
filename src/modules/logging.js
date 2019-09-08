const printErrors = true;

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
