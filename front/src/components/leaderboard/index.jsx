import React from "react";
import './index.css';
import top1 from '../../img/top1.svg';
import Aidar from '../../img/Aidar_0.png';


const Leaderboard = () => {
    
    return (
        <div className="leaderboard-component">
            <div className="top">
                <img src={top1} alt="top1" />
                <div className="txt">
                    <h2>Leaderboard</h2>
                    <p id="slogan"> TOP-10 participants</p>
                </div>
            </div>
            <img src={Aidar} alt="Aidar" style={{"width": "50vw", "marginLeft": "20px"}}/>
        </div>
    );
}

export default Leaderboard;