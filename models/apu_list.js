module.exports = (sequelize, DataTypes) => {
  const Apu_list = sequelize.define("Apu_list", {
    Apu_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    Description: {
      type: DataTypes.STRING(160),
      allowNull: false,
    },
  });
  Apu_list.associate = function (models) {
    // associations can be defined here
  };
  return Apu_list;
};
