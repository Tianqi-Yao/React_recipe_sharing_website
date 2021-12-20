import React, { useState, useEffect } from 'react'
// import { useSelector, useDispatch } from 'react-redux';

import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
// import { Card } from 'react-bootstrap';
// import Button from 'react-bootstrap/Button';
import '../App.css';
import database from "../config/awsUrl"
import { makeStyles, Card, CardContent, CardMedia, Typography, CardHeader, CardActionArea, CardActions } from '@material-ui/core';
// const actions = require('../actions');


const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  // media: {
  //   height: 140,
  // },
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
  // props.match.params.id = parseInt(props.match.params.id);  // ❤ 
  const classes = useStyles();
  const [receipeData, setReceipeData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  let typeList = [];

  useEffect(() => {
    // console.log('useEffect fired');
    async function fetchData() {
      try {
        setLoading(true);
        const { data: receipe } = await axios.get(`${database}/receipe/${props.match.params.id}`);
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
  }
  else if (receipeData && receipeData._id && receipeData._id.length > 15) {
    const regex = /(<([^>]+)>)/gi;  // for summary
    let card = receipeData && receipeData.ingredients && receipeData.ingredients.map((char) => {
      return <p>{char}</p>
    })
    return (
      <Card className={classes.card} variant="outlined">
        <CardHeader className={classes.titleHead} title={receipeData.title} />
        <img
          class="card-img-top"
          src={receipeData.image}
          // onError={(e)=>{e.target.onerror = null; e.target.src=`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${props.match.params.id}.png`}}
          alt={receipeData.title}>
        </img>

        <br />
        <dl>
          <dt>Id:</dt> <dd>{(receipeData && receipeData._id) || 'No id'}</dd>
        </dl>
        <dl>
          <dt>Title:</dt> <dd>{(receipeData && receipeData.title) || 'No Title'}</dd>
        </dl>
        <dl>
          <dt>author:</dt> <dd>{(receipeData && receipeData.author.name) || 'No author'}</dd>
        </dl>
        <dl>
          <dt>ReadyInMinutes:</dt> <dd>{(receipeData && receipeData.cookingMinutes) || 'No ReadyInMinutes'}</dd>

        </dl>

        <dl>
          <dt>ingredients:</dt> <dd>{card || 'No DishTypes'}</dd>
        </dl>
        {/* <dl>
          <dt>SourceUrl:</dt> <dd>{(receipeData && <a href={`${receipeData.sourceUrl}`}>{`${receipeData.sourceUrl}`}</a>) || 'No SourceUrl'}</dd>

        </dl> */}
        {/* <dl>
          <dt>SpoonacularUrl:</dt> <dd>{(receipeData && <a href={`${receipeData.spoonacularSourceUrl}`}>{`${receipeData.spoonacularSourceUrl}`}</a>) || 'No SpoonacularUrl'}</dd>
        </dl> */}

        {/* <dl>
          <dt>Cuisines:</dt> {(receipeData && receipeData.cuisines &&
            receipeData.cuisines.map((cuisine) => {
              return <dt key={cuisine}>{cuisine}&nbsp;&nbsp;</dt> ;
            })) ||
            'No Cuisines'}
        </dl> */}
        {/* <dl>
          <dt>Summary:</dt> <dd>{(receipeData &&
            receipeData.summary &&
            receipeData.summary.replace(regex, '')) ||
            'No Summary'}</dd>

        </dl> */}
        <dl>

          <dt>Instructions</dt> <dd>{(receipeData &&
            receipeData.instructionsReadOnly &&
            receipeData.instructionsReadOnly.replace(regex, '')) ||
            'No Instructions'}</dd>
        </dl>
        {/* <dl>
          <dt>Instructions Step:</dt> {(receipeData && 
          receipeData.analyzedInstructions &&
          receipeData.analyzedInstructions.steps &&
            receipeData.analyzedInstructions.steps.map((step) => {
              return (
                <div>{step.step}</div>
              );
            }))}
        </dl> */}
        <CardContent>
          <Typography>
            <button className='showlink' onClick={() => { window.history.back(-1); }}>Back to last page</button>
            {/* <Link to={`/receipe/page/0`}>Back to all receipe list...</Link> */}
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
  else {
    console.log("receipeData", receipeData);
    // receipeData.types.forEach((obj) => {
    //   typeList.push(obj.type.name);
    // })
    const regex = /(<([^>]+)>)/gi;  // for summary
    return (
      <Card className={classes.card} variant="outlined">
        <CardHeader className={classes.titleHead} title={receipeData.title} />
        <img
          class="card-img-top"
          src={receipeData.image}
          // onError={(e)=>{e.target.onerror = null; e.target.src=`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${props.match.params.id}.png`}}
          alt={receipeData.title}>
        </img>

        <br />
        <dl>
          <dt>Id:</dt> <dd>{(receipeData && receipeData.id) || 'No Summary'}</dd>
        </dl>
        <dl>
          <dt>Title:</dt> <dd>{(receipeData && receipeData.title) || 'No Title'}</dd>
        </dl>
        <dl>
          <dt>ReadyInMinutes:</dt> <dd>{(receipeData && receipeData.readyInMinutes) || 'No ReadyInMinutes'}</dd>

        </dl>
        <dl>
          <dt>SourceUrl:</dt> <dd>{(receipeData && <a href={`${receipeData.sourceUrl}`}>{`${receipeData.sourceUrl}`}</a>) || 'No SourceUrl'}</dd>

        </dl>
        <dl>
          <dt>SpoonacularUrl:</dt> <dd>{(receipeData && <a href={`${receipeData.spoonacularSourceUrl}`}>{`${receipeData.spoonacularSourceUrl}`}</a>) || 'No SpoonacularUrl'}</dd>
        </dl>
        <dl>
          <dt>DishTypes:</dt> <dd>{(receipeData && receipeData.dishTypes) || 'No DishTypes'}</dd>
        </dl>
        {/* <dl>
          <dt>Cuisines:</dt> {(receipeData && receipeData.cuisines &&
            receipeData.cuisines.map((cuisine) => {
              return <dt key={cuisine}>{cuisine}&nbsp;&nbsp;</dt> ;
            })) ||
            'No Cuisines'}
        </dl> */}
        <dl>
          <dt>Summary:</dt> <dd>{(receipeData &&
            receipeData.summary &&
            receipeData.summary.replace(regex, '')) ||
            'No Summary'}</dd>

        </dl>
        <dl>

          <dt>Instructions</dt> <dd>{(receipeData &&
            receipeData.instructions &&
            receipeData.instructions.replace(regex, '')) ||
            'No Instructions'}</dd>
        </dl>
        {/* <dl>
          <dt>Instructions Step:</dt> {(receipeData && 
          receipeData.analyzedInstructions &&
          receipeData.analyzedInstructions.steps &&
            receipeData.analyzedInstructions.steps.map((step) => {
              return (
                <div>{step.step}</div>
              );
            }))}
        </dl> */}
        <CardContent>
          <Typography>
            <button className='showlink' onClick={() => { window.history.back(-1); }}>Back to last page</button>
            {/* <Link to={`/receipe/page/0`}>Back to all receipe list...</Link> */}
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
