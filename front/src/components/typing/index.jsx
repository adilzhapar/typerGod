import React from "react";
import { useState, useEffect, useRef } from 'react';
import input from './input.txt';
import './index.css';

import keyboardSvg from '../../img/keyboard.svg';
import restartSvg from '../../img/restart.svg';

import { useSelector, useDispatch } from 'react-redux';
import { setWpm } from '../../features/wpmSlice';
import { addPoint } from '../../features/pendingSlice';
import axios from 'axios';


const BASE_URL = "https://typer-god.herokuapp.com";
// const BASE_URL = "http://localhost:8080";

const times = [
    {
        "amount": 15,
        "class": "not-chosen"
    },
    {
        "amount": 30,
        "class": "chosen"
    },
    {
        "amount": 60,
        "class": "not-chosen"
    }
]

const faq = [
    {
        "question": "Why should I?",
        "answer": "It's not for spending, just for earning, so chill. Although, it is an authentication method in web3.",
        "show" : false
    },
    {
        "question": "How could I?",
        "answer": "Install 'Metamask' extension, create wallet, choose 'Rinkeby Testnet Network' and you are free to go.",
        "show" : false
    },
    {
        "question": "How to earn?",
        "answer": "Type the text till the time is not over, make it again and again. It is a good way to practice.",
        "show" : false
    },
    {
        "question": "What is WPM?",
        "answer": "Word Per Minute - how many words did you type in a minute.",
        "show" : false
    },
    {
        "question": "What is TGT?",
        "answer": "TyperGod Token - unique token you earn to buy incredible NFT pics.",
        "show" : false
    },
]


const Typing = () => {
    const inputReference = useRef(null);
    const wpm = useSelector((state) => state.wpm.value);
    const dispatch = useDispatch();

    const [inputWord, setInputWord] = useState("");
    const [words, setWords] = useState();
    const [counter, setCounter] = useState(0); // count how many words are typed
    const [timeAmount, setTimeAmount] = useState(1); // time will decrease
    const [time, setTime] = useState(1);


    const [isActive, setIsActive] = useState(true);
    const [accuracy, setAccuracy] = useState();
    const [step, setStep] = useState(30);
    const [readyWords, setReadyWords] = useState();
    const [running, setRunning] = useState(false);
    const [points, setPoints] = useState(0);
    const [net, setNet] = useState(0);
    const [timesState, setTimesState] = useState(times);
    const [faqs, setFaqs] = useState(faq);
    

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



    const handleSetTimer = (current) => {

        setTimesState((prevTimes) =>
            prevTimes.map((tm) => {
                if (tm.amount === current) {
                    // console.log(tm);
                    return { ...tm, class: "chosen" };
                } else {
                    // console.log(tm);
                    return { ...tm, class: "not-chosen" };
                }
            })
        );
        setTimeAmount(current);
        setTime(current);


    }

    const handleFAQ = ({question}) => {
        setFaqs((prevFaqs) => 
            prevFaqs.map((item) => {
                if(item.question === question){
                    return {...item, show: !item.show};
                }else return item;
            })
        )
    }

    console.log("from the function", timesState)

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

        let WpmSum, attempts, pending, highscore, img;
        axios.get(`${BASE_URL}/users/${currentAccount}`).then((response) => {
            WpmSum = response.data[0].WpmSum + netWpm;
            attempts = response.data[0].attempts + 1;
            pending = response.data[0].pending + parseInt(netWpm / 10);
            highscore = response.data[0].highscore;
            img = response.data[0].img;

            if (netWpm > highscore) {
                highscore = netWpm;
            }


            dispatch(setWpm(parseInt(WpmSum / attempts)));

            axios.put(`${BASE_URL}/users/${currentAccount}`,
                {
                    WpmSum,
                    attempts,
                    highscore,
                    pending,
                    img
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
        <div className="typing-all">
            <div className="typing-top">
                <div className="typing-top-left">
                    <img src={keyboardSvg} alt="keyboard" />
                    <div className="txt">
                        <h2>Typing</h2>
                        <p id="typing-slogan">Type faster, earn more!</p>
                    </div>
                </div>
                <div className="typing-top-right">
                    <h3 className="gradient-text typing-top-right-h3">Choose time:</h3>
                    <div className="typing-top-right-button">
                        {
                            timesState?.map((item, index) => (
                                <p
                                    key={index}
                                    className={item.class}
                                    onClick={() => handleSetTimer(item.amount)}
                                >
                                    {item.amount}
                                </p>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className="page">
                {currentAccount && (

                    <>

                        <div className="timer-in-page">
                            {running ? (
                                <h2 className="timer">{time}</h2>
                            ) : <h2 className="not-timer">{time}</h2>
                            }
                        </div>
                        {
                            isActive ?
                                (
                                    <div className="text">
                                        {readyWords?.map((word) => (
                                            <p key={word.id} className={`${word.class} word-p`}>{word.name}</p>
                                        ))}
                                    </div>
                                ) :
                                (   
                                    <div className="text after-text">
                                        <div className="after-text-object">
                                            <div className="after-text-number">{net}</div>
                                            <div className="after-text-name">WPM</div>
                                        </div>
                                        <div className="after-text-object">
                                            <div className="after-text-number">{accuracy} %</div>
                                            <div className="after-text-name">Accuracy</div>

                                        </div>
                                        <div className="after-text-object">
                                            <div className="after-text-number">{points}</div>
                                            <div className="after-text-name">Earned TGT</div>

                                        </div>
                                    </div>
                                )
                        }
                        <div className="input-word">
                            <input type="text" value={inputWord} ref={inputReference} onChange={handleInputWord} onKeyDown={handleSpace} />

                        </div>
                        <div className="inp-bar-elem">
                            <button
                                className="typing-button"
                                onClick={handleTextRefresh}
                                onKeyDown={handleEnter}>
                                <img src={restartSvg} alt="restart" />
                            </button>
                        </div>

                    </>
                )}
                {!currentAccount && (
                    <div className="page-connection">
                        <div className="page-connection-txt">
                            <h2 className="gradient-text">Please, connect the wallet</h2>
                        </div>
                        <div className="page-faq">
                            {
                                faqs.map((faq, index) => (
                                    <div className="page-faq-object" key={index} onClick={() => handleFAQ(faq)}>
                                        <h3 id="question" className="page-faq-object-question">{faq.question}</h3>
                                        <p id="answer" className={`${faq.show ? "show" : "dont-show"} page-faq-object-answer`}>{faq.answer}</p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                )}
            </div>
        </div>

    );
}

export default Typing;