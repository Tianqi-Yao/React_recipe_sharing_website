import React from "react"
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Tabs, Tab, Card, Container, Row, Col, Button } from 'react-bootstrap'
import noImg from '../img/download.jpeg';
import { Link } from "react-router-dom"
import database from "../config/awsUrl"

const UserRecipe = (props) => {
    const [recipeData, setRecipeData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [deleteData, setDeleteData] = useState(undefined);
    let card = null;
    // let deleteData = undefined;
    // const dispatch = useDispatch();
    // const user = useSelector((state) => state.user);

    async function deleteRecipe(rid) {
        // dispatch(actions.deleteRecipeByUser(props.userData._id, rid));
        // document.getElementById('trainerName').value = '';
        const { data } = await axios.delete(`${database}/users/deleteRecipe?uid=${props.user._id}&rid=${rid}`)
        setDeleteData(data)
        // setRecipeData(data);
    }

    useEffect(
        () => {
            console.log("UserRecipe fired")

            async function fetchData() {
                try {
                    // const { data } = await axios.get(`http://localhost:4000/users/${props.match.params.uid}`);
                    const recipe = await axios.get(`${database}/users/recipe/${props.user._id}`)
<<<<<<< HEAD
=======
                    console.log("recipe",recipe.data);
>>>>>>> 1e44a8a24530ffa36ff12b00d187b2f35c111247
                    setRecipeData(recipe.data)
                    setLoading(false)
                } catch (e) {
                    console.log(e)
                }
            }

            fetchData()
        },
        [deleteData]
    )

    const buildCard = (recipe) => {
        return (
            <Col sm={4} key={recipe._id}>
                <Card className="mb-3"
                    style={{
                        maxWidth: 250,
                        height: 'auto',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        borderRadius: 5
                    }}
                >
                    {recipe.image ? (<Card.Img variant="top" src={recipe.image} className="recipeImg" alt="recipe image" />) : (<Card.Img variant="top" src={noImg} className="recipeImg" alt="recipe image" />)}

                    {/* <Card.Img variant="top" src={testLogo} className="recipeImg" /> */}
                    <Card.Body>
                        <Link to={`/receipe/${recipe._id}`}><Card.Title>{recipe.title}</Card.Title></Link>
                        <Card.Text>{recipe.instructionsReadOnly}</Card.Text>
                        
                        <Button variant="danger" onClick={() => deleteRecipe(recipe._id)}>Delete</Button>
                        <Button variant="danger" onClick={() => window.location.href = `/updateReceipe/${recipe._id}`}>Edit</Button>
                    </Card.Body>
                </Card>
            </Col>
        )
    }

    if (recipeData && recipeData.length !== 0) {
        card =
            recipeData &&
            recipeData.map((recipe) => {
                return buildCard(recipe);
            });
    } else {
        card = (<div>Share Your Recipe Now! <Link to="/createReceipe">Click To Create Recipe</Link></div>)

    }

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
        )
    }

}

export default UserRecipe

