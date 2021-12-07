"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.message.hasMany(models.comment);

      models.message.belongsTo(models.user, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }
  message.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "user",
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
      content: DataTypes.STRING,
      imageUrl: DataTypes.STRING,
      likes: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "message",
    }
  );
  return message;
};
