require("dotenv").config();
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    define: {
        timestamps: false
    }
});
const User = sequelize.define("User", {

    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expiration: {
        type: DataTypes.STRING,
        allowNull: false,
    },

})
const Score = sequelize.define("Score", {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    user_name: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: "User",
            key: "username",
        },
    },
    difficulty: {
      type: DataTypes.ENUM("easy", "medium", "hard"),
      allowNull: false,

    },
    score: {
        allowNull: false,
        type: DataTypes.INTEGER.UNSIGNED,
    }


})
module.exports = { User, Score, sequelize }