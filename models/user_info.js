module.exports = (sequelize, DataTypes) => {
  const User_info = sequelize.define("User_info", {
    email_info: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password_info: {
      type: DataTypes.STRING,
    },
    profilePic: {
      type: DataTypes.STRING,
    },
  });
  User_info.associate = function (models) {
    // associations can be defined here
  };
  return User_info;
};
