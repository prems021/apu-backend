module.exports = (sequelize, DataTypes) => {
  const Apu_mapping = sequelize.define("Apu_mapping", {
    ss_id : {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    apu_id : {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    apu_id : {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
  });
  Apu_mapping.associate = function (models) {
    // associations can be defined here
  };
  return Apu_mapping;
};
