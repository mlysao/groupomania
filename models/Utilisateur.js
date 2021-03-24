const sequelize = require('../middleware/sequelize');
const Sequelize = require("sequelize");

const Utilisateur = sequelize.define(
    'utilisateur',
    {
        id: {type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true},
        email: {type: Sequelize.STRING, allowNull: false, unique: true},
        email_display: {type: Sequelize.STRING, allowNull: false},
        password: {type: Sequelize.STRING, allowNull: false}
    }, {
        freezeTableName: true
    }
);

module.exports = Utilisateur;
