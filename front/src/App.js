import React from 'react';
import './App.css';
import logo from './img/logo.svg';
import rewardSvg from './img/reward.svg';
import leaderboardSvg from './img/leaderboard.svg';
import typeSvg from './img/type.svg';
import { useState, useEffect } from 'react';
import abi from "./utils/TyperGod.json";




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

const Sidebar = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const contractAddress = "0xd3F1319F7b50a8ea22A36F7A2625d44310aeebf5";

  const contractABI = abi.abi;



  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const handleQuit = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Disconnected", accounts[0]);
      setCurrentAccount("");
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className='sidebar'>
        <Link to="/">
          <img src={logo} alt="logo" style={{"width": "15vw", "marginTop": "3vh"}}/>
        </Link>

        {!currentAccount && (
          <button id="connect-button" onClick={connectWallet}>Please, connect the wallet</button>
          
          )}
        {currentAccount && (
          <button id="connect-button" onClick={handleQuit}>Log out</button>
          
        )}

        <div className="links">
          <Link to="/" className="component-link-text">
            <div className="component-link">
              <img src={rewardSvg} alt="top1Svg" />
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
        <div style={{"borderLeft": "0.3px solid gray", "height": "100vh"}}></div>
        <App />
      </div>
    </Router>
  );
};

export default AppWrapper;