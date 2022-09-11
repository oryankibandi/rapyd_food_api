const filterListPaymentMethods = (data) => {
  let filteredData = [];
  data.map((item) => {
    let typeList = item.type.split("_").slice(1);
    let type = typeList.join(" ");
    let filteredItem = {
      name: item.name,
      type: item.type,
      full_name: type,
      category: item.category,
      image: item.image,
    };

    filteredData.push(filteredItem);
  });

  return filteredData;
};

module.exports = { filterListPaymentMethods };
