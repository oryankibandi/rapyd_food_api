const logRequests = async (req, res, next) => {
  const method = req.method;
  const url = req.url;
  const origin = req.headers.origin;

  console.log(`${url} ${method} ${origin}`);
  console.log("cookies", req.headers.cookie);
  next();
};

module.exports = logRequests;
