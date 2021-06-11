var sequelize = require("../database");

const User = sequelize.define(
  "User",
  {
    email: {
      type: "VARCHAR(256)",
      allowNull: false,
      unique: true
    },
    password: {
      type: "VARCHAR(256)",
      allowNull: false,
    },
    lastname: {
      type: "VARCHAR(256)",
      allowNull: false,
    },
    firstname: {
      type: "VARCHAR(256)",
      allowNull: false,
    }
  },
  {
    freezeTableName: true,
  }
);

User.sync();

module.exports = User;
