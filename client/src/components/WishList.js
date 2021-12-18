import React from "react";
import { useState, useEffect } from 'react';
import { Tabs, Tab, Card, Container, Row, Col, Button } from 'react-bootstrap';
import '../App.css';
import axios from 'axios';
import testLogo from '../img/testFood.jpg';
import { Link } from "react-router-dom";

const WishList = (props) => {
    const [wishListeData, setWishListeData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [deleteData, setDeleteData] = useState(undefined);

    async function removeLike(rid) {
        const { data } = await axios.patch(`http://localhost:3001/users/unlike?uid=${props.user._id}&rid=${rid}`);
        setDeleteData(data);
    };

    useEffect(
        () => {
            console.log("WishList fired")
            async function fetchData() {
                try {
                    const recipe = await axios.get(`http://localhost:3001/users/wishlist/${props.user._id}`);
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
                <Card.Img variant="top" src={recipe.image} className="wishImg" />
                <Card.Body>
                    <Card.Text>
                        {recipe.title}
                        <button aria-label="Mute" onClick={() => removeLike(recipe._id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
                                <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
                            </svg>
                        </button>
                    </Card.Text>
                </Card.Body>
            </Card >
        );
    }

    let card =
        wishListeData &&
        wishListeData.map((recipe) => {
            return buildCard(recipe);
        });

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

