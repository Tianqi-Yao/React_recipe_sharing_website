import React, { useState, useEffect } from "react"
import { Tabs, Tab, Card, Container, Row, Col, Button } from 'react-bootstrap'
import axios from "axios"
// import EditProfile from './EditProfile';
import UserRecipe from './UserRecipe'
import WishList from './WishList'
import noImg from '../img/download.jpeg'
import '../App.css'
import { Link, useHistory } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import database from "../config/awsUrl"

function UserProfile(props) {
    const [editBtnToggle, setBtnToggle] = useState(false)
    const [key, setKey] = useState('userRecipe')
    const [loading, setLoading] = useState(true)
    const [userData, setUserData] = useState(undefined)
    const { currentUser } = useAuth()
    const [recipeData, setRecipeData] = useState(undefined)
    const [formData, setFormData] = useState({ task: '', taskDesc: '' })
    const history = useHistory()
    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }
    const ChangeProfile = async (e) => {
        let userName = document.getElementById('userName').value
        let password = document.getElementById('Password').value
        let newUser = await axios.patch(`${database}/users/updateProfile`, {
            params: {
                id: props.match.params.uid,
                userName: userName,
                password: password
            }
        })
        setBtnToggle(false)
    }

    function goUpdatePage(e) {
        e.preventDefault()
        history.push('/update-profile')
    }

    const CancelChange = () => {
        setBtnToggle(false)
    }
    let userProfile = null

    useEffect(
        () => {
            console.log("useEffect fired")

            async function fetchData() {
                try {
                    const { data } = await axios.get(`${database}/users/${props.match.params.uid}`)
                    // const recipe = await axios.get(`http://localhost:4000/users/recipe/${props.match.params.uid}`);
                    // setRecipeData(recipe.data);
                    setUserData(data)
                } catch (e) {
                    console.log(e)
                } finally {
                    setLoading(false)
                }
            }

            fetchData()
        },
        [history]
    )

    const buildProfile = (user) => {
        if (editBtnToggle === false) {
            return (<Card.Body> <Card.Title>{user.userName}</Card.Title><Button variant="primary"
                onClick={goUpdatePage}>Edit
                Profile</Button></Card.Body>)
        } else {
            return (
                <div className="add">
                    <div className="input-selection">
                        <label>
                            UserName:
                            <input
                                // onChange={(e) => handleChange(e)}
                                placeholder={user.userName}
                                // value={user.userName}
                                id="userName"
                                name="userName"
                            />
                        </label>
                        <br />
                        <br />
                        <label>
                            Password:
                            <input
                                // onChange={(e) => handleChange(e)}
                                placeholder={user.password}
                                // value={user.password}
                                id="Password"
                                name="Password"
                            />
                        </label>
                        {/* <br />
                        <br />
                        <label>
                            Profile picture:
                            <input type="file" id="img" name="img" accept="image/*"></input>
                        </label> */}
                    </div>
                    <button onClick={ChangeProfile}>Submit</button>
                    <button onClick={CancelChange}>Cancel</button>
                </div>)
        }
    }

    userProfile = (userData && buildProfile(userData))


    if (loading) {
        return (<p>loading...</p>)
    } else {
        console.log(userProfile)
        return (
            <Container>
                <Row>
                    <Col sm={4}>
                        <Card>
                            <Link to={`/editprofile/${userData._id}`}>
                                {userData.Photo ? (<Card.Img variant="top" src={userData.Photo} alt="User Icon" />) : (
                                    <Card.Img variant="top" src={noImg} alt="No User Photo" />)}
                            </Link>
                            {userProfile}
                            {/* {!editBtnToggle ? (<Card.Body> <Card.Title>{userData.userName}</Card.Title>
                                <Button variant="primary" onClick={() => setBtnToggle(!editBtnToggle)}>Edit Profile</Button></Card.Body>) : (<EditProfile user={userData} />)} */}

                        </Card>
                    </Col>
                    <Col sm={8}>
                        <Tabs
                            id="controlled-tab-example"
                            activeKey={key}
                            onSelect={(k) => setKey(k)}
                            className="mb-3"
                        >
                            <Tab eventKey="userRecipe" title="UserRecipe">
                                <UserRecipe user={userData} />
                            </Tab>
                            <Tab eventKey="wishList" title="WishList">
                                {/* wishlist */}
                                <WishList user={userData} />
                            </Tab>
                            <Tab eventKey="createRecipe" title="Create Recipe">
                                <Link to={`/createReceipe`}>Click To Create Recipe</Link>
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>
            </Container>
        )
    }

}

export default UserProfile