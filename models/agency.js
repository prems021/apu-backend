module.exports = (sequelize, DataTypes) => {
  const Agency = sequelize.define("Agency", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
    },
    district: {
      type: DataTypes.STRING,
    },
    pin_code: {
      type: DataTypes.STRING(50),
    },
    gst_no: {
      type: DataTypes.STRING,
    },
    agency_logo: {
      type: DataTypes.BLOB,
    },
    operating_status: {
      type: DataTypes.STRING(50),
    },
  });
  Agency.associate = function (models) {
    // associations can be defined here
  };
  return Agency;
};
