module.exports = (sequelize, DataTypes) => {
  const Otp = sequelize.define("Otp", {
   phone : {
        type: DataTypes.STRING(25),
        allowNull: false,
      },
    code: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
    }
    
  });
  Otp.associate = function (models) {
    // associations can be defined here
  };
  return Otp;
};
