module.exports = (sequelize, DataTypes) => {
  const Location_mapping = sequelize.define("Location_mapping", {
    Type: {
      type: DataTypes.STRING(10), // Main / Sub
      allowNull: false,
    },
    Location_code: {
      type: DataTypes.STRING(5),
    },
    Location_name: {
      type: DataTypes.STRING(25),
    },
  });
  Location_mapping.associate = function (models) {
    // associations can be defined here
  };
  return Location_mapping;
};
