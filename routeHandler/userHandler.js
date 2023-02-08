const express = require("express");
const mongoose = require("mongoose");
const bcrpyt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const userSchema = require("../schemas/userSchema");

const User = new mongoose.model("User", userSchema);

// Sign UP
router.post("/signup", async (req, res) => {
  const userWithSameEmail = await User.findOne({ email: req.body.email });
  const userWithSameUsername = await User.findOne({
    username: req.body.username,
  });
  if (userWithSameEmail) {
    res.status(400).json({
      success: false,
      errorType: 1, // here, 1 means email already exists so this should be shown in the front end
      errorMessage: `User with ${req.body.email} email already exists`,
    });
  } else if (userWithSameUsername) {
    res.status(400).json({
      success: false,
      errorType: 1, // here, 1 means email already exists so this should be shown in the front end
      errorMessage: `User with ${req.body.username} name already exists`,
    });
  } else {
    const hashedPassword = await bcrpyt.hash(req.body.password, 10);
    const newUser = await User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    try {
      await newUser.save();
      res.status(201).json({
        success: true,
        newUser: newUser,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        errorType: 2, // here 2 means some unknown error has occur.
        error: error,
      });
    }
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  // console.log('Cookies: ', req.cookies)

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).send({ message: "User not found" });
    }
    const isPasswordValid = await bcrpyt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) {
      res.status(400).send({ message: "Invalid password" });
    }
    const token = jwt.sign(
      {
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    // res.cookie("accessToken", token, {
    //   httpOnly: true,
    //   maxAge: 1000 * 60 * 60,
    //   sameSite: "strict",
    //   secure: process.env.NODE_ENV === "production",
    //   path: "/",
    // });
    res.status(200).json({
      // "access_token": token,
      message: "Login successful",
      token: token,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
});

// random
router.post("/random", async (req, res) => {
  console.log(req.body);
  res.status(200).json({
    data: req.body.token,
  });
});

// Token Verify
router.post("/tokenverify", async (req, res) => {
  // console.log('Cookies: ', req.cookies)
  const accessToken = req.body.token;
  // res.status(200).json({
  //   // "access_token": token,

  //   token: accessToken,
  // });
  try {
    const token = accessToken;
    // const token = authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decode print", decoded);
    const { username, email } = decoded;
    res.status(200).json({
      // "access_token": token,
      success: true,
      message: "Verified token",
      token: token,
      username: username,
      email: email,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
