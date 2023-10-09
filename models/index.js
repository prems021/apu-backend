const Sequelize = require("sequelize");

const sequelize = new Sequelize(
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
  },
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./users.js")(sequelize, Sequelize);
db.users_info = require("./user_info.js")(sequelize, Sequelize);
db.agency = require("./agency.js")(sequelize, Sequelize);
db.otp = require("./otp.js")(sequelize, Sequelize);

db.location_mapping = require("./location_mapping.js")(sequelize, Sequelize);
db.service_mapping = require("./service_mapping.js")(sequelize, Sequelize);
db.sub_service_mapping = require("./sub_service_mapping.js")(
  sequelize,
  Sequelize,
);
db.apu_list = require("./apu_list.js")(sequelize, Sequelize);

db.users.hasMany(db.users_info);
db.users_info.belongsTo(db.users);

db.users.hasOne(db.agency);
db.agency.belongsTo(db.users);

db.users.hasOne(db.otp);
db.otp.belongsTo(db.users);

db.agency.hasMany(db.location_mapping);
db.location_mapping.belongsTo(db.agency);

db.agency.hasMany(db.service_mapping);
db.service_mapping.belongsTo(db.agency);

db.agency.hasMany(db.sub_service_mapping);
db.sub_service_mapping.belongsTo(db.agency);

db.agency.hasMany(db.apu_list);
db.apu_list.belongsTo(db.agency);

module.exports = db;
