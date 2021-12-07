"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // liens entre les clés et la table de référence
      models.comment.belongsTo(models.user, {
        foreignKey: "userId",
        as: "user",
      });

      models.comment.belongsTo(models.message, {
        foreignKey: "messageId",
        as: "message",
      });
    }
  }
  comment.init(
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
      username: {
        type: DataTypes.STRING,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        references: {
          model: "user",
          key: "username",
        },
      },
      content: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "comment",
    }
  );
  return comment;
};
