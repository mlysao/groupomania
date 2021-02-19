const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

const app = express();

require('dotenv').config();
const dbCreds = {
    dbname: process.env.DB_NAME || 'sopekocko',
    user: process.env.DB_USER || 'demo',
    password: process.env.DB_PWD || 'demo',
};
mongoose.connect(`mongodb+srv://${dbCreds.user}:${dbCreds.password}@cluster0.adnys.mongodb.net/${dbCreds.dbname}?retryWrites=true&w=majority`,
    { useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;
