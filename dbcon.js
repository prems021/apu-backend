

const Sequelize = require("sequelize");
module.exports = new Sequelize(
  "wadhain_apu",
  "wadhain_codesandbox",
  process.env.DBPASSWORD,
  {
    host: "csweb.in",
    port: 3306,
    dialect: "mysql",
    define: {
      timestimps: false,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    operatorAliases: false,
  }
);
