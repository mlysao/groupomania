const sequelize = require('../middleware/sequelize');
const Sequelize = require("sequelize");
const Utilisateur = require('../models/Utilisateur');

const Publication = sequelize.define(
    'publication',
    {
        id: {type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true},
        description: {type: Sequelize.STRING, allowNull: false},
        image_url: {type: Sequelize.STRING, allowNull: false},
        date_publication: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW},
        modere: {type: Sequelize.BOOLEAN, defaultValue: false},
        utilisateur_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {model: 'utilisateur', key: 'id'}
        }
    }, {
        freezeTableName: true
    },
);

Utilisateur.hasMany(Publication, {foreignKey: 'utilisateur_id'});
Publication.belongsTo(Utilisateur, {foreignKey: 'id'});

module.exports = Publication;
