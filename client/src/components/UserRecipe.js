// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link, Redirect } from 'react-router-dom';
// import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography, makeStyles } from '@material-ui/core';
// import { useSelector, useDispatch } from "react-redux";
// import actions from "../actions";

// import '../App.css';
// const useStyles = makeStyles({
//     card: {
//         maxWidth: 250,
//         height: 'auto',
//         marginLeft: 'auto',
//         marginRight: 'auto',
//         borderRadius: 5,
//         border: '1px solid #1e8678',
//         boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
//     },
//     titleHead: {
//         borderBottom: '1px solid #1e8678',
//         fontWeight: 'bold'
//     },
//     grid: {
//         flexGrow: 1,
//         flexDirection: 'row'
//     },
//     media: {
//         height: '100%',
//         width: '100%'
//     },
//     button: {
//         color: '#1e8678',
//         fontWeight: 'bold',
//         fontSize: 12
//     }
// });

// const UserRecipe = (props) => {
//     let regexp = /[0-9]/g;
//     const dispatch = useDispatch();
//     const [loading, setLoading] = useState(true);
//     const pokemon = useSelector((state) => state.pokemons);
//     const selected = useSelector((state) => state.selected);
//     const allTrainers = useSelector((state) => state.trainers);
//     let selectedTrainer = null;
//     allTrainers.map((trainer) => {
//         if (trainer.id == selected.id) {
//             selectedTrainer = trainer;
//         }
//     });
//     console.log(pokemon);
//     const {
//         pageData,
//         resultsPerPage,
//         offset,
//     } = pokemon;

//     const classes = useStyles();
//     const [error, setError] = useState(false);
//     const [next, setNext] = useState(true);
//     let card = null;
//     let pagination = null;
//     const isCatched = (url) => {
//         let catched = false;
//         if (selectedTrainer.catchedPokemon != null) {
//             selectedTrainer.catchedPokemon.map((pokemon) => {
//                 if (pokemon == url) {
//                     catched = true;
//                 }
//             });
//         }
//         return catched;
//     }
//     const isFull = () => {
//         if (selectedTrainer.catchedPokemon != null && selectedTrainer.catchedPokemon.length >= 6) {
//             return true;
//         }
//         return false;
//     }

//     useEffect(() => {
//         console.log('pagination useEffect fired');
//         async function fetchData() {
//             try {
//                 const { data } = await axios.get(`http://localhost:4000/pokemon/page/${props.match.params.pagenum}`);
//                 if (data.next == null) {
//                     setNext(false);
//                 } else {
//                     setNext(true);
//                 }
//                 dispatch(actions.getPokemonList(data));
//             } catch (e) {
//                 setError(true);
//                 console.log(e);
//             } finally {
//                 setLoading(false);
//             }
//         }
//         fetchData();
//     }, [props.match.params.pagenum]);

//     const buildCard = (pokemon) => {
//         let pokemonId = pokemon.url.substring(34).match(regexp).join('');
//         let imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
//         let button = <button onClick={(e) => {
//             e.preventDefault();
//             dispatch(actions.catchedPokemon(selected.id, imgUrl));
//         }}>Catch</button>;
//         if (isCatched(imgUrl)) {
//             button = (<button onClick={(e) => {
//                 e.preventDefault();
//                 dispatch(actions.releasePokemon(selected.id, imgUrl));
//             }}>Release</button>);
//         } else if (isFull()) {
//             button = (<button onClick={(e) => {
//                 e.preventDefault();
//             }}>Party Full</button>);
//         }
//         return (
//             <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={pokemonId}>
//                 <Card className={classes.card} variant='outlined'>
//                     {/* <CardActionArea> */}

//                     <CardMedia
//                         className={classes.media}
//                         component='img'
//                         image={imgUrl}
//                         title='pokemon image'
//                     />

