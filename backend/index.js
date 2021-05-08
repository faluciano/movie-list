const express = require('express');
const axios = require('axios');
const app = express();
const port = 5000;

const result = require('dotenv').config({path:'../.env'}).parsed;
const key = result.OMDB_KEY;

function process(data) {
    procdat = data.Search.map((m)=>(`${m.Title} (${m.Year})`));
    return procdat
}

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
        .then((response)=>res.send(process(response.data)))
        .catch((error)=>res.send(error))
});

app.listen( port, ()=>console.log(`Running app on port localhost ${port}`));