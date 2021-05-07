import React, { useState } from "react";
import axios from "axios";
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow:1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

function Movie() {
    const [movies, setMovies] = useState([]);
    const classes = useStyles();
    function getMovies(){
        axios.get("/movie").then(response=>setMovies(response.data));
    }
    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField margin="normal" variant="outlined"/>
                </Grid>
                <Grid item xs={6}>
                    <h1>Movies are: {movies.map(movie=><li>{movie}</li>)}</h1>
                </Grid>
                <Grid item xs={6}>
                    <button onClick={getMovies}>Get Movies</button>
                </Grid>
            </Grid>
            
        </div>
    )
}

export default Movie;
