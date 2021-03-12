const { Sequelize } = require('sequelize');

require('dotenv').config();
const dbCreds = {
    dbname: process.env.DB_NAME || 'groupomania',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PWD || 'postgres',
};
const database = new Sequelize(`postgres://${dbCreds.user}:${dbCreds.password}@localhost:5432/${dbCreds.dbname}`);

module.exports = database;
