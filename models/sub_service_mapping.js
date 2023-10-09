module.exports = (sequelize, DataTypes) => {
    const Sub_service_mapping = sequelize.define("Sub_service_mapping", {
      Service_code: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      Service_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    });
    Sub_service_mapping.associate = function (models) {
      // associations can be defined here
    };
    return Sub_service_mapping;
  };
  