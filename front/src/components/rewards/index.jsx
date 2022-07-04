import React from "react";
import gift from '../../img/gift.svg';
import send from '../../img/send.svg';
import './index.css';
import { useSelector, useDispatch } from 'react-redux';


const Rewards = () => {
    const wpm = useSelector((state) => state.wpm.value);
    // const count = useSelector((state) => state.counter.value);
    // const dispatch = useDispatch();

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
                    <span id="chain">0</span>
                </div>
                <div className="state">
                    <p className="stat-p">Pending</p>
                    <span id="pending">0</span>
                
                </div>
                <button id="send"><img src={send} alt="send" style={{"marginTop": "0.5vh"}}/></button>
            </div>

        </div>

    );
}

export default Rewards;