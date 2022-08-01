import React, { useEffect, useState } from "react";
import gift from '../../img/gift.svg';
import send from '../../img/send.svg';
import Swal from 'sweetalert2'

import './index.css';
import { useSelector, useDispatch } from 'react-redux';
import { setPending } from '../../features/pendingSlice';

import abi from "../../utils/TyperGod.json";
import { ethers } from "ethers";
import axios from "axios";


const BASE_URL = "https://typer-god.herokuapp.com";
// const BASE_URL = "http://localhost:8080";



const Rewards = () => {
    const wpm = useSelector((state) => state.wpm.value);
    const pending = useSelector((state) => state.pending.value);
    const [onChain, setOnChain] = useState(0);
    const dispatch = useDispatch();
    const currentAccount = useSelector((state) => state.currentAccount.value);

    const contractAddress = "0xd3F1319F7b50a8ea22A36F7A2625d44310aeebf5";

    const contractABI = abi.abi;

    const checkIfWalletIsConnected = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                console.log("Make sure you have metamask!");
                return;
            } else {
                console.log("We have the ethereum object in Rewards", ethereum);
            }

            const accounts = await ethereum.request({ method: "eth_accounts" });

            if (accounts.length !== 0) {
                const account = accounts[0];
                console.log("Found an authorized account:", account);

            } else {
                console.log("No authorized account found");
            }
            handleOnChain();

        } catch (error) {
            console.log(error);
        }
    };

    const handleTransaction = async () => {
        if (pending > 0) {
            try {
                const { ethereum } = window;


                if (ethereum) {
                    const provider = new ethers.providers.Web3Provider(ethereum);
                    const signer = provider.getSigner();
                    const typerGodContract = new ethers.Contract(contractAddress, contractABI, signer);

                    const waveTxn = await typerGodContract.sendTokens(pending, { gasLimit: 300000 });
                    console.log("Mining...", waveTxn.hash);
                    Swal.fire({
                        position: 'top',
                        icon: 'success',
                        height: 100,
                        title: 'Transaction will be synced soon',
                        showConfirmButton: false,
                        timer: 3000
                    })

                    await waveTxn.wait().then(() => Swal.fire({
                        position: 'top',
                        icon: 'success',
                        height: 100,
                        title: 'Transaction have synced',
                        showConfirmButton: false,
                        timer: 3000
                    }));
                    console.log("Mined -- ", waveTxn.hash);
                    handleOnChain();

                    let WpmSum, attempts, highscore, img;
                    

                    const newData = await axios.get(`${BASE_URL}/users/${currentAccount}`);
                    WpmSum = newData.data[0].WpmSum;
                    attempts = newData.data[0].attempts;
                    highscore = newData.data[0].highscore;
                    img = newData.data[0].img;
                    await axios.put(`${BASE_URL}/users/${currentAccount}`,
                        {
                            WpmSum,
                            attempts,
                            highscore,
                            "pending": 0,
                            img,
                        });


                    dispatch(setPending(0));

                } else {
                    console.log("Ethereum object doesn't exist!");
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            Swal.fire({
                position: 'top',
                icon: 'error',
                height: 100,
                title: 'Insufficient tokens',
                showConfirmButton: false,
                timer: 1000
            })
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

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);


    return (
        <div className="reward-component">
            <div className="top">
                <img src={gift} alt="gift" />
                <div className="txt">
                    <h2>Rewards</h2>
                    <p id="slogan">Type faster, earn more!</p>
                </div>
            </div>

            <div className="statistics">
                <div className="state">
                    <p className="stat-p">WPM</p>
                    <div className="stat-reward" id="wpm">{wpm}</div>
                </div>
                <div className="state">
                    <p className="stat-p">Synced on-chain</p>
                    <div className="stat-reward" id="chain">{onChain}</div>
                </div>
                <div className="state">
                    <p className="stat-p">Pending</p>
                    <div className="stat-reward" id="pending">{pending}</div>

                </div>
                <div className="send-button">
                    <button id="send" onClick={handleTransaction}><img src={send} alt="send" style={{ "marginTop": "0.5vh" }} /></button>
                </div>
            </div>


        </div>

    );
}

export default Rewards;