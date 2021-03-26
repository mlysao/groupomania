const sequelize = require('../middleware/sequelize');
const Sequelize = require("sequelize");
const Utilisateur = require('../models/Utilisateur');
const Publication = require('../models/Publication');

const Commentaire = sequelize.define(
    'commentaire',
    {
        id: {type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true},
        contenu: {type: Sequelize.TEXT, allowNull: false},
        date_publication: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW},
        modere: {type: Sequelize.BOOLEAN, defaultValue: false},
        publication_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {model: 'publication', key: 'id'}
        },
        utilisateur_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {model: 'utilisateur', key: 'id'}
        }
    }, {
        freezeTableName: true
    },
);

Utilisateur.hasMany(Commentaire, {foreignKey: 'utilisateur_id'});
Commentaire.belongsTo(Utilisateur, {foreignKey: 'id'});

Publication.hasMany(Commentaire, {foreignKey: 'publication_id'});
Commentaire.belongsTo(Publication, {foreignKey: 'id'});

module.exports = Commentaire;
