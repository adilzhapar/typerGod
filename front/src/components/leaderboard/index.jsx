import React from "react";
import "./index.css";
import top1 from "../../img/top1.svg";
import { useState, useEffect } from "react";
import abi from "../../utils/TyperGod.json";
import { ethers } from "ethers";
import {useSelector} from 'react-redux';
import axios from 'axios';

const BASE_URL = "https://typer-god.herokuapp.com";
// const BASE_URL = "http://localhost:8080";

const Leaderboard = () => {
    const currentAccount = useSelector((state) => state.currentAccount.value);
    // const dispatch = useDispatch();
    const [leaders, setLeaders] = useState([]);
    const [highscoreLeaders, setHighscoreLeaders] = useState([]);
    const [type, setType] = useState("highscore");
    const contractAddress = "0xd3F1319F7b50a8ea22A36F7A2625d44310aeebf5";

    const contractABI = abi.abi;

    useEffect(() => {
        if(currentAccount){
            getAllLeaders();
        }
        getHighscoreLeaders();

    }, [type])

    const handleFilterType = (type) => {
        setType(type);
    }

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
                console.log("chain leads: ", leadsCleaned);
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getHighscoreLeaders = () => {
        axios.get(`${BASE_URL}/highscore`).then((response) => {
            setHighscoreLeaders(response.data);
            console.log("response data: ", response.data);
        });
    }
    
    return (
        <div className="leaderboard-component">
            <div className="top">
                {/* <img src="pic1" alt="pic0" /> */}
                <img src={top1} alt="top1" />
                <div className="txt">
                    <h2>Leaderboard</h2>
                    <p id="slogan"> TOP-10 participants</p>
                </div>
            </div>

            <div className="filters">
                <button className="lead-button" onClick={() => handleFilterType("highscore")}>Highscore</button>
                <button className="lead-button" onClick={() => handleFilterType("chain")}>On-Chain</button>
            </div>

            <div className="users">
                {type === "chain" && leaders.map((lead, index) => (
                    <div key={index}>
                        <p>{lead.user}</p>
                        <p>{lead.tokens} TGT</p>
                    </div>
                ))}
                <ol>
                    {type === "highscore" && highscoreLeaders.map((lead, index = 0) => (
                            <div className="users-li" key={index}>
                                <div className="index">
                                    {index + 1}.
                                </div>
                                <img className="avatar" src={lead.img} alt="img" />
                                <p className="users-li-p">{lead._id}</p>
                                <div className="users-li-record">
                                    <p>{lead.highscore} WPM</p>
                                </div>
                            </div>
                    ))}
                </ol>
            </div>
        </div>
    );
};

export default Leaderboard;
