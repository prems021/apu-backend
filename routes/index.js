var express = require("express");
var router = express.Router();

const db = require("../models");
const User = db.users;
const Agency = db.agency;
const Op = db.Sequelize.Op;
const Otp = db.otp;
const otpGenerator = require("otp-generator");
var unirest = require("unirest");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ index: "Express" });
});

router.get("/reset_user", async function (req, res, next) {
  await User.destroy({ where: {} });
  res.json({ success: true, message: "user destroyed" });
});

router.post(
  "/validate_otp_for_user_registration",
  async function (req, res, next) {
    try {
      console.log(req.body);
      const otps = await Otp.findOne({
        where: { phone: req.body.phone, code: req.body.otp },
      });
      if (otps) {
        console.log(otps.expiresAt);
        console.log(Date.now());
        if (otps.expiresAt > Date.now()) {
          res.json({ success: true, message: "Otp Validated" });
          await otps.destroy();
        } else {
          res.json({ success: false, message: "Otp Expired" });
          await otps.destroy();
        }
      } else {
        res.json({ success: false, message: "Invalid Otp", OPts: null });
      }
    } catch (err) {
      res.json({ success: false, message: "Invalid operation", err: err });
    }
  },
);

router.post("/regenerate_otp", async function (req, res, next) {
  try {
    const { phone } = req.body;
    const user = await User.findOne({
      where: {
        phone: phone,
      },
    });
    if (!user) {
      res
        .status(200)
        .json({ success: false, message: "Phone no not registered " });
    } else {
      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      const otpData = {
        code: otp,
        expiresAt: Date.now() + 1 * 60 * 1000, // 1 minutes in milliseconds
        UserId: user.id,
        phone: phone,
      };
      const newOtp = await Otp.create(otpData);
      unirest
        .post("https://3zvc4n-8080.csb.app/wa_api")
        .headers({
          Accept: "application/json",
          "Content-Type": "application/json",
        })
        .send({
          target: phone,
          msg:
            otp +
            " - is your OTP for Apu portal Registration.. OTP Valid only for next 5 Min",
        })
        .then((response) => {
          console.log(response.body);
        });

      res.status(200).json({ success: true, message: "otp sent to phone" });
    }
  } catch (err) {
    console.log("Error during process:", err);
    res.status(500).json({ message: "An error occurred" });
  }
});

router.post("/register_with_ph_and_otp", async function (req, res, next) {
  try {
    const { name, phone } = req.body;
    const user = await User.findOne({
      where: {
        phone: phone,
      },
    });
    if (user) {
      res
        .status(200)
        .json({ success: false, message: "Phone no already used" });
    } else {
      const newUser = await User.create({
        phone: phone,
        name: name,
      });

      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      const otpData = {
        code: otp,
        expiresAt: Date.now() + 1 * 60 * 1000, // 1 minutes in milliseconds
        UserId: newUser.id,
        phone: phone,
      };
      const newOtp = await Otp.create(otpData);
      unirest
        .post("https://3zvc4n-8080.csb.app/wa_api")
        .headers({
          Accept: "application/json",
          "Content-Type": "application/json",
        })
        .send({
          target: phone,
          msg:
            otp +
            " - is your OTP for Apu portal Registration.. OTP Valid only for next 5 Min",
        })
        .then((response) => {
          console.log(response.body);
        });

      res.status(200).json({ success: true, message: "otp sent to phone" });
    }
  } catch (err) {
    console.log("Error during process:", err);
    res.status(500).json({ message: "An error occurred" });
  }
});

router.post(
  "/set_user_password_after_otp_verification",
  async function (req, res, next) {
    try {
      console.log(req.body);
      const { phone, password } = req.body;
      const user = await User.findOne({ where: { phone: phone } });
      if (user) {
        await user.update({
          password: password,
        });
        res.status(200).json({
          success: true,
          message: "password  successfully updated",
          data: user,
        });
      } else {
        res
          .status(200)
          .json({ success: false, message: "Invalid phone number" });
      }
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ success: false, message: "Server error", data: err });
    }
  },
);

router.post("/user_login", async function (req, res, next) {
  try {
    console.log(req.body);
    const { phone, password } = req.body;
    const user = await User.findOne({
      where: {
        phone: phone,
        password: password,
      },
    });

    if (user) {
      const agency = await Agency.findOne({
        where: {
          UserId: user.id,
        },
      });

      if (agency && agency.operating_status == "Approved") {
        res.status(200).json({
          success: true,
          message: "login success",
          data: user,
          is_agent: true,
          agency: agency,
        });
      } else {
        res.status(200).json({
          success: true,
          message: "login success",
          data: user,
          is_agent: false,
          agency: agency,
        });
      }
    } else {
      res.status(200).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.log("Error during login:", err);
    res.status(500).json({ message: "An error occurred" });
  }
});

router.get("/info", function (req, res, next) {
  res.json({ Version: "2.0", message: "hifi" });
});

module.exports = router;
