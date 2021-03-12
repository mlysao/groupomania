const database = require('../middleware/sequelize');

const userSchema = database.define(
    'user',
    {
        email: {type: String, required: true, unique: true},
        emailDisplay: {type: String, required: true},
        password: {type: String, required: true}
    }
);

module.exports = userSchema;
