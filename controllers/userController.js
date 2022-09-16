require("dotenv").config();
const jwt = require("jsonwebtoken");

const { createWallet } = require("./rapyd/wallet");
const { createCustomerWithoutPayment } = require("./rapyd/collect");
const generateUuid = require("../utils/generateUuid");
const { hashString, compareString } = require("../utils/cryptography");
const {
  createNewUserInDB,
  createNewWalletInDB,
  createCustomerInDB,
} = require("./DBController");
const User = require("../models/userDBSchema");

/*
 * 1) Create-wallet - get wallet-id
 * 2) Creating a customer - get cus_id
 * 3) hash password.
 * 4) store user details in DB
 * 5) return success or failure
 */
const registerUser = async (req, res) => {
  if (req.method != "POST")
    return res.status(400).json({
      error: "Only `POST` method alowed",
    });

  //parameter validation
  const { first_name, last_name, email, phone_number, password, country } =
    req.body;

  if (!first_name || !last_name || !email || !phone_number) {
    return res.status(405).json({
      status: "ERROR",
      message:
        "first_name, last_name, phone_number or email not submitted or invalid",
    });
  }
  if (!password) {
    return res.status(405).json({
      status: "ERROR",
      message: "password not provided",
    });
  }

  if (!country) {
    return res.status(405).json({
      status: "ERROR",
      message: "country not provided",
    });
  }

  //check existing user in DB
  const existing_email = await User.findOne({ email: email }).exec();
  const existing_phone = await User.findOne({
    phone_number: phone_number,
  }).exec();

  if (existing_email || existing_phone) {
    return res.status(400).json({
      status: "ERROR",
      message: "email or phone number already exists",
    });
  }

  let userDetails = req.body;
  //creating a wallet to get wallet_id
  await createWallet({ first_name, last_name, email, phone_number })
    .then((resp) => {
      //console.log("create wallet res: ", resp);
      if (resp.statusCode != 200) {
        return res.status(resp.statusCode).json(resp.body.status);
      }
      userDetails.ewallet = resp.body.data;
    })
    .catch((err) => {
      console.log("STH went wrong: ", err);
      return res.status(500).json(err);
    });

  //creating a customer with the acquired walletid.
  if (userDetails.ewallet) {
    //console.log("UserDetails: ", userDetails);
    await createCustomerWithoutPayment(userDetails)
      .then((resp) => {
        //console.log("Create Cus resp: ", resp);
        if (resp.statusCode != 200) {
          return res.status(resp.statusCode).json(resp.body.status);
        }
        userDetails.customer_details = resp.body.data;
        //return res.status(resp.statusCode).json(userDetails);
      })
      .catch((err) => {
        console.log("STH went wrong: ", err);
        return res.status(500).json(err);
      });
  }

  //hashing password and creating entries in mongoDB
  if (userDetails.customer_details) {
    const hashedPassword = await hashString(userDetails.password, 10);
    userDetails.hashedPassword = hashedPassword;
    const newUser = await createNewUserInDB(userDetails);
    const newWallet = await createNewWalletInDB(userDetails.ewallet);
    const newCustomer = await createCustomerInDB(userDetails.customer_details);

    if (!newUser || !newWallet || !newCustomer) {
      return res.status(500).json({
        status: "ERROR",
        message: "error creating new User in DB",
      });
    }

    return res.status(200).json({
      status: "SUCCESS",
      data: newUser,
    });
  }
};

/*logInUser - logs in a user
 * 1) check if email and password are provided
 * 2) check if email exists in database. If not ask to register
 * 3) Hash password and compare to hashed password in DB
 * 4) Generate access token and refresh token
 * 5) Store refreshtoken in DB
 */
const logInUser = async (req, res) => {
  const { email, password } = req.body;

  //details validation
  if (!email) {
    return res.status(401).json({
      status: "ERROR",
      message: "email not provided",
    });
  }

  if (!password) {
    return res.status(401).json({
      status: "ERROR",
      message: "password not provided",
    });
  }

  const existing_user = await User.findOne({ email: email }).exec();
  if (!existing_user) {
    return res.status(401).json({
      status: "ERROR",
      message: "Email does not exist",
    });
  }

  const validPassword = compareString(password, existing_user.password);
  if (!validPassword) {
    return res.status(401).json({
      status: "ERROR",
      message: "Invalid email or password ",
    });
  }

  const tokenPayload = {
    userData: {
      first_name: existing_user.first_name,
      last_name: existing_user.last_name,
      email: existing_user.email,
      country: existing_user.country,
      cus_id: existing_user.cus_id,
    },
  };

  const accessToken = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "6h",
  });
  const refreshToken = jwt.sign(
    tokenPayload,
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  await User.findOneAndUpdate({ email: email }, { refreshToken: refreshToken });

  res.cookie("jwt", refreshToken, {
    httpOnly: false,
    maxAge: 24 * 60 * 60 * 1000,
    // sameSite: "None",
    // secure: true,
  });

  res.status(200).json({
    status: "SUCCESS",
    data: {
      user: {
        first_name: existing_user.first_name,
        last_name: existing_user.last_name,
        email: existing_user.email,
        country: existing_user.country,
        cus_id: existing_user.cus_id,
        ewallet_id: existing_user.ewallet_id,
        business_vat_id: existing_user.business_vat_id,
      },
      accessToken: accessToken,
    },
  });
};

const logOut = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies.jwt) {
    return res.status(401).json({
      status: "ERROR",
      message: "Cookies not found",
    });
  }

  console.log("cookies: ", cookies);

  const refreshToken = cookies.jwt;
  const user = await User.findOne({ refreshToken: refreshToken }).exec();

  if (!user) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.status(401).json({
      status: "ERROR",
      message: "Invalid cookie",
    });
  }

  //If user is found, delete refreshToken from  DB
  await User.findOneAndUpdate(
    { refreshToken: refreshToken },
    { refreshToken: null }
  );

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  return res.status(200).json({
    status: "SUCCESS",
    message: "Log Ou successful",
  });
};

const refreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies.jwt) {
    return res.status(401).json({
      status: "ERROR",
      message: "Cookies not found",
    });
  }

  console.log("cookies: ", cookies);

  const refreshToken = cookies.jwt;
  const existing_user = await User.findOne({
    refreshToken: refreshToken,
  }).exec();

  if (!existing_user) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.status(401).json({
      status: "ERROR",
      message: "Invalid cookie",
    });
  }

  const tokenPayload = {
    userData: {
      first_name: existing_user.first_name,
      last_name: existing_user.last_name,
      email: existing_user.email,
      country: existing_user.country,
      cus_id: existing_user.cus_id,
    },
  };

  const accessToken = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "6h",
  });

  return res.status(200).json({
    status: "SUCCESS",
    accessToken: accessToken,
  });
};

module.exports = {
  registerUser,
  logInUser,
  logOut,
  refreshToken,
};
