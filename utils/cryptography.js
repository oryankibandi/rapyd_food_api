const bcrypt = require("bcrypt");

const hashString = async (text, saltRounds) => {
  try {
    const hashedText = await bcrypt.hash(text, saltRounds);
    return hashedText;
  } catch (error) {
    console.error("Erro generating hash: ", error);
    return null;
  }
};

const compareString = async (text, password) => {
  try {
    const valid = await bcrypt.compare(text, password);
    return valid;
  } catch (error) {
    console.log("Error while comparing passwords", error);
  }
};
module.exports = { hashString, compareString };
