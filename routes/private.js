var express = require("express");
var router = express.Router();
var unirest = require("unirest");
const db = require("../models");
const otpGenerator = require("otp-generator");
const User = db.users;
const Otp = db.otp;
const Agency = db.agency;
const Location_mapping = db.location_mapping;
const Op = db.Sequelize.Op;
const config = require("../public/config.json");

const sql = require("../models");

router.get(
  "/map_a_sub_service_to_apu/:a_id/:ss_id/:apu_id",
  async function (req, res, next) {
    try {
      const { a_id , ss_id , apu_id } = req.params;

      if (!a_id  || !ss_id  || !apu_id ) {
        res.status(400).json({ success: false, msg: "Invalid parameters" });
        return; // Exit early
      }

      const list = await db.apu_list.findOne({
        where: { AgencyId: a_id },
      });
      if (!list) {
        res.status(200).json({ success: true, data: null });
      } else {
        res.status(200).json({ success: true, data: list });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ msg: "An error occurred ", error: error });
    }
  },
);





router.get(
  "/get_all_apu_list_of_agency/:a_id",
  async function (req, res, next) {
    try {
      const { a_id } = req.params;

      if (!a_id) {
        res.status(400).json({ success: false, msg: "Invalid parameters" });
        return; // Exit early
      }

      const list = await db.apu_list.findAll({
        where: { AgencyId: a_id },
      });
      if (!list) {
        res.status(200).json({ success: true, data: null });
      } else {
        res.status(200).json({ success: true, data: list });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ msg: "An error occurred ", error: error });
    }
  },
);

router.post("/add_a_new_apu", async function (req, res, next) {
  try {
    console.log(req.body);
    const { Agency_Id, accessName, description } = req.body;
    if (!accessName || !Agency_Id) {
      res.status(400).json({ success: false, msg: "Invalid parameters" });
      return; // Exit early
    }

    console.log(req.body);
    const apu = await db.apu_list.findOne({
      where: { Apu_name: req.body.accessName, AgencyId: req.body.Agency_Id },
    });
    if (!apu) {
      const Data = {
        Apu_name: accessName,
        Description: description,
        AgencyId: Agency_Id,
      };
      const newd = await db.apu_list.create(Data);
      res.status(200).json({ success: true, data: newd });
    } else {
      console.log(apu);
      res.status(200).json({ success: false, data: "duplicate entry" });
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updation", error: error });
  }
});

router.get(
  "/get_all_sub_service_of_agency/:a_id",
  async function (req, res, next) {
    try {
      const { a_id } = req.params;

      if (!a_id) {
        res.status(400).json({ success: false, msg: "Invalid parameters" });
        return; // Exit early
      }

      const list = await db.sub_service_mapping.findAll({
        where: { AgencyId: a_id },
      });
      if (!list) {
        res.status(200).json({ success: true, data: null });
      } else {
        res.status(200).json({ success: true, data: list });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ msg: "An error occurred ", error: error });
    }
  },
);

router.get(
  "/add_a_sub_service_to_agency/:ss_code/:ss_name/:a_id",
  async function (req, res, next) {
    try {
      const { ss_code, ss_name, a_id } = req.params;

      if (!ss_code || !ss_name || !a_id) {
        res.status(400).json({ success: false, msg: "Invalid parameters" });
        return; // Exit early
      }

      const list = await db.sub_service_mapping.findOne({
        where: { AgencyId: a_id, Service_code: ss_code },
      });
      if (!list) {
        const oData = {
          Service_code: ss_code,
          Service_name: ss_name,
          AgencyId: a_id,
        };
        const resu = await db.sub_service_mapping.create(oData);
        res.status(200).json({ success: true, data: resu });
      } else {
        res
          .status(200)
          .json({ success: true, msg: "sub Service already mapped to agency" });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ msg: "An error occurred ", error: error });
    }
  },
);

router.get(
  "/get_all_service_of_a_agency/:a_id",
  async function (req, res, next) {
    try {
      console.log(req.params.a_id);
      const list = await db.service_mapping.findAll({
        where: { AgencyId: req.params.a_id },
      });
      if (!list) {
        res.status(200).json({
          success: true,
          data: null,
          msg: "No Services added to this agency",
        });
      } else {
        res.status(200).json({ success: true, data: list });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ msg: "An error occurred ", error: error });
    }
  },
);

router.get(
  "/add_a_service_to_agency/:s_id/:s_name/:a_id",
  async function (req, res, next) {
    try {
      console.log(req.params.s_id);
      console.log(req.params.a_id);
      const list = await db.service_mapping.findOne({
        where: { AgencyId: req.params.a_id, Service_code: req.params.s_id },
      });
      if (!list) {
        const oData = {
          Service_code: req.params.s_id,
          Service_name: req.params.s_name,
          AgencyId: req.params.a_id,
        };
        const resu = await db.service_mapping.create(oData);
        res.status(200).json({ success: true, data: resu });
      } else {
        res
          .status(200)
          .json({ success: true, msg: "Service already mapped to agency" });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ msg: "An error occurred ", error: error });
    }
  },
);

router.get("/get_location_list_of_agency/:id", async function (req, res, next) {
  try {
    console.log(req.params.id);
    const list = await Location_mapping.findAll({
      where: { AgencyId: req.params.id },
    });
    res.status(200).json({ success: true, data: list });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "An error occurred ", error: error });
  }
});

