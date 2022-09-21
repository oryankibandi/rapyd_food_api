const { listCountries } = require("./rapyd/collect");
const { filterCountries } = require("../utils/filter");
const { supportedCountriesListv2 } = require("../data/supportedCountries");

const getSupportedCountries = async (req, res) => {
  return res.status(200).json({
    status: "SUCCESS",
    data: supportedCountriesListv2,
  });
};

module.exports = { getSupportedCountries };
