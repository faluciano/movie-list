import React, { useState, useRef } from "react";
import axios from "axios";
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

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
    const [nominees, setNominees] = useState([]);
    const classes = useStyles();
    const valueRef = useRef('');



    function handleKey(event){
        if(event.key==='Enter' && valueRef.current.value!==''){
            getMovies(valueRef.current.value);
        }
    }
    function getMovies(movie){
        axios.get("/movie", { 
            params: {
                movie: movie
            }
        })
        .then(response=>{
            setMovies(
                response.data.map((movie)=>{
                    return(
                        <ListItem 
                        alignItems="center"
                        key={movie}>
                            <ListItemText alignItems="center">
                                {movie[0]} 
                            </ListItemText>
                            <ListItem alignItems="center">
                                <Button 
                                onClick={()=>nominate(movie[0])} 
                                variant="contained" 
                                color="primary">
                                    Nominate
                                </Button>
                            </ListItem>
                        </ListItem>
                    )
                })
            )
        });
    }
    function nominate(nominee){
        setNominees(prev=>{
            if(prev.some(el=>el.key===nominee)){
                return prev;
            }
            return ([...prev, 
                (<ListItem
                key={nominee}>
                    <ListItemText>
                        {nominee}  
                    </ListItemText>
                    <ListItem>
                        <Button 
                        onClick={()=>remove(nominee)} 
                        variant="contained" 
                        color="secondary">
                            Remove
                        </Button>
                    </ListItem>
                </ListItem>)]
            )
        });
    }
    function remove(nominee){
        setNominees(prev=>prev.filter(item=>item.key!==nominee));
    }
    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        onKeyDown={handleKey}
                        inputRef={valueRef} 
                        fullWidth 
                        margin="normal" 
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={6}>
                    <div>
                        {valueRef.current.value?<h1>Results for "{valueRef.current.value}":</h1>:<h1>Waiting on search</h1>}
                        <List>
                            {
                            movies
                            }
                        </List>
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <div>
                        <h1>Nominations:</h1>
                        <List>
                            {
                            nominees
                            }
                        </List>
                    </div>
                </Grid>
            </Grid>
            
        </div>
    )
}

export default Movie;
