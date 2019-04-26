//requires
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const { check, validationResult } = require('express-validator/check');

//view engine for ejs
app.set('view engine', 'ejs');

//express body parser
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//set folders
app.use(express.static('public'));
app.use(express.static('assets'));
app.use(express.static('images'));
app.use(express.static('audio'));

//mongodb url
const mongourl = process.env.DATABASE_URL 

//mongodb collection variables
var db;
var quotesAmount;

//mongodb connection
MongoClient.connect(mongourl, {useNewUrlParser: true}, (err, client) => {
    if(err) {
        return console.log(err);
    } else {    
        db = client.db('star-wars-quotes'); 
        
        //count amount of querys
        db.collection('quotes').countDocuments(function(err, totalQuotes) {
            if(err){
                console.log(err);
            } else {
                quotesAmount = totalQuotes;
            }
        });
        
        //start the server
        app.listen(process.env.PORT, process.env.IP, function() {
            console.log('may Node be with you');
        });
    }    
});
    
//index route
app.get('/', (req, res) => {
    db.collection('quotes').aggregate([{$sample: { size: 1}}]).toArray(function(err, randomOne) {
        if(err){
            console.log(err);
        } else {
            res.render('index', {randomOne: randomOne, quotesAmount: quotesAmount});
        }
    });
});

//find route
app.get('/find', (req, res) => {
    var newName = new RegExp(req.query.name, 'i');
    var newQuote = new RegExp(req.query.quote, 'i');
    var newEpisode = new RegExp(req.query.episode, 'i');
    var allName = {'name': newName};
    var allQuote = {'quote': newQuote};
    var allEpisode = {'episode': newEpisode};
    var query = {$and:[allName, allQuote, allEpisode]};
    db.collection('quotes').find(query).toArray((err, foundData) => {
        if(err){
            console.log(err);
        } else {
            res.render('find', {foundData: foundData});
        }
    });
});

//all quotes route
app.get('/all', (req, res) => {
    db.collection('quotes').find().toArray(function(err, result) {
        if(err){
            console.log(err);
        } else {
            res.render('all', {quotes: result});
        }
    });
});

app.get('/all-characters', (req, res) => {
    db.collection('quotes').aggregate([{ $group : {_id: "$name", quote: {$push: "$$ROOT"}, size: {$sum:1}}}, {$sort: {size: -1}}]).toArray(function(err, charactersGroup) {
        if(err){
            console.log(err);
        } else {
            res.render('allcharacters', {charactersGroup: charactersGroup});
        }
    });
});

app.get('/all-episodes', (req, res) => {
    db.collection('quotes').aggregate([{ $group : {_id: "$episode", quote: {$push: "$$ROOT"}}}]).toArray(function(err, episodesGroup) {
        if(err){
            console.log(err);
        } else {
            res.render('allepisodes', {episodesGroup: episodesGroup});
        }
    });
});

//add new quote get route
app.get('/add', (req, res) => {
    res.render('add');
});

//add new quote post route
app.post('/quotes', [
    check('name').isLength({ min: 2 }).trim().escape(),
    check('quote').isLength({ min: 2 }).trim().escape(),
    check('episode').isLength({ min: 2 }).trim().escape(),
    ], (req, res) => {
    const name  = req.body.name;
    const quote = req.body.quote;
    const episode = req.body.episode;
    const errors = validationResult(req);
    db.collection('quotesbyfans').insertOne({name: name, quote: quote, episode: episode}, (err, result) => {
        if(err, !errors.isEmpty()) {
            res.status(422).json({errors: errors.array()});
            console.log(err);
        } else {
            console.log('saved to database');
            res.redirect('/add');
        }
    });
});

//quiz route
app.get('/quiz', (req, res) => {
    db.collection('quotes').aggregate([{$sample: {size: 1}}]).toArray(function(err, randomThree) {
        if(err){
            console.log(err);
        } else {
            res.render('quiz', {randomThree: randomThree});
        }
    });
});

//coming soon route
app.get('/comingsoon', (req, res) => {
    res.render('comingsoon');
});

app.get('/*', (req, res) => {
        res.render('404');
});
