import React, {useEffect, useState} from "react";
import axios from "axios";

function Movie() {
    const [movies, setMovies] = useState([]);
    function getMovies(){
        axios.get("/movie").then(response=>setMovies(response.data));
    }
    return (
        <div>
            <button onClick={getMovies}>Get Movies</button>
            <h1>Movies are: {movies.map(movie=><li>{movie}</li>)}</h1>
        </div>
    )
}

export default Movie;
