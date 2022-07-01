import React from 'react';
import './App.css';
import logo from './img/logo.svg';
import rewardSvg from './img/reward.svg';
import leaderboardSvg from './img/leaderboard.svg';
import typeSvg from './img/type.svg';



import {
  BrowserRouter as Router,
  Link,
  useRoutes
  
} from "react-router-dom";

import Leaderboard from './components/leaderboard';
import Rewards from './components/rewards';
import Typing from './components/typing';

const App = () =>{
  let routes = useRoutes([
    { path: "/", element: <Rewards /> },
    { path: "leaderboard", element: <Leaderboard /> },
    { path: "typing", element: <Typing /> },
  ]);
  return routes;
};

const Sidebar = () =>{
  return (
    <div className='sidebar'>
        <Link to="/">
          <img src={logo} alt="logo" style={{"width": "15vw", "marginTop": "3vh"}}/>
        </Link>

        <button id="connect-button">Please, connect the wallet</button>

        <div className="links">
          <Link to="/" className="component-link-text">
            <div className="component-link">
              <img src={rewardSvg} alt="rewardSvg" />
              Rewards
            </div>
          </Link>

          <Link to="/leaderboard" className="component-link-text">
            <div className="component-link">
              <img src={leaderboardSvg} alt="leaderboardSvg" />
              Leaderboard
            </div>
          </Link>

          <Link to="/typing" className="component-link-text">
            <div className="component-link">
              <img src={typeSvg} alt="typeSvg" />
              Typing
            </div>
          </Link>
        </div>
      
    </div>
  );
}



const AppWrapper = () => {
  return (
    <Router>
      <div className="all">
        <Sidebar className="sidebar"/>
        <App />
      </div>
    </Router>
  );
};

export default AppWrapper;