const { Sequelize } = require('sequelize');

require('dotenv').config();

const dbCreds = {
    dbname: process.env.DB_NAME || 'groupomania',
    user: process.env.DB_USER || 'groupomania',
    password: process.env.DB_PWD || 'groupomania',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '5432',
};

const sequelize = new Sequelize(`postgres://${dbCreds.user}:${dbCreds.password}@${dbCreds.host}:${dbCreds.port}/${dbCreds.dbname}`);

module.exports = sequelize;
