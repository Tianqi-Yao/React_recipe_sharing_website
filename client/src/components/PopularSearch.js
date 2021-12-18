import React, { useState, useEffect } from 'react'
// import { useSelector, useDispatch } from 'react-redux';

import axios from 'axios';  // query server router
import { Link, useHistory } from 'react-router-dom';  // for URL synchronization

// import { Card } from 'react-bootstrap';
import '../App.css';
// import SearchForm from './SearchForm';
import SubmitForm from './SubmitForm';
import database from  '../config/awsUrl'
import { Card, CardContent, Grid, Typography, makeStyles } from '@material-ui/core';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';


const useStyles = makeStyles({
  card: {
    maxWidth: 250,
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


const PopularSearch = (props) => {
  // 1 - For fetch data
  const classes = useStyles();  // for using '@material-ui/core'
  const [ loading, setLoading ] = useState(true);  // ❤ setting my initial state is just like constructor(props) in Class-Based Compoennt
  const [ initialData, setInitialData ] = useState(undefined);
  const [ pageData, setPageData ] = useState(undefined);
  // For search
  const [ searchData, setSearchData] = useState(undefined);
  const [ submitTerm, setSubmitTerm ] = useState('');
  let card = null;

  // 1 - initial loading data
  useEffect(() => {
    // console.log('Initial loading useeffect() in PokemonPage.js');
    async function fetchData() {
      try {
        const { data } = await axios.get(`${database}/receipe/page/0`);
        // console.log(data.data.results);
        setInitialData(data.results);
        setLoading(false);
        // setLastPageNum(Math.floor(data.totalResults/ data.number));  // set last page number. //! actually last page number could be 30, after that will repeat
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();  // call fetchData()
  }, []);


  // 2. submitTerm in 'SubmitForm' fire this
  useEffect(() => {  // search form keyword fire this
    async function fetchData() {
      try {
        // const urlSearchForm = baseUrl + '?nameStartsWith=' + submitTerm + '&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
        console.log(`search: ${submitTerm}`);
        const { data } = await axios.post(`${database}/receipe/search`, {
          searchTerm: `${submitTerm}`
        });
        setSearchData(data.results);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    if (submitTerm) {
      fetchData();
    }
  }, [submitTerm]);

  const submitReceipeTerm = async (submitTerm) => {  //! SubmitForm, I need a hook that is triggered by 'submitTerm', and in this hook, I need axios to call /search in server side and store returned json
    setSubmitTerm(submitTerm);
  }

  // card UI
  const buildCard = (receipe) => {
    return (
      <Grid item xs={12} sm={4} md={2} lg={2} xl={2} key={receipe.id}>
        <Card className={classes.card} variant="outlined">
          <Link to={`/receipe/${receipe.id}`}>
            <img 
              className="card-img-top" 
              src={receipe.image}
              alt={receipe.title}
            ></img> {/* https://stackoverflow.com/questions/34097560/react-js-replace-img-src-onerror */}
            
            <CardActionArea>
              <CardContent>
                <Typography className={classes.titleHead} gutterBottom variant="h6" component="h2">
                  {receipe.title}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Link>

          <CardActions>
            {/* {isFavoriated !=-1 ? 
              <button onClick={() => { releasePokemonFromSelectedTrainer(pokemonState);}}>unFavoriated</button> :  */}
                <button onClick={() => {}}>Collect</button>
          </CardActions>
        </Card>
      </Grid>
    );
  };


  if (submitTerm) {
    card = searchData && searchData.map((char) => {
      return buildCard(char);
    });
  }
  // else {
  //   // {
  //   //   "id": 716426,
  //   //   "title": "Cauliflower, Brown Rice, and Vegetable Fried Rice",
  //   //   "image": "https://spoonacular.com/recipeImages/716426-312x231.jpg",
  //   //   "imageType": "jpg"
  //   // },
  //   card = initialData && initialData.map((receipe) => {
  //     return buildCard(receipe);
  //   });
  //   // console.log('initialData:', card);
  // }

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else {
    return (
      <div>
        {(
          <div>
            <SubmitForm searchValue={submitReceipeTerm}/>
            <br />
            <br />
            <Grid container className={classes.grid} spacing={5}>
              {card}
            </Grid>
          </div>
        )}
      </div>
    )
  } 
};

export default PopularSearch

