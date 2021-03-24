const { Sequelize } = require('sequelize');

require('dotenv').config();

const dbCreds = {
    dbname: process.env.DB_NAME || 'groupomania',
    user: process.env.DB_USER || 'groupomania',
    password: process.env.DB_PWD || 'groupomania',
};

const sequelize = new Sequelize(`postgres://${dbCreds.user}:${dbCreds.password}@localhost:5432/${dbCreds.dbname}`);

module.exports = sequelize;
