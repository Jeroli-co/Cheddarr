import React from 'react';
import {Route} from "react-router";
import './App.css';
import Navbar from "./component/navbar/Navbar";
import Home from "./home/Home";
import SignIn from "./component/sign-in/SignIn";
import SignUp from "./component/sign-up/SignUp";

function App() {
  return (
    <div className="App">
      <Navbar/>
      <Route exact path='/' component={Home} />
      <Route exact path='/sign-in' component={SignIn} />
      <Route exact path='/sign-up' component={SignUp} />
    </div>
  );
}

export default App;
