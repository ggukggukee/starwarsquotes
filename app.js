// imports
require('dotenv').config();
const express = require('express');
const app = express();
const validator = require('express-validator');
const routes = require('./routes/routes');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const helmet = require('helmet');
const csrf = require('csurf');

// security from HTTP headers
app.use(helmet());

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

// middlewares
app.use(cookieParser());
app.use(session({
    secret: 'super-secret-key',
    key: 'super-secret-cookie',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
}));
app.use(validator());

// secure against cross-site request forgery
app.use(csrf({ cookie: true }));

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
app.listen(process.env.PORT, process.env.IP, () => {
    console.log('may Node be with you');
});
