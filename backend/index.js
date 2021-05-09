const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 5000;

const result = require('dotenv').config({path:'../.env'}).parsed;
const key = "OMDB_KEY" in process.env ?process.env.OMDB_KEY:result.OMDB_KEY;
app.use(express.static(path.resolve(__dirname, '..client/build')));

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

function compute(data) {
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
        .then((response)=>"Error" in response.data?res.send(""):(compute(response.data)
            .then((val)=>res.send(val))))
        .catch((error)=>res.send(error))
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen( port,'0.0.0.0',()=>console.log(`Running app on port localhost ${port}`));