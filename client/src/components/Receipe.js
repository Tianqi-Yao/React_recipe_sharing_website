import React, { useState, useEffect } from 'react'
// import { useSelector, useDispatch } from 'react-redux';

import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
// import { Card } from 'react-bootstrap';
// import Button from 'react-bootstrap/Button';
import '../App.css';
import { makeStyles, Card, CardContent, CardMedia, Typography, CardHeader, CardActionArea, CardActions } from '@material-ui/core';

// const actions = require('../actions');


const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
  card: {
    maxWidth: 550,
    height: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 5,
    border: '1px solid #1e8678',
    boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
  },
  titleHead: {
    borderBottom: '1px solid #1e8678',
    fontWeight: 'bold'
  },
  grid: {
    flexGrow: 1,
    flexDirection: 'row'
  },
  media: {
    height: '100%',
    width: '100%'
  },
  button: {
    color: '#1e8678',
    fontWeight: 'bold',
    fontSize: 12
  }
});


const Receipe = (props) => {
  props.match.params.id = parseInt(props.match.params.id);  // ❤ 
  const classes = useStyles();
  const [receipeData, setReceipeData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  let typeList = [];

  useEffect(() => {
    // console.log('useEffect fired');
    async function fetchData() {
      try {
        setLoading(true);
        const { data: receipe } = await axios.get(`http://localhost:3001/receipe/${props.match.params.id}`);
        setReceipeData(receipe);  // receipeData = receipe
        setLoading(false);
        console.log('receipe:', receipe);
        // console.log(pokemon);
        // return () => {  // Any cleanup go here
        //   clearInterval(variable);
        // }
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, [props.match.params.id]);

  // Error Component
  function ErrorComponent() {
    return (
      <div>
        <h1>404 - You don't find receipe with this Id</h1>
      </div>
    )
  }


  if (loading) {
    if (!receipeData) {
      return (<ErrorComponent></ErrorComponent>);
    }
   
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else {
    // receipeData.types.forEach((obj) => {
    //   typeList.push(obj.type.name);
    // })

    return (
      <Card className={classes.card} variant="outlined">
        <CardHeader className={classes.titleHead} title={receipeData.title} />
        <img 
          class="card-img-top" 
          src={receipeData.image}
          // onError={(e)=>{e.target.onerror = null; e.target.src=`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${props.match.params.id}.png`}}
          alt={receipeData.title}>
        </img>

        {/* <div>
          {`Type: ${typeList}`}
        </div> */}
        <CardContent>
          <Typography>
            <Link to={`/receipe/page/0`}>Back to all receipe list...</Link>
          </Typography>
        </CardContent>

        {/* <CardActions>
          {isFavoriated !=-1 ? 
            <button onClick={() => { releasePokemonFromSelectedTrainer(pokemonState);}}>unFavoriated</button> : 
              <button onClick={() => { catchPokemonFromSelectedTrainer(pokemonState);}}>Bin</button>}
        </CardActions> */}
      </Card>
    );
  }
};

export default Receipe
