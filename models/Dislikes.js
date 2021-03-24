const sequelize = require('../middleware/sequelize');
const Sequelize = require("sequelize");
const Utilisateur = require('../models/Utilisateur');
const Publication = require('../models/Publication');

const Dislikes = sequelize.define('dislikes', {
    publication_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {model: 'publication', key: 'id'}
    },
    utilisateur_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {model: 'utilisateur', key: 'id'}
    },
});

Publication.belongsToMany(Utilisateur, { through: 'dislikes', foreignKey: 'utilisateur_id' });
Utilisateur.belongsToMany(Publication, { through: 'dislikes', foreignKey: 'publication_id' });

module.exports = Dislikes;