router.post("/update_agency_location/:id", async function (req, res, next) {
  try {
    console.log(req.params.id);
    console.log(req.body);
    const agency = Agency.findByPk(req.params.id);
    if (!agency) {
      res.json({ success: false, msg: "invalid agency id" });
    } else {
      const locations = await Location_mapping.findOne({
        where: { Type: "Primary", AgencyId: req.params.id },
      });
      if (!locations) {
        const Data = {
          Location_code: req.body.code,
          Location_name: req.body.name,
          Type: "Primary",
          AgencyId: req.params.id,
        };
        const newd = await Location_mapping.create(Data);
        res.status(200).json({ success: true, data: newd });
      } else {
        const nearbyLocationsCount = await Location_mapping.count({
          where: { Type: "Nearby", AgencyId: req.params.id },
        });

        if (nearbyLocationsCount >= 5) {
          res.status(400).json({
            success: false,
            msg: "Exceeded maximum Nearby locations limit",
          });
        } else {
          const locations_copy = await Location_mapping.findOne({
            where: { AgencyId: req.params.id, Location_code: req.body.code },
          });
          if (!locations_copy) {
            const Data = {
              Location_code: req.body.code,
              Location_name: req.body.name,
              Type: "Nearby", // Change the type to 'Nearby'
              AgencyId: req.params.id,
            };

            const newd = await Location_mapping.create(Data);
            res.status(200).json({ success: true, data: newd });
          } else {
            res
              .status(200)
              .json({ success: false, msg: "location already exixted" });
          }
        }
      }
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updation", error: error });
  }
});

router.post("/update_profile/:id", async function (req, res, next) {
  try {
    console.log(req.body);
    console.log(req.params.id);
    const user_profile = await User.findByPk(req.params.id);
    if (!user_profile) {
      res.status(200).json({ success: false, msg: "user profile not found" });
    } else {
      user_profile.email = req.body.email;
      user_profile.name = req.body.name;
      await user_profile.save();
      res.status(200).json({ success: true, data: user_profile });
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updation", error: error });
  }
});

router.get("/get_agency_list/:status", async function (req, res, next) {
  try {
    if (req.params.status == "All") {
      const all_list = await Agency.findAll();
      res.status(200).json({ success: true, data: all_list });
    } else {
      const un_aproved_list = await Agency.findAll({
        where: { operating_status: req.params.status },
      });
      res.status(200).json({ success: true, data: un_aproved_list });
    }
  } catch (error) {
    console.error("Error login admin:", error);
    res
      .status(500)
      .json({ message: "An error occurred while login", error: error });
  }
});

router.get("/get_all_service_list", async function (req, res, next) {
  try {
    res.status(200).json({ success: true, data: config.services });
  } catch (error) {
    console.error("Error login admin:", error);
    res
      .status(500)
      .json({ message: "An error occurred while login", error: error });
  }
});

router.get("/get_all_location_list", async function (req, res, next) {
  try {
    res.status(200).json({ success: true, data: config.locations });
  } catch (error) {
    console.error("Error login admin:", error);
    res
      .status(500)
      .json({ message: "An error occurred while login", error: error });
  }
});

router.post("/admin_login", async function (req, res, next) {
  try {
    const { phone, password } = req.body;
    if (phone == "8129511573" && password == "123") {
      res.status(200).json({ success: true, message: "admin logged in" });
    } else {
      res.status(200).json({ success: false, message: "admin login failed" });
    }
  } catch (error) {
    console.error("Error login admin:", error);
    res
      .status(500)
      .json({ message: "An error occurred while login", error: error });
  }
});

router.post("/test", async function (req, res, next) {
  try {
    console.log(req.body);
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    const otpData = {
      code: otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes in milliseconds
      UserId: req.body.UserId,
    };
    const newOtp = await Otp.create(otpData);
    res.status(200).json({ message: "otp for a valid login is", otp: newOtp });
  } catch (error) {
    console.error("Error adding agency:", error);
    res
      .status(500)
      .json({ message: "An error occurred while adding agency", error: error });
  }
});

router.get("/approve_agency/:id", async function (req, res, next) {
  try {
    console.log(req.body);
    const un_aproved = await Agency.findOne({ where: { id: req.params.id } });
    if (!un_aproved) {
      res.status(200).json({ success: false, message: "Agency Not Found" });
    } else {
      if (un_aproved.operating_status == "Approved") {
        res
          .status(200)
          .json({ success: false, message: "Agency Already approved" });
      } else {
        un_aproved.operating_status = "Approved";
        await un_aproved.save();
        res.status(200).json({ success: true, message: "Agency approved" });
      }
    }
  } catch (error) {
    console.error("Error adding agency:", error);
    res
      .status(500)
      .json({ message: "An error occurred while adding agency", error: error });
  }
});

router.post("/add_a_new_agency", async function (req, res, next) {
  try {
    console.log(req.body);

    const agency = await Agency.findOne({ where: { UserId: req.body.UserId } });
    if (agency) {
      res.status(201).json({
        success: false,
        message: "Agency Already Registered under this account",
      });
    } else {
      req.body.operating_status = "Un-approved";
      const newAgency = await Agency.create(req.body);

      unirest
        .post("https://3zvc4n-8080.csb.app/wa_api")
        .headers({
          Accept: "application/json",
          "Content-Type": "application/json",
        })
        .send({ target: "8848970443", msg: "mango", name: "preoji" })
        .then((response) => {
          console.log(response.body);
        });

      res.status(201).json({
        message: "Agency Registration Initiated wait for Approval",
        agency: newAgency,
      });
    }
  } catch (error) {
    console.error("Error adding agency:", error);
    res
      .status(500)
      .json({ message: "An error occurred while adding agency", error: error });
  }
});

router.get("/info", function (req, res, next) {
  res.json({ Version: "2.4", msg: "hifi" });
});

router.get("/test", async function (req, res, next) {});

router.get("/db_sync", async function (req, res, next) {
  //  await sql.sequelize.sync({ force: true });
  await sql.sequelize.sync();
  res.json({
    Version: "2.6",
    msg: "All models were synchronized successfully.",
  });
});

module.exports = router;
