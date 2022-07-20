import React from 'react';
import axios from 'axios';
import './App.css';
import logo from './img/logo.svg';
import rewardSvg from './img/reward.svg';
import leaderboardSvg from './img/leaderboard.svg';
import typeSvg from './img/type.svg';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentAccount } from './features/accountSlice';

import { setPending } from './features/pendingSlice';
import { setWpm } from './features/wpmSlice';
import pic0 from './img/profiles/0.png';
import pic1 from './img/profiles/1.png';
import pic2 from './img/profiles/2.png';
import pic3 from './img/profiles/3.png';
import pic4 from './img/profiles/4.png';
import pic5 from './img/profiles/5.png';
import pic6 from './img/profiles/6.png';
import pic7 from './img/profiles/7.png';
import pic8 from './img/profiles/8.png';
import pic9 from './img/profiles/9.png';

import {
  BrowserRouter as Router,
  Link,
  useRoutes

} from "react-router-dom";

import Leaderboard from './components/leaderboard';
import Rewards from './components/rewards';
import Typing from './components/typing';

const BASE_URL = process.env.REACT_APP_URL;

const App = () => {
  let routes = useRoutes([
    { path: "/", element: <Rewards /> },
    { path: "leaderboard", element: <Leaderboard /> },
    { path: "typing", element: <Typing /> },
  ]);
  return routes;
};

const Sidebar = () => {
  const currentAccount = useSelector((state) => state.currentAccount.value);
  const dispatch = useDispatch();

  const wpm = useSelector((state) => state.wpm.value);
  const pending = useSelector((state) => state.pending.value);
  
  const arr = [pic0, pic1, pic2, pic3, pic4, pic5, pic6, pic7, pic8, pic9];


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
        dispatch(setCurrentAccount(account));

        axios.get(`${BASE_URL}/users/${account}`).then((response) => {
          console.log(response.data);

          dispatch(setWpm(parseInt(response.data[0].WpmSum / response.data[0].attempts)));
          dispatch(setPending(parseInt(response.data[0].pending)));

          }
        );
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

      dispatch(setCurrentAccount(accounts[0]));

      axios.get(`${BASE_URL}/users/${accounts[0]}`).then((response) => {

        if (response.data.length === 0) {
          const address = accounts[0];
          const WpmSum = 0;
          const highscore = 0;
          const img = arr[Math.floor(Math.random() * 9) + 1];

          axios.post(`${BASE_URL}/users`,
            {
              address,
              WpmSum,
              attempts: 0,
              highscore,
              pending,
              img

            })
            .then((response) => {
              // setItems([...items, response.data]);
              console.log(response);
            });
        } else {
          console.log(response.data);
          if(response.data[0].attempts !== 0){
            dispatch(setWpm(parseInt(response.data[0].WpmSum / response.data[0].attempts)));
          }else{
            dispatch(setWpm(parseInt(response.data[0].WpmSum)));

          }
          dispatch(setPending(parseInt(response.data[0].pending)));

        }
      });


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
      dispatch(setCurrentAccount(""));
      dispatch(setPending(0));
      dispatch(setWpm(0));
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();

    

    console.log("Account after refresh: ", currentAccount)

  }, [])

  return (
    <div className='sidebar'>
      <Link to="/">
        <img src={logo} alt="logo" style={{ "width": "15vw", "marginTop": "3vh" }} />
      </Link>

      {!currentAccount && (
        <button id="connect-button" onClick={connectWallet}>Connect the wallet</button>

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
        <Sidebar className="sidebar" />
        <div style={{ "borderLeft": "0.3px solid gray", "height": "100vh" }}></div>
        <App />
      </div>
    </Router>
  );
};

export default AppWrapper;