//                     <CardContent>
//                         <Link to={`/pokemon/${pokemonId}`}>
//                             <Typography className={classes.titleHead} gutterBottom variant='h6' component='h2'>
//                                 {pokemon.name}
//                             </Typography>
//                         </Link>
//                         <Typography variant='body2' color='textSecondary' component='div'>
//                             <div>
//                                 {button}
//                                 {/* <Button element={pokemon} /> */}
//                             </div>
//                         </Typography>
//                     </CardContent>

//                     {/* </CardActionArea> */}
//                 </Card>
//             </Grid>
//         );
//     };

//     card =
//         pokemon.pageData &&
//         pokemon.pageData.map((pokemon) => {
//             return buildCard(pokemon);
//         });




//     pagination = (<div>
//         {props.match.params.pagenum > 0 && (
//             <Link
//                 to={`/pokemon/page/${parseInt(props.match.params.pagenum) - 1}`}
//             >
//                 Previous Page
//             </Link>
//         )}
//         &nbsp;&nbsp;
//         {(next === true) && (
//             <Link
//                 to={`/pokemon/page/${parseInt(props.match.params.pagenum) + 1}`}
//             >
//                 Next Page
//             </Link>
//         )}
//     </div>);

//     if (loading) {
//         return (
//             <div>
//                 <h2>Loading....</h2>
//             </div>
//         );
//     } else if (error) {
//         return (
//             <Redirect to="/NotFound" />
//         );
//     } else {
//         return (
//             <div>
//                 {pagination}
//                 <br />
//                 <br />
//                 <Grid container className={classes.grid} spacing={5}>
//                     {card}
//                 </Grid>
//             </div>
//         );
//     }

// }

// export default UserRecipe;


import React from "react";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs, Tab, Card, Container, Row, Col, Button } from 'react-bootstrap';
import testLogo from '../img/testFood.jpg';
import testTwo from '../img/image.jpg';
import { Link } from "react-router-dom";

const UserRecipe = (props) => {
    const [recipeData, setRecipeData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [deleteData, setDeleteData] = useState(undefined);
    // let deleteData = undefined;
    // const dispatch = useDispatch();
    // const user = useSelector((state) => state.user);

    async function deleteRecipe(rid) {
        // dispatch(actions.deleteRecipeByUser(props.userData._id, rid));
        // document.getElementById('trainerName').value = '';
        const { data } = await axios.delete(`http://localhost:4000/users/deleteRecipe?uid=${props.user._id}&rid=${rid}`);
        setDeleteData(data);
    };

    useEffect(
        () => {
            console.log("useEffect fired")
            async function fetchData() {
                try {
                    // const { data } = await axios.get(`http://localhost:4000/users/${props.match.params.uid}`);
                    const recipe = await axios.get(`http://localhost:4000/users/recipe/${props.user._id}`);
                    setRecipeData(recipe.data);
                    setLoading(false);
                } catch (e) {
                    console.log(e);
                }
            }
            fetchData();
        },
        [deleteData]
    );

    const buildCard = (recipe) => {
        return (
            <Col sm={4}>
                <Card className="mb-3"
                    style={{
                        maxWidth: 250,
                        height: 'auto',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        borderRadius: 5
                    }}
                >
                    {/* <Card.Img variant="top" src={recipe.Photo} className="recipeImg" /> */}
                    <Card.Img variant="top" src={testLogo} className="recipeImg" />
                    <Card.Body>
                        <Link to=""><Card.Title>{recipe.title}</Card.Title></Link>
                        <Card.Text>
                            {recipe.postContent}
                        </Card.Text>
                        <Button variant="danger" onClick={() => deleteRecipe(recipe._id)}>Delete</Button>
                    </Card.Body>
                </Card>
            </Col>
        )
    }

    let card =
        recipeData &&
        recipeData.map((recipe) => {
            return buildCard(recipe);
        });

    if (loading) {
        return (
            <div>loading...</div>
        )
    } else {
        return (
            <Container>
                <Row>
                    {card}
                </Row>
            </Container>
        );
    }

}

export default UserRecipe;

