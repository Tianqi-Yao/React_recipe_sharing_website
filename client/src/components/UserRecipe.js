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
