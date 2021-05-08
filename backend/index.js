const express = require('express');
const axios = require('axios');
const app = express();
const port = 5000;

const result = require('dotenv').config({path:'../.env'}).parsed;
const key = result.OMDB_KEY;

function getRating(id){
    return (axios.request({
        method:"post",
        url:"http://www.omdbapi.com/",
        params: {
            apikey:key,
            i:id,
        }
    })
    .then((response)=>response.data)
    .catch((error)=>console.log(error))
    );
}

function process(data) {
    let procdat = data.Search.map(
        async (m)=>{
            const ret = await getRating(m.imdbID);
            return [`${m.Title} (${m.Year}) ${ret.imdbRating}`]
        })
    return Promise.all(procdat);
}
app.get("/rating",async (req,res)=>{
    const m = await getRating('tt1312171');
    console.log(m.imdbRating);
    res.send(m.imdbRating);
});
app.get("/", (req,res) => res.send("Hello World!"));
app.get("/movie", (req,res)=>{
    let movie = req.query.movie;
    console.log(movie);
    axios.request({
        method:"post",
        url:"http://www.omdbapi.com/",
        params: {
            apikey:key,
            s:movie,
        }
    })
        .then((response)=>"Error" in response.data?res.send(""):(process(response.data)
            .then((val)=>res.send(val))))
        .catch((error)=>res.send(error))
});

app.listen( port, ()=>console.log(`Running app on port localhost ${port}`));