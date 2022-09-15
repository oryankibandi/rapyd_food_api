require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyAccessToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader) {
    return res.status(400).json({
      status: "ERROR",
      message: "`Authorization` header not found not found",
    });
  }

  if (!authHeader.startsWith("Bearer")) {
    return res.status(400).json({
      status: "ERROR",
      message: "`Bearer` authHeader not found",
    });
  }

  const accessToken = authHeader.split(" ")[1];
  await jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        return res.status(401).json({
          status: "ERROR",
          message: err,
        });
      }
      //console.log("decoded token: ", decoded);
      (req.first_name = decoded.userData.first_name),
        (req.last_name = decoded.userData.second_name),
        (req.email = decoded.userData.email),
        (req.country = decoded.userData.country),
        (req.cus_id = decoded.userData.cus_id);

      next();
    }
  );
};

module.exports = verifyAccessToken;
