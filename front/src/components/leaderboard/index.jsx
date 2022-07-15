import React from "react";
import "./index.css";
import top1 from "../../img/top1.svg";
import { useState, useEffect } from "react";
import abi from "../../utils/TyperGod.json";
import { ethers } from "ethers";

const Leaderboard = () => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [leaders, setLeaders] = useState([]);
    const contractAddress = "0xd3F1319F7b50a8ea22A36F7A2625d44310aeebf5";

    const contractABI = abi.abi;

    const checkIfWalletIsConnected = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                console.log("Make sure you have metamask!");
                return;
            } else {
                console.log("We have the ethereum object in Leaderboard", ethereum);
            }

            const accounts = await ethereum.request({ method: "eth_accounts" });

            if (accounts.length !== 0) {
                const account = accounts[0];
                console.log("Found an authorized account:", account);
                setCurrentAccount(account);
                getAllLeaders();
            } else {
                console.log("No authorized account found");
            }

        } catch (error) {
            console.log(error);
        }
    };

    const getAllLeaders = async () => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const typerGodContract = new ethers.Contract(
                    contractAddress,
                    contractABI,
                    signer
                );

                const leads = await typerGodContract.getLeadersByCoins();

                
                let leadsCleaned = [];
                leads.forEach((lead) => {
                    leadsCleaned.push({
                        user: lead.user,
                        tokens: parseInt(String(lead.tokens)),
                    });
                });
                setLeaders(leadsCleaned);
                console.log(leadsCleaned);
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return (
        <div className="leaderboard-component">
            <div className="top">
                <img src={top1} alt="top1" />
                <div className="txt">
                    <h2>Leaderboard</h2>
                    <p id="slogan"> TOP-10 participants</p>
                </div>
            </div>
            {leaders.map((lead, index) => (
                <div key={index}>
                    <p>{lead.user}</p>
                    <p>{lead.tokens}</p>
                </div>
            ))}
        </div>
    );
};

export default Leaderboard;
