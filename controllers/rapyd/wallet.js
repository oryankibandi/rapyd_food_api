const axios = require("axios").default;
const base_url = process.env.BASE_URL;
const {
  makeRequest,
  generateRandomString,
} = require("../../utils/signHeaders");

const createWallet = async (userDetails) => {
  const randomString = generateRandomString(8);
  const ewallet_reference_id =
    userDetails.first_name + "-" + userDetails.last_name + "-" + randomString;
  const data = {
    first_name: userDetails.first_name,
    last_name: userDetails.last_name,
    email: userDetails.email,
    ewallet_reference_id: ewallet_reference_id,
    metadata: {
      merchant_defined: true,
    },
    phone_number: userDetails.phone_number,
    type: "person",
    contact: {
      phone_number: userDetails.phone_number,
      email: userDetails.email,
      first_name: "Mark",
      last_name: "Doe",
      mothers_name: "",
      contact_type: "personal",
      address: {
        name: "Mark Doe",
        line_1: "Mahatma Ghandi street",
        line_2: "",
        line_3: "",
        city: "Mumbai",
        state: "",
        country: "IN",
        zip: "",
        phone_number: "",
        metadata: {},
        canton: "",
        district: "",
      },
      identification_type: "PA",
      identification_number: "35589644",
      date_of_birth: "11/22/2000",
      country: "IN",
      nationality: "IN",
      metadata: {
        merchant_defined: true,
      },
    },
  };

  const url = `${base_url}/user`;
  console.log("create_wallet_url: ", url);

  try {
    const result = await makeRequest("POST", "/v1/user", data);

    //console.log("Wallet: ", result);
    return result;
  } catch (error) {
    console.error("Error completing request", error);
    return error;
  }
};
module.exports = { createWallet };
