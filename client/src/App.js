import React from 'react'
// import logo from './img/pokeBall.png';
import './App.css'

import Home from './components/Home'
import TodoList from './components/Todo'
import ReceipePage from './components/ReceipePage'
import UserMakeReceipePage from './components/UserMakeReceipePage'
import Receipe from './components/Receipe'
import CreateReceipe from './components/CreateReceipe'
import UpdateReceipe from './components/UpdateReceipe'
import Signup from "./components/Signup"
import Login from "./components/Login"
// import PopularSearch from './components/PopularSearch'
// import ReceipeSearch from './components/ReceipeSearch';
// import Header from './components/Header'
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom"
import {AuthProvider} from "./contexts/AuthContext"
import ForgotPassword from "./components/ForgotPassword"
import PrivateRoute from "./components/PrivateRoute"
import UpdateProfile from "./components/UpdateProfile"
import {Container} from "react-bootstrap"
import UserProfile from "./components/UserProfile"
import PrivateLink from "./components/PrivateLink"
import UserSignLogin from "./components/UserSignLogin"

import EditProfile from "./components/EditProfile"
import NoMatch from "./components/NoMatch"

function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    {/* <img src={logo} className="App-logo" alt="logo" /> */}
                    <h1 className="App-title">Recipes Sharing Platform</h1>
                    <p className="hometext">
                        The project is for people to make and find tasty foods' receipe. Users can see other users’
                        sharing information on this platform.
                        Users can find and upload their recipe as well as use a task tracker to plan buying different
                        ingredients.
                    </p>
                    <Link className="showlink" to="/">Home</Link>
                    <Link className="showlink" to="/todo">TodoList</Link>
                    <Link className="showlink" to="/receipe/page/0">ReceipePage</Link>
                    <Link className="showlink" to="/receipe/user/page/0">UserMakeReceipePage</Link>
                    <UserSignLogin/>
                </header>
                <br/>
                <br/>
                <div
                    className="App-body">  {/* "/shows/page/:pagenum" will generate 'props.match.params.pagenum' and pass it to "components" */}
                    <React.Fragment>
                        <AuthProvider>
                            <Switch>
                                <Route exact path="/" component={Home}/>
                                <Route path="/todo" component={TodoList}/>
                                <Route path="/receipe/page/:page" component={ReceipePage}/>
                                <Route path="/receipe/user/page/:page" component={UserMakeReceipePage}/>
                                <Route path="/receipe/:id" component={Receipe}/>
                                <Route path="/createReceipe" component={CreateReceipe}/>
                                <Route path="/updateReceipe/:id" component={UpdateReceipe}/>
                                <PrivateRoute path="/editprofile/:uid" component={EditProfile}/>
                                <PrivateRoute path="/userprofile/:uid" component={UserProfile}/>
                                {/*<Route path="*" component={NoMatch}/>*/}
                                <Container
                                    className="border-0 d-flex align-items-center justify-content-center">
                                    <div className="w-100" style={{maxWidth: "400px"}}>
                                        <Route path="/signup" component={Signup}/>
                                        <Route path="/login" component={Login}/>
                                        <Route path="/forgot-password" component={ForgotPassword}/>
                                        <PrivateRoute path="/update-profile" component={UpdateProfile}/>
                                    </div>
                                </Container>
                                {/* <Route exact path="/search" component={ReceipeSearch} /> */}
                            </Switch>
                        </AuthProvider>
                    </React.Fragment>
                </div>
            </div>
        </Router>
    )
}

export default App
