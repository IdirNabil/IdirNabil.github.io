// const express = require('express');
import express from 'express'
const app = express();

// const bodyParser = require('body-parser')
import bodyParser from 'body-parser'

import { getMovie, getMovies, addMovie } from './database.js';

const PORT = 3000;

// middleware
app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));

app.set('views', './views')
// app.set('view engine', 'ejs') // pour avoir le .ejs par défaut

// routes
app.get('/', (req, res) => {
    console.log("url::: ", req.url)
    res.render('index.ejs')
});

app.get('/jeux', (req, res) => {    
    res.render('pages/index_jeux.ejs')
});


app.get('/movies', async (req, res) => {
    const titleATP  = 'films anthropocene'
    const moviesATP_MySQL = await getMovies()
    console.log('moviesATP_MySQL::: ', moviesATP_MySQL)
    res.render('pages/movies.ejs', {moviesATP:moviesATP_MySQL, titleATP:titleATP})
});

app.post('/movies', async (req, res) => {
    // Modèle
    console.log('/movie:req.body',req.body) // req.body pour accéder aux données postées
    const movieTitle  = req.body.movieTitle
    const movieYear  = req.body.movieYear

    // Controleur
    const newMovie = await addMovie(movieTitle, movieYear)
    console.log("new Movie : ", newMovie)
    const moviesATP_MySQL = await getMovies()

    // Vue
    res.status(201).render('pages/movies.ejs', {moviesATP:moviesATP_MySQL, titleATP:'films anthropocene - form status !!!'})
    // res.sendStatus(201)
});

app.get('/movies/:idFilm', async (req, res) => {
    // 1 : Modèle : on récupère les données
    console.log(`url: ${req.url}`)
    const idFilm =  req.params.idFilm

    // 2 : Controleur : on ne fait rien : le controleur "colle" le modèle et la vue
    const movie = await getMovie(idFilm)
    console.log(movie)
    
    // 3 : Vue
    res.render('pages/movie_details.ejs', {movie:movie})
});

app.listen(PORT, () => {
    console.log(`Now listening on port ${PORT}`)
});
