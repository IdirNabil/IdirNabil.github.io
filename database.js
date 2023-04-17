import mysql from 'mysql2'           // avec   "type":"module", dans package.json
// const mysql = require('mysql2');  // sans   "type":"module", mais l'await ne marche plus
import dotenv from 'dotenv'
dotenv.config()

import iconv from 'iconv-lite'

const pool = mysql.createPool({ // pool ou myDB
    host: process.env.MySQL_HOST, //  'localhost', // '127.0.0.1'
    user: process.env.MySQL_USER,
    password: process.env.MySQL_PASSWD,
    database: process.env.MySQL_DATABASE,
}).promise();

/*
const result = await pool.query(querySQL)
console.log(result) // ça marche mais le résultat est "sale" : trop d'information : on regarde : c'est JSON, en premier le tableau voulu
console.log("les datas :") // le résultats est dans results[0]
const rows=results[0]
console.log(rows) 
*/

// on va plutôt écrire du code "déstructuré :"
/*
const [rows] = await pool.query(querySQL)
console.log(rows) 
*/

// on met ça dans une fonction, async car await
/* async function getMovies() {
    const querySQL = 'SELECT * FROM movies'
	const [rows] = await pool.query(querySQL)
	return rows
} */

export async function getMovies(limit=0) {
    console.log('getMovies: ', limit)
    if (limit == 0) {
        const querySQL = 'SELECT * FROM movies'
        const [rows] = await pool.query(querySQL)
        console.log('getMovies : ', rows)
        return rows
    }
    else {
        const querySQL = `
            SELECT * 
            FROM movies 
            LIMIT ?
        `
        const [rows] = await pool.query(querySQL, [limit])
        return rows
    }
}

export async function getMovie(id) {
    /*     
    const querySQL = `
        SELECT * 
        FROM movies 
        WHERE id=${id} 
    `; 
    */
    const querySQL = `
        SELECT * 
        FROM movies 
        WHERE id=?
    `;

	const [rows] = await pool.query(querySQL, [id])
	return rows[0] // on ne retourne qu'un seul objet et non plus un tableau
}

export async function addMovie(title, year) {
    const querySQL = `
        INSERT INTO movies(title, year) VALUES (?, ?)
    `;

    // const result = await pool.query(querySQL, [title, year])
    // return result // c'est le résultat de l'insert : le seul truc intéressant, c'est l'insert id : => on destructure
    
    const [result] = await pool.query(querySQL, [title, year])
    // return result.insertId 

    const id=result.insertId
    return getMovie(id)
}

const movies = await getMovies(2)
console.log(movies)

// const movie = await getMovie(5)
// console.log(movie)


// const insertId = await addMovie('test', 2000)
// console.log(insertId) // on a des infos sur ce qui a été inserté