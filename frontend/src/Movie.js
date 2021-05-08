import React, { useState, useRef } from "react";
import axios from "axios";
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow:3,
    },
    paper: {
        padding: theme.spacing(3),
        textAlign: 'center',
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
            setMovies(()=>{
                if (response.data===''){
                    return []
                }
                return (response.data.map((movie)=>{
                    return(
                            <ListItem key={movie[0]}>
                                <ListItemText>
                                    <Typography variant="body1">{movie[0]}</Typography> 
                                </ListItemText>
                                <ListItemSecondaryAction>
                                    <Button 
                                    onClick={()=>nominate(movie[0])} 
                                    variant="contained" 
                                    color="primary">
                                        <Typography variant="button">Nominate</Typography>
                                    </Button>
                                </ListItemSecondaryAction>
                            </ListItem>
                    )
                }))
            })
        });
    }
    function nominate(nominee){
        setNominees(prev=>{
            if(prev.some(el=>el.key===nominee)){
                return prev;
            }
            return ([...prev, 
                (<ListItem key={nominee}>
                        <ListItemText>
                            <Typography variant="body1">{nominee}</Typography>  
                        </ListItemText>
                        <ListItemSecondaryAction>
                            <Button 
                            onClick={()=>remove(nominee)} 
                            variant="contained" 
                            color="secondary">
                                <Typography variant="button">Remove</Typography>
                            </Button>
                        </ListItemSecondaryAction>
                    </ListItem>)]
            )
        });
    }
    function remove(nominee){
        setNominees(prev=>prev.filter(item=>item.key!==nominee));
    }
    return (
        <div className={classes.root}>
            <Grid container alignItems="flex-start" spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        onKeyDown={handleKey}
                        inputRef={valueRef} 
                        fullWidth 
                        margin="normal" 
                        variant="outlined"
                        className={classes.paper}
                    />
                </Grid>
                <Grid item xs={6}>
                    <div>
                        <Typography variant="h3">
                        {valueRef.current.value?`Results for "${valueRef.current.value}":`:`Waiting on search`}
                        </Typography>
                        <List className={classes.paper}>
                            {movies}
                        </List>
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <div>
                        <Typography variant="h3">Nominations:</Typography>
                        <List className={classes.paper}>
                            {nominees}
                        </List>
                    </div>
                </Grid>
            </Grid>
            
        </div>
    )
}

export default Movie;
