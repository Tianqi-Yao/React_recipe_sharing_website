import logo from './logo.svg';
import React from "react";
import './App.css';
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
          <ul>
            <li>
              <NavLink to="/userprofile/:uid">UserProfile</NavLink>
            </li>
          </ul>
        </header>
        <Switch>
          <Route exact path="/userprofile/:uid" component={UserProfile}>
          </Route>
          {/* <Route exact path="/userrecipe" component={UserRecipe}>
          </Route> */}
          <Route exact path="/editprofile/:img" component={EditProfile}>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
