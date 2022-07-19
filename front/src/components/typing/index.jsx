import React from "react";
import { useState, useEffect, useRef } from 'react';
import input from './input.txt';
import './index.css';
import sendSvg from '../../img/send.svg';
import stopwatchSvg from '../../img/stopwatch.svg';

import { useSelector, useDispatch } from 'react-redux';
import { setWpm } from '../../features/wpmSlice';
import { addPoint } from '../../features/pendingSlice';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080'

const Typing = () => {
    const inputReference = useRef(null);
    const wpm = useSelector((state) => state.wpm.value);
    const dispatch = useDispatch();

    const [inputWord, setInputWord] = useState("");
    const [words, setWords] = useState();
    const [counter, setCounter] = useState(0); // count how many words are typed
    const [timeAmount, setTimeAmount] = useState(60); // time will decrease
    const [time, setTime] = useState(60);


    const [isActive, setIsActive] = useState(true);
    const [accuracy, setAccuracy] = useState();
    const [step, setStep] = useState(30);
    const [readyWords, setReadyWords] = useState();
    const [running, setRunning] = useState(false);
    const [points, setPoints] = useState(0);
    const [net, setNet] = useState(0);

    const currentAccount = useSelector((state) => state.currentAccount.value);


    const setDefault = () => {
        setInputWord("");
        setCounter(0);
        setTime(timeAmount);
        setIsActive(true);
        setStep(30);
        setRunning(false);
    }


    const handleInputWord = (event) => {
        setInputWord(event.target.value);
        if (isActive) {
            setRunning(true);
        }
        if (words[counter].name.indexOf(inputWord.trim()) !== 0) {
            words[counter].class = "red";
        } else {
            words[counter].class = "default";
        }

    }

    const handleSpace = (event) => {
        if (event.keyCode === 32) {
            if (inputWord.trim() !== "") {
                if (inputWord.trim() === words[counter].name) {
                    words[counter].class = "green";
                } else {
                    words[counter].class = "red";
                }
                setInputWord("");
                setCounter(counter + 1);
            } else {
                setInputWord("");
            }

        }
    }

    const handleEnter = (event) => {
        if (event.keyCode === 13) {
            handleTextRefresh();

            inputReference.current.focus();
        }
    }

    const handleTextRefresh = () => {
        fetch(input)
            .then(function (res) {
                return res.text();
            }).then(function (content) {


                const arr = content.split(/\r?\n/);

                const shuffledArr = arr.sort((a, b) => 0.5 - Math.random());

                let obj = [];

                for (let i = 0; i < 200; i++) {
                    obj.push({
                        id: i,
                        name: shuffledArr[i],
                        class: ""
                    });
                }

                setDefault();
                setWords(obj);
                setReadyWords(obj.filter((word) => word.id <= step));


            })
    }


    const [swp, setSwp] = useState(0);

    const handleSetTimer = () => {
        const times = [30, 15, 60];
        // console.log(x);
        // setTimer({ count: parseInt(x), time: parseInt(x)});

        setSwp((swp + 1) % 3);
        // console.log(`SWP: ${swp}`);
        // console.log(times[swp % 3]);
        setTime(times[swp % 3]);
        setTimeAmount(times[swp % 3]);
    }

    useEffect(() => {
        handleTextRefresh();
        if (currentAccount) {
            inputReference.current.focus();
        }

    }, [timeAmount]);

    if (time <= 0) {

        let cnt = words.filter((word) => word.class === "green" && word.id <= counter);
        let mistakes = words.filter((word) => word.class === "red" && word.id <= counter).length;
        let gross = 0;
        let totalChars = 0;
        for (let i = 0; i < counter; i++) {
            totalChars += words[i].name.length;
        }

        for (let i = 0; i < cnt.length; i++) {
            gross += cnt[i].name.length;
        }
        let acrcy = gross / totalChars * 100;

        gross = parseInt(gross / 5 * (60 / timeAmount));
        // console.log("Gross: ", gross);
        let netWpm = gross - mistakes * (60 / timeAmount);
        // console.log("Net: ", netWpm);
        setNet(netWpm);



        setPoints(parseInt(netWpm / 10));
        
        dispatch(addPoint(parseInt(netWpm / 10)));
        
        let WpmSum, attempts, pending, highscore;
        axios.get(`${BASE_URL}/users/${currentAccount}`).then((response) => {
            WpmSum = response.data[0].WpmSum + netWpm;
            attempts = response.data[0].attempts + 1;
            pending = response.data[0].pending + parseInt(netWpm / 10);
            highscore = response.data[0].highscore;
            
            if (netWpm > highscore) {
                highscore = netWpm;
            }
            
            
            dispatch(setWpm(parseInt(WpmSum / attempts)));
    
            // console.log(Wpm);
            // console.log(Attempts);
            // console.log(Pending);
            // console.log(Highscore);
            axios.put(`${BASE_URL}/users/${currentAccount}`,
            {
                WpmSum,
                attempts,
                highscore,
                pending
            })
            .then((response) => {
                console.log(response);
            })
        });

        


    if (acrcy === 100 || acrcy === 0) {
        setAccuracy(acrcy);
    } else {
        setAccuracy(acrcy.toPrecision(2));
    }
    setTime(timeAmount);
    setIsActive(false);
    setRunning(false);
}



if (counter > step) {
    setReadyWords(words.filter((word) => word.id > step && word.id <= step + 30))
    setStep(step + 30);
}


useEffect(() => {
    let interval;
    if (running) {
        interval = setInterval(() => {

            setTime((prevTime) => prevTime - 1);
        }, 1000);
    } else if (!running) {
        clearInterval(interval);
    }
    return () => clearInterval(interval);
}, [running]);


return (
    <div className="page">
        {currentAccount && (
            <>
                <p>{time}</p>

                <div className={isActive ? "text" : "not-text"}>
                    {readyWords?.map((word) => (
                        <p key={word.id} className={word.class}>{word.name}</p>
                    ))}
                </div>
                <div className="input-word">
                    <input type="text" value={inputWord} ref={inputReference} onChange={handleInputWord} onKeyDown={handleSpace} />
                    <button
                        className="inp-bar-elem"
                        onClick={handleTextRefresh}
                        onKeyDown={handleEnter}>
                        <img src={sendSvg} alt="reload" />
                    </button>

                    <button
                        className="inp-bar-elem"
                        onClick={handleSetTimer}
                    >
                        <img src={stopwatchSvg} alt="time" />
                    </button>

                </div>

                <p>WPM: {net}</p>
                <p>Accuracy: {accuracy}%</p>
                <p>You have earned: {points}</p>
            </>
        )}
        {!currentAccount && (
            <h2>Please, connect the wallet</h2>
        )}
    </div>
);
}

export default Typing;