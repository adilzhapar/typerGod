import React, { useEffect, useState } from "react";
import gift from '../../img/gift.svg';
import send from '../../img/send.svg';
import './index.css';
import { useSelector, useDispatch } from 'react-redux';
import { setPending } from '../../features/pendingSlice';

import abi from "../../utils/TyperGod.json";
import { ethers } from "ethers";



// const items = JSON.parse(localStorage.getItem('pending')) || 0;

const Rewards = () => {
    const wpm = useSelector((state) => state.wpm.value);
    const pending = useSelector((state) => state.pending.value);
    const [onChain, setOnChain] = useState(0);
    const dispatch = useDispatch();
    // dispatch(setPending(Number(items)));
    // const count = useSelector((state) => state.counter.value);

    // localStorage.setItem('pending', JSON.stringify(pending));
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

                    await waveTxn.wait();
                    console.log("Mined -- ", waveTxn.hash);
                    handleOnChain();
                    dispatch(setPending(0));

                } else {
                    console.log("Ethereum object doesn't exist!");
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            alert("U have no tokens to send");
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
                    <span id="wpm">{wpm}</span>
                </div>
                <div className="state">
                    <p className="stat-p">Synced on-chain</p>
                    <span id="chain">{onChain}</span>
                </div>
                <div className="state">
                    <p className="stat-p">Pending</p>
                    <span id="pending">{pending}</span>

                </div>
                <button id="send" onClick={handleTransaction}><img src={send} alt="send" style={{ "marginTop": "0.5vh" }} /></button>
            </div>

        </div>

    );
}

export default Rewards;