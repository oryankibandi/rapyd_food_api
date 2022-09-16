const { supportedCountriesList } = require("../data/supportedCountries");

const filterListPaymentMethods = (data) => {
  let filteredData = [];
  data.map((item) => {
    let typeList = item.type.split("_").slice(1);
    let type = typeList.join(" ");
    if (item.category === "card") {
      let filteredItem = {
        name: item.name,
        type: item.type,
        full_name: type,
        category: item.category,
        image: item.image,
      };

      filteredData.push(filteredItem);
    }
  });

  return filteredData;
};

const filterCountries = (countries) => {
  let filteredCountries = [];
  countries.forEach((item) => {
    if (supportedCountriesList.includes(item.name)) {
      let newItem = {};

      newItem.country_name = item.name;
      newItem.country_code = item.iso_alpha2;
      newItem.currency_name = item.currency_name;
      newItem.currency_code = item.currency_code;
      newItem.phone_code = item.phone_code;

      filteredCountries.push(newItem);
    }
  });

  return filteredCountries;
};

module.exports = { filterListPaymentMethods, filterCountries };
