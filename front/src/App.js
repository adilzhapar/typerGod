import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'

import './App.css';
import logo from './img/logo.svg';
import rewardSvg from './img/reward.svg';
import leaderboardSvg from './img/leaderboard.svg';
import typeSvg from './img/type.svg';
import logOutSvg from './img/log-out.svg';
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

import abi from "./utils/TyperGod.json";
import { ethers } from "ethers";

import {
  BrowserRouter as Router,
  Link,
  useRoutes

} from "react-router-dom";

import Leaderboard from './components/leaderboard';
import Rewards from './components/rewards';
import Typing from './components/typing';

const BASE_URL = "https://typer-god.herokuapp.com";

const links = [
  {
    "link": "/",
    "component": "Typing",
    "img": typeSvg,
    "class": "chosen-component-link"
  },
  {
    "link": "rewards",
    "component": "Rewards",
    "img": rewardSvg,
    "class": "component-link"
  },
  {
    "link": "leaderboard",
    "component": "Leaderboard",
    "img": leaderboardSvg,
    "class": "component-link"
  }
]

const MySwal = withReactContent(Swal)


const App = () => {
  let routes = useRoutes([
    { path: "/", element: <Typing /> },
    { path: "typing", element: <Typing /> },
    { path: "leaderboard", element: <Leaderboard /> },
    { path: "rewards", element: <Rewards /> },
  ]);
  return routes;
};

const Sidebar = () => {
  const contractAddress = "0xd3F1319F7b50a8ea22A36F7A2625d44310aeebf5";

  const contractABI = abi.abi;
  const currentAccount = useSelector((state) => state.currentAccount.value);
  const dispatch = useDispatch();

  const wpm = useSelector((state) => state.wpm.value);
  const pending = useSelector((state) => state.pending.value);

  const arr = [pic0, pic1, pic2, pic3, pic4, pic5, pic6, pic7, pic8, pic9];
  const [componentLinks, setComponentLinks] = useState(links);
  const [onChain, setOnChain] = useState(0);



  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      let chainId = await ethereum.request({ method: 'eth_chainId' });
      const rinkebyChainId = "0x4";
      if (chainId !== rinkebyChainId) {
        // alert("You are not connected to the Rinkeby Test Network!");
        MySwal.fire({
          icon: 'warning',
          width: 500,
          height: 400,
          title: 'Oops...',
          text: 'You are not connected to the Rinkeby Test Network!',
        })
        return;
      }

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
        handleOnChain();


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
        MySwal.fire({
          icon: 'warning',
          confirmButtonText: '<a target="_blank" class="swal-link" href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=ru">Install</a>',
          title: 'Please, install Metamask',
          showCancelButton: true,
        })
        
        // window.open("https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=ru", "_blank");
        return;
      }

      let chainId = await ethereum.request({ method: 'eth_chainId' });
      const rinkebyChainId = "0x4";
      if (chainId !== rinkebyChainId) {
        // alert("You are not connected to the Rinkeby Test Network!");
        MySwal.fire({
          icon: 'warning',
          width: 500,
          height: 400,
          title: 'Oops...',
          text: 'You are not connected to the Rinkeby Test Network!',
        })
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
          if (response.data[0].attempts !== 0) {
            dispatch(setWpm(parseInt(response.data[0].WpmSum / response.data[0].attempts)));
          } else {
            dispatch(setWpm(parseInt(response.data[0].WpmSum)));

          }
          dispatch(setPending(parseInt(response.data[0].pending)));

        }
      });


    } catch (error) {
      console.log(error)
    }
  }

  const handleOnChain = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const typerGodContract = new ethers.Contract(contractAddress, contractABI, signer);

        const tokens = await typerGodContract.getTokens();
        // console.log(tokens);
        setOnChain(parseInt(String(tokens)));
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleQuit = async () => {
    try {
      const { ethereum } = window;


      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Disconnected", accounts[0]);
      dispatch(setCurrentAccount(""));
      dispatch(setPending(0));
      dispatch(setWpm(0));
    } catch (error) {
      console.log(error)
    }
  }

  const handleComponent = (component_name) => {

    setComponentLinks((prevLinks) =>
      prevLinks.map((obj) => {
        if (obj.component === component_name) {
          return { ...obj, class: "chosen-component-link" };
        } else {
          return { ...obj, class: "component-link" };
        }
      })

    );

  }

  useEffect(() => {
    checkIfWalletIsConnected();

    console.log("Account after refresh: ", currentAccount)

  }, [])


  return (
    <div className='sidebar'>
      <Link to="/" onClick={() => handleComponent("Typing")}>
        <img src={logo} alt="logo" style={{ "width": "15vw", "marginTop": "3vh" }} />
      </Link>

      {!currentAccount && (
        <button className="cta-button connect-wallet-button" onClick={connectWallet}>Connect the wallet</button>

      )}
      {currentAccount && (
        <div className="cta-button connect-wallet-button log-out" onClick={handleQuit}>
          <div className="log-out-left">
            <p className="log-out-left-p">{currentAccount.substr(0, 15)}...</p>
            <p className="log-out-left-p" id="log-out-left-tgt">{onChain} TGT</p>
          </div>
          <div className="log-out-right">
            <img className="log-out-right-img" src={logOutSvg} alt="logout"></img>
          </div>
        </div>

      )}

      <div className="links">
        {componentLinks.map((item, index) => (
          <Link key={index} to={item.link} className="component-link-text" onClick={() => handleComponent(item.component)}>
            <div className={item.class}>
              <img src={item.img} alt={item.link} />
              {item.component}
            </div>
          </Link>
        )

        )}

      </div>

    </div>
  );
}



const AppWrapper = () => {
  return (
    <Router>
      <div className="all">
        <Sidebar className="sidebar" />
        <App />
      </div>
    </Router>
  );
};

export default AppWrapper;