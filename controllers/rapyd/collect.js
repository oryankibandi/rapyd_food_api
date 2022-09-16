const { makeRequest } = require("../../utils/signHeaders");
const { generateUuid } = require("../../utils/generateUuid");

const createCustomerWithoutPayment = async ({
  email,
  ewallet,
  phone_number,
  first_name,
  last_name,
}) => {
  if (!email) return "email is required";
  if (!ewallet) return "ewallet id is required";
  if (!phone_number) return "phone number is required";

  const vat_id = generateUuid(email);

  const data = {
    business_vat_id: vat_id,
    email: email,
    ewallet: ewallet.id,
    invoice_prefix: `${first_name[0]}${last_name[0]}`,
    metadata: {
      merchant_defined: true,
    },
    name: `${first_name} ${last_name}`,
    phone_number: phone_number,
  };

  try {
    const result = await makeRequest("POST", "/v1/customers", data);
    //console.log("Customer: ", result);
    return result;
  } catch (error) {
    console.error("Error completing request", error);
    return error;
  }
};

const listPaymentMethodByCountry = async (country, currency) => {
  //console.log("country to check: ", country);
  const path = `/v1/payment_methods/country?country=${country}&currency=${currency}`;
  console.log("PATH: ", path);
  try {
    const result = await makeRequest("GET", path);
    return result;
  } catch (error) {
    console.error("Error completing request:", error);
    return error;
  }
};

const payWithCard = async (payload) => {
  const path = "/v1/payments";

  try {
    const result = await makeRequest("POST", path, payload);
    return result;
  } catch (error) {
    console.error("Error completing request:", error);
    return error;
  }
};

const listCountries = async () => {
  const path = "/v1/data/countries";

  try {
    const result = await makeRequest("GET", path);
    return result;
  } catch (error) {
    console.error("Error completing request:", error);
    return error;
  }
};

module.exports = {
  createCustomerWithoutPayment,
  listPaymentMethodByCountry,
  payWithCard,
  listCountries,
};
