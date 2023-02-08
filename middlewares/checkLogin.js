const jwt = require("jsonwebtoken");
const cookie = require("cookie");
// const cookieParser = require('cookie-parser');

const checkLogin = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  try {
    const token = accessToken;
    // const token = authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decode print", decoded);
    const { username, userId } = decoded;
    req.username = username;
    req.userId = userId;
    console.log("token from checkLogin middleware", req.cookies);
    // console.log("ata token" , tokenData)
    next();
  } catch (error) {
    next("Authentication Failure ");
  }
};

module.exports = checkLogin;
