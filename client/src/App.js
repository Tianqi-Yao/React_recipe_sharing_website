import React from 'react'
// import logo from './img/pokeBall.png';
import logo from './logo.svg';
import React from "react";
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Home from './components/Home';
import TodoList from './components/Todo';
import ReceipePage from './components/ReceipePage';
import Receipe from './components/Receipe';
import CreateReceipe from './components/CreateReceipe';
import UpdateReceipe from './components/UpdateReceipe';

import PopularSearch from './components/PopularSearch';
// import ReceipeSearch from './components/ReceipeSearch';
// import Header from './components/Header'
import UserProfile from './components/UserProfile';
import UserRecipe from './components/UserRecipe';
import EditProfile from './components/EditProfile';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          <h1 className="App-title">Recipes Sharing Platform</h1>
          <p className="hometext">
            The project is for people to make and find tasty foods' receipe. Users can see other users’ sharing information on this platform. 
            Users can find and upload their recipe as well as use a task tracker to plan buying different ingredients. 
          </p>
          <Link className="showlink" to="/">Home</Link>
          <Link className="showlink" to="/todo">TodoList</Link>
          <Link className="showlink" to="/receipe/page/0">ReceipePage</Link>
          <Link className="showlink" to="/createReceipe">Create Receipe</Link>
          <Link className="showlink" to="/updateReceipe">Update Receipe</Link>
        </header>
        <br />
        <br />
        <div className="App-body">  {/* "/shows/page/:pagenum" will generate 'props.match.params.pagenum' and pass it to "components" */}
          <Route exact path="/" component={Home} />
          <Route exact path="/todo" component={TodoList} />
          <Route exact path="/receipe/page/:page" component={ReceipePage} />
          <Route exact path="/receipe/:id" component={Receipe} />
          <Route exact path="/createReceipe" component={CreateReceipe} />
          <Route exact path="/updateReceipe" component={UpdateReceipe} />
          {/* <Route exact path="/search" component={ReceipeSearch} /> */}
        </div>
      </div>
    </Router>
  );
}

export default App;
