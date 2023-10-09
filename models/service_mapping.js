module.exports = (sequelize, DataTypes) => {
  const Service_mapping = sequelize.define("Service_mapping", {
    Service_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    Service_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  });
  Service_mapping.associate = function (models) {
    // associations can be defined here
  };
  return Service_mapping;
};
