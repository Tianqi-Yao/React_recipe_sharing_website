import React from "react";
import { useState, useEffect } from 'react';
import { Tabs, Tab, Card, Container, Row, Col, Button } from 'react-bootstrap';
import '../App.css';
import axios from 'axios';
import testLogo from '../img/testFood.jpg';
import { Link } from "react-router-dom";
import database from "../config/awsUrl"
const WishList = (props) => {
    const [wishListeData, setWishListeData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [deleteData, setDeleteData] = useState(undefined);
    let card = null;

    async function removeLike(rid) {
        const { data } = await axios.patch(`${database}/users/unlike?uid=${props.user._id}&rid=${rid}`);
        setDeleteData(data);
    };

    useEffect(
        () => {
            console.log("WishList fired")
            async function fetchData() {
                try {
                    const recipe = await axios.get(`${database}/users/wishlist/${props.user._id}`);
                    setWishListeData(recipe.data);
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
            <Card style={{
                width: "auto",
                height: 300
            }}
                className="mb-3">
                <Card.Img variant="top" src={recipe.image} className="wishImg" alt="recipe image"/>
                <Card.Body>
                    {/* <Card.Text> */}
                        {recipe._id ? (<Card.Text><Link to={`/receipe/${recipe._id}`}>{recipe.title}</Link>
                        <button aria-label="Mute" onClick={() => removeLike(recipe._id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star-fill like-icon" viewBox="0 0 16 16">
                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                        </button></Card.Text>) : (<Card.Text><Link to={`/receipe/${recipe.id}`}>{recipe.title}</Link>
                        <button aria-label="Mute" onClick={() => removeLike(recipe.id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star-fill like-icon" viewBox="0 0 16 16">
                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                        </button></Card.Text>)}
                        
                    {/* </Card.Text> */}
                </Card.Body>
            </Card >
        );
    }


    if (wishListeData && wishListeData.length !== 0) {
        card =
            wishListeData &&
            wishListeData.map((recipe) => {
                return buildCard(recipe);
            });
    } else {
        card = (<div>You Like Nothing!</div>)

    }

    if (loading) {
        return (
            <div>loading...</div>
        );
    } else {
        return (
            <Container>
                {card}
            </Container >
        )
    }


}

export default WishList;

