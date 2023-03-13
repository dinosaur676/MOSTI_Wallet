module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    "users",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      user_id: DataTypes.STRING,
      address: DataTypes.STRING,
      create_on: DataTypes.DATE,
      update_on: DataTypes.DATE,
    },
    {
      timestamps: false,
    }
  );
  /*  Users.associate = function (models) {
    // associations can be defined here
  }; */
  return Users;
};
