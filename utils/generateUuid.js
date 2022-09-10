const { uuid, fromString } = require("uuidv4");

const generateUuid = (email) => {
  if (!email) return null;

  const new_uid = fromString(email);
  console.log("uid: ", new_uid);
  return new_uid;
};

module.exports = { generateUuid };
