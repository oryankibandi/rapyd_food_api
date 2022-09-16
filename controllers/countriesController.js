const { listCountries } = require("./rapyd/collect");
const { filterCountries } = require("../utils/filter");
const { supportedCountriesListv2 } = require("../data/supportedCountries");

const getSupportedCountries = async (req, res) => {
  // const supportedCountries = await listCountries()
  //   .then((resp) => {
  //     if (resp.statusCode != 200) {
  //       return res.status(resp.statusCode).json(resp.body.status);
  //     }
  //     //console.log("resp: ", resp);

  //     const filteredCountries = filterCountries(resp.body.data);
  //     return res.status(200).json({
  //       status: "SUCCESS",
  //       data: filteredCountries,
  //     });
  //   })
  //   .catch((err) => {
  //     console.log("STH went wrong: ", err);
  //     return res.status(500).json(err);
  //   });

  return res.status(200).json({
    status: "SUCCESS",
    data: supportedCountriesListv2,
  });
};

module.exports = { getSupportedCountries };
