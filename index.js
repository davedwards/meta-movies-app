const express = require('express');
const cors = require('cors');
const knex = require('knex');
require('dotenv').config();
const db = knex({
    client: 'pg',
    connection: {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE,
    },
});
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// CORS implemented so that we don't get errors when trying to access the server from a different server location
app.use(cors());
// GET: Fetch all movies from the database
app.get('/', (req, res) => {
    db.select('*')
        .from('movies')
        .then((data) => {
            console.log(data);
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
        });
});
// GET: Fetch movie by movieId from the database
app.get('/:movieId', (req, res) => {
    const movieId = req.params.movieId;
    db.select('*')
        .from('movies')
        .where('movie_id', '=', movieId)
        .then((data) => {
            console.log(data);
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
        });
});
// POST: Create movies and add them to the database
app.post('/add-movie', (req, res) => {
/*
http://127.0.0.1:5000/add-movie?
movieName=Star%20Wars%3A%20Episode%20VIII%20-%20The%20Last%20Jedi
&ImgUrl=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FM%2FMV5BMjQ1MzcxNjg4N15BMl5BanBnXkFtZTgwNzgwMjY4MzI%40._V1_.jpg
&releaseYear=2017
&summary=Rey%20develops%20her%20newly%20discovered%20abilities%20with%20the%20guidance%20of%20Luke%20Skywalker,%20who%20is%20unsettled%20by%20the%20strength%20of%20her%20powers.
&director=Rian%20Johnson
&genre=Fantasy
&rating=PG-13
&movieRuntime=152
&metaScore=84
*/
    const { movieName="Star%20Wars%3A%20Episode%20VIII%20-%20The%20Last%20Jedi",
            imgUrl="https%3A%2F%2Fm.media-amazon.com%2Fimages%2FM%2FMV5BMjQ1MzcxNjg4N15BMl5BanBnXkFtZTgwNzgwMjY4MzI%40._V1_.jpg",
            releaseYear="2017",
            summary="Rey%20develops%20her%20newly%20discovered%20abilities%20with%20the%20guidance%20of%20Luke%20Skywalker,%20who%20is%20unsettled%20by%20the%20strength%20of%20her%20powers.",
            director="Rian%20Johnson",
            genre="Fantasy",
            rating="PG-13",
            movieRuntime="152",
            metaScore="84" } = req.body;
    console.log( 'values: ', movieName, imgUrl, releaseYear, summary, director, genre, rating, movieRuntime, metaScore );
    db('movies')
        .insert({
            movie_name:     movieName,
            img_url:        imgUrl,
            release_year:   releaseYear,
            summary:        summary,
            director:       director,
            genre:          genre,
            rating:         rating,
            movie_runtime:  movieRuntime,
            meta_score:     metaScore,
        })
        .then(() => {
            console.log('Movie Added');
            return res.json({ msg: 'Movie Added' });
        })
        .catch((err) => {
            console.log("req.body: ", req.body );
            console.log(err);
        });
});
// DELETE: Delete movie by movieId from the database
app.delete('/delete-movie', (req, res) => {
    const movieId = req.body;
    const movieIdToDelete = Number(movieId.movieId);
    console.log(movieIdToDelete);
    db('movies')
        .where('movie_id', '=', movieIdToDelete)
        .del()
        .then(() => {
            console.log('Movie Deleted');
            return res.json({ msg: 'Movie Deleted' });
        })
        .catch((err) => {
            console.log(err);
        });
});
// PUT: Update movie by movieId from the database
app.put('/update-movie', (req, res) => {
    db('movies')
        .where('movie_id', '=', 1)
        .update({ movie_name: 'Goldeneye' })
        .then(() => {
            console.log('Movie Updated');
            return res.json({ msg: 'Movie Updated' });
        })
        .catch((err) => {
            console.log(err);
        });
});
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}, http://localhost:${port}`));