const User = require("../models/userDBSchema");
const Wallet = require("../models/walletDBSchema");
const Customer = require("../models/customerDBSchema");

const createNewUserInDB = async (userDetails) => {
  try {
    const newUser = await User.create({
      first_name: userDetails.first_name,
      last_name: userDetails.last_name,
      email: userDetails.email,
      phone_number: userDetails.phone_number,
      country: userDetails.country,
      business_vat_id: userDetails.customer_details.business_vat_id,
      ewallet_id: userDetails.ewallet.id,
      cus_id: userDetails.customer_details.id,
      password: userDetails.hashedPassword,
    });

    return newUser;
  } catch (error) {
    console.error("Error while creating user: ", error);
    return null;
  }
};

const createNewWalletInDB = async (wallet_details) => {
  try {
    const newWallet = await Wallet.create({
      wallet_id: wallet_details.id,
      status: wallet_details.status,
      verification_status: wallet_details.verification_status,
      type: wallet_details.type,
      metadata: wallet_details.metadata,
      ewallet_reference_id: wallet_details.ewallet_reference_id,
      category: wallet_details.category,
    });

    return newWallet;
  } catch (error) {
    console.error("Error while creating wallet: ", error);
    return null;
  }
};

const createCustomerInDB = async (customer_details) => {
  try {
    const newCustomer = Customer.create({
      customer_id: customer_details.id,
      delinquent: customer_details.delinquent,
      discount: customer_details.discount,
      name: customer_details.name,
      default_payment_method: customer_details.default_payment_method,
      description: customer_details.description,
      phone_number: customer_details.phone_number,
      subscriptions: customer_details.subscriptions,
      created_at: customer_details.created_at,
    });

    return newCustomer;
  } catch (error) {
    console.error("Error while creating customer: ", error);
    return null;
  }
};

const searchDocumentInDB = async (searchParameter, searchValue, Model) => {
  //console.log("In DB controller");
  let searchObj = {};
  searchObj[searchParameter] = searchValue;
  const doc = await Model.findOne(searchObj).exec();

  //console.log("doc:", doc);

  return doc;
};

module.exports = {
  createNewUserInDB,
  createNewWalletInDB,
  createCustomerInDB,
  searchDocumentInDB,
};
