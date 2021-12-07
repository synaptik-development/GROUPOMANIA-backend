"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // relations many to many
      models.user.belongsToMany(models.message, {
        through: models.like,
        foreignKey: "userId",
        otherKey: "messageId",
      });

      models.message.belongsToMany(models.user, {
        through: models.like,
        foreignKey: "messageId",
        otherKey: "userId",
      });

      // liens entre les clés et la table de référence
      models.like.belongsTo(models.user, {
        foreignKey: "userId",
        as: "user",
      });

      models.like.belongsTo(models.message, {
        foreignKey: "messageId",
        as: "message",
      });
    }
  }
  like.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "user",
          key: "id",
        },
      },
      messageId: {
        type: DataTypes.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "message",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "like",
    }
  );
  return like;
};
