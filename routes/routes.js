// imports
require('dotenv').config();
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const MongoClient = require('mongodb').MongoClient;

// mongodb url
const mongourl = process.env.DATABASE_URL 

// let 
let db;

MongoClient.connect(mongourl, {useNewUrlParser: true}, (err, client) => {
    if(err) {
        return console.log(err);
    } else {   
        db = client.db('star-wars-quotes');
        console.log('Successfully connected to MongoDB');
    }
});

// index route
router.get('/', (req, res) => {
    db.collection('quotes').aggregate([{$sample: { size: 1}}]).toArray((err, randomOne) => {
        if(err){
            console.log(err);
        } else {
            db.collection('quotes').countDocuments((err, quotesAmount) => {
                if(err){
                    console.log(err);
                } else {
                    res.render('index', {randomOne: randomOne, quotesAmount: quotesAmount});
                }
            });
        }
    });
});

// find route
router.get('/find', (req, res) => {
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

// all quotes route
router.get('/all', (req, res) => {
    db.collection('quotes').find().toArray((err, result) => {
        if(err){
            console.log(err);
        } else {
            res.render('all', {quotes: result});
        }
    });
});

// all characters quote
router.get('/all-characters', (req, res) => {  
    db.collection('quotes').aggregate([{ $group : {_id: "$name", quote: {$push: "$$ROOT"}, size: {$sum:1}}}, {$sort: {size: -1}}]).toArray((err, charactersGroup) => {
        if(err){
            console.log(err);
        } else {
            res.render('allcharacters', {charactersGroup: charactersGroup});
        }
    });
});

// all episodes quote
router.get('/all-episodes', (req, res) => {  
    db.collection('quotes').aggregate([{ $group : {_id: "$episode", quote: {$push: "$$ROOT"}}}]).toArray((err, episodesGroup) => {
        if(err){
            console.log(err);
        } else {
            res.render('allepisodes', {episodesGroup: episodesGroup});
        }
    });
});

// add new quote get route
router.get('/add', (req, res) => {
    res.render('add', {csrfToken: req.csrfToken()});
});

// add new quote post route
router.post('/add', [
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
            res.status(422).json({errors: errors.array(), csrfToken: req.csrfToken()});
            console.log(err);
        } else {
            console.log('Saved to DB');
            res.redirect('/add');
        }
    });
});

// quiz route
router.get('/quiz', (req, res) => { 
    db.collection('quotes').aggregate([{$sample: {size: 1}}]).toArray((err, randomThree) => {
        if(err){
            console.log(err);
        } else {
            res.render('quiz', {randomThree: randomThree});
        }
    });
});

// coming soon route
router.get('/comingsoon', (req, res) => {
    res.render('comingsoon');
});

module.exports = router;