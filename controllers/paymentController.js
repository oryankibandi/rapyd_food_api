const { listPaymentMethodByCountry, payWithCard } = require("./rapyd/collect");
const { filterListPaymentMethods } = require("../utils/filter");

const listPaymentByCountry = async (req, res) => {
  const country = req.country;
  const { currency } = req.query;
  console.log("params", currency);

  if (!country) {
    return res.status(401).json({
      status: "ERROR",
      message: "country not found in accesstoken",
    });
  }

  if (!currency) {
    return res.status(404).json({
      status: " ERROR",
      message: "currency parameter not found",
    });
  }

  await listPaymentMethodByCountry(country, currency)
    .then((resp) => {
      // console.log("resp: ", resp);
      if (resp.statusCode != 200) {
        return res.status(resp.statusCode).json(resp.body.status);
      }
      const filteredData = filterListPaymentMethods(resp.body.data);

      return res.status(200).json({
        status: "SUCCESS",
        data: filteredData,
      });
    })
    .catch((err) => console.log("Sth went wrong: ", err));
};

const createCardPayment = async (req, res) => {
  const payload = req.body;

  //validate card details
  if (!payload.amount || !payload.currency) {
    return res.status(402).json({
      status: "ERROR",
      message: "amount ,currency or customer not specified",
    });
  }
  if (!payload.payment_method.type) {
    return res.status(402).json({
      status: "ERROR",
      message: "Payment method not specified",
    });
  }
  if (!payload.payment_method.fields) {
    return res.status(402).json({
      status: "ERROR",
      message: "Card fields not provided",
    });
  }
  if (!payload.payment_method.fields["number"]) {
    return res.status(402).json({
      status: "ERROR",
      message: "Card number not provided",
    });
  }
  if (!payload.payment_method.fields["expiration_month"]) {
    return res.status(402).json({
      status: "ERROR",
      message: "Card expiration_month not provided",
    });
  }
  if (!payload.payment_method.fields["expiration_year"]) {
    return res.status(402).json({
      status: "ERROR",
      message: "Card expiration_year not provided",
    });
  }
  if (!payload.payment_method.fields["name"]) {
    return res.status(402).json({
      status: "ERROR",
      message: "Name on card not provided",
    });
  }
  if (!payload.payment_method.fields["cvv"]) {
    return res.status(402).json({
      status: "ERROR",
      message: "Card cvv not provided",
    });
  }
  payload.customer = req.cus_id;
  payload.capture = true;
  payload.payment_method.metadata = {
    merchant_defined: true,
  };
  console.log("Payload: ", payload);
  await payWithCard(payload)
    .then((resp) => {
      if (resp.statusCode != 200) {
        return res.status(resp.statusCode).json(resp.body.status);
      }
      return res.status(200).json({
        status: "SUCCESS",
        data: {
          id: resp.body.data.id,
          amount: resp.body.data.amount,
          status: resp.body.data.status,
          payment_method_data: resp.body.data.payment_method_data,
          created_at: resp.body.data.created_at,
          paid_at: resp.body.data.paid_at,
        },
      });
    })
    .catch((err) => {
      console.error("STH went wrong: ", err);
      return res.status(500).json(err);
    });
};

module.exports = { listPaymentByCountry, createCardPayment };
