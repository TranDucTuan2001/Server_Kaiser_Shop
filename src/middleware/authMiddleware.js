const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config;

const authMiddleWare = (req, res, next) => {
  const tokenHeader = req.headers.token;

  if (!tokenHeader) {
    return res.status(404).json({
      message: "Token authentication header is missing",
      status: "ERR",
    });
  }

  const token = tokenHeader?.split(" ")[1];

  if (!token) {
    return res.status(404).json({
      message: "Input the token authentication",
      status: "ERR",
    });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
   
    if (err) {
      return res.status(404).json({
        message: "The authentication",
        status: "ERR",
      });
    }
    // const { payload } = user;
    if (user?.isAdmin) {
      next();
    } else {
      return res.status(404).json({
        message: "The authentication",
        status: "ERR",
      });
    }
  });
};

const authUserMiddleWare = (req, res, next) => {
  const token = req.headers.token.split(" ")[1];
  const userId = req.params.id;
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(404).json({
        message: "The authentication",
        status: "ERR",
      });
    }
    // const { payload } = user;
    else if (user?.isAdmin || user?.id === userId) {
      next();
    } else {
      return res.status(404).json({
        message: "The authentication",
        status: "ERR",
      });
    }
  });
};
module.exports = {
  authMiddleWare,
  authUserMiddleWare,
};
