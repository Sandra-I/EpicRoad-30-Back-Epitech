var sequelize = require("../database");
var User = require("./user")

const Favori = sequelize.define(
  "Favori",
  {
    type: {
      type: sequelize.Sequelize.DataTypes.ENUM('activity', 'drink', 'eat', 'hotel', 'restaurant'),
      allowNull: false
    },
    ressourceId: {
      type: "VARCHAR(256)",
      allowNull: false
    }
  },
  {
    freezeTableName: true,
  }
);

User.hasMany(Favori, {foreignKey: 'user', sourceKey: 'id'});
Favori.belongsTo(User, {foreignKey: 'user', targetKey: 'id'});

Favori.sync();

module.exports = Favori;