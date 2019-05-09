// requires
require('dotenv').config();
const express = require('express');
const app = express();
const validator = require('express-validator');
const routes = require('./routes/routes');

// view engine for ejs
app.set('view engine', 'ejs');

// express body parser
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// set folders
app.use(express.static('public'));
app.use(express.static('assets'));
app.use(express.static('images'));
app.use(express.static('audio'));

app.use(validator());
app.use('/', routes);

// error 404 handler
app.use((req, res, next) => {
    res.status(404).render('404');
});

// error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// start the server
app.listen(process.env.PORT, process.env.IP, function() {
    console.log('may Node be with you');
});
