const User = require("../models/userDBSchema");
const { searchDocumentInDB } = require("./DBController");

const getUserProfile = async (req, res) => {
  //console.log("req.cus_id=> ", req.cus_id);
  if (!req.cus_id) {
    return res.status(401).json({
      status: "ERROR",
      message: "invalid access Token",
    });
  }

  if (!req.params.cus_id) {
    return res.status(401).json({
      status: "ERROR",
      message:
        "cus_id not in parameters. Please incude the `cus_id` of the user.",
    });
  }

  if (req.params.cus_id !== req.cus_id) {
    return res.status(401).json({
      status: "ERROR",
      message: "Invalid cus_id. Please recheck the cus_id.",
    });
  }

  //console.log("params: ", req.params);
  const { cus_id } = req.params;
  let profile = {};
  const sensitiveFields = ["password", "_id", "refreshToken", "__v"];

  await searchDocumentInDB("cus_id", cus_id, User)
    .then((resp) => {
      if (!resp) {
        return res.status(404).json({
          status: "ERROR",
          message: "user with the given cus_id does not exist",
        });
      }
      // console.log("Profile Resp: ", resp);
      const keys = Object.keys(resp._doc);

      for (let i = 0; i < keys.length; i++) {
        if (!sensitiveFields.includes(keys[i])) {
          profile[keys[i]] = resp._doc[keys[i]];
        }
      }

      return res.status(200).json({
        status: "SUCCESS",
        data: profile,
      });
    })
    .catch((err) => {
      //console.log("STH went wrong: ", err);
      return res.status(500).json({
        status: "ERROR",
        message: err,
      });
    });
};

module.exports = { getUserProfile };
