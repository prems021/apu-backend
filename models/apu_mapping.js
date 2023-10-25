module.exports = (sequelize, DataTypes) => {
  const Apu_mapping = sequelize.define("Apu_mapping", {
    remarks : {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
 
  });
  Apu_mapping.associate = function (models) {
    // associations can be defined here
  };
  return Apu_mapping;
};
