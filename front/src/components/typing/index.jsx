import React from "react";
import {useState, useEffect} from 'react';
import input from './input.txt';
import './index.css';

import { useSelector, useDispatch } from 'react-redux';
import { setWpm } from '../../features/wpmSlice';

const Typing = () => {
    const wpm = useSelector((state) => state.wpm.value);
    const dispatch = useDispatch();

    const [inputWord, setInputWord] = useState(""); 
    const [words, setWords] = useState();
    const [counter, setCounter] = useState(0); // count how many words are typed
    const [timer, setTimer] = useState({count: 60, time: 60}); // count will decrease
    // const [wpm, setWpm] = useState(0); 
    const [isActive, setIsActive] = useState(true);
    const [accuracy, setAccuracy] = useState();
    const [step, setStep] = useState(30);
    const [readyWords, setReadyWords] = useState();
    const [sum, setSum] = useState(0);

    const setDefault = () => {
        setInputWord("");
        setCounter(0);
        const count = timer.time;
        setTimer({...timer, count});
        setIsActive(true);
        setStep(30);
    }


    const handleTimer = () => {
        const id = setTimeout(() => {
            // console.log(`tick id=${id}`, timer);
            const count = timer.count - 1;
            
            setTimer({ ...timer, count });
        }, 1000);
        return () => clearTimeout(id);
    }

    const handleInputWord = (event) => {
        setInputWord(event.target.value);
        // keyboard.current.setInputWord(event.target.value);
        if(isActive) {
            handleTimer();
        }
        // handleTimer();
        if(words[counter].name.indexOf(inputWord.trim()) !== 0){
            words[counter].class = "red";
        }else{
            words[counter].class = "default";
        }
        
    }

    const handleSpace = (event) => {
        if (event.keyCode === 32) {
            if(inputWord.trim() === words[counter].name){
                words[counter].class = "green";
            }else{
                words[counter].class = "red";
            }
            setInputWord("");
            setCounter(counter + 1);
        }
    }

    const handleEnter = (event) => {
        if(event.keyCode === 13){
            handleTextRefresh();
        }
    }

    const handleTextRefresh = () => {
        fetch(input)
            .then(function(res){
                return res.text();
            }).then(function (content) {

                
            const arr = content.split(/\r?\n/);
            
            const shuffledArr = arr.sort((a, b) => 0.5 - Math.random());
            
            let obj = [];

            for(let i = 0; i < 200; i++){
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

    const handleSetTimer = (x) => {
        console.log(x);
        setTimer({ count: parseInt(x), time: parseInt(x)});

    }

    useEffect(() => {
        handleTextRefresh();
        // dispatch(setWpm(sum));
    }, [timer.time]);



    if(timer.count <= 0){
        
        let cnt = words.filter((word) => word.class === "green" && word.id <= counter).length;
        setSum((60 / timer.time) * cnt);
        let acrcy = cnt / counter * 100;
        // setWpm(sum);
        dispatch(setWpm(sum));
        console.log(wpm);
        if(acrcy === 100) {
            setAccuracy(acrcy);
        }else{
            setAccuracy(acrcy.toPrecision(2));
        }
        
        
        const count = timer.time;
        setTimer({...timer, count});
        setIsActive(false);
    }

    if(counter > step){
        setReadyWords(words.filter((word) => word.id > step && word.id <= step + 30))
        setStep(step + 30);
    }

    return (
        <div className="page">
            <p>{timer.count}</p>
            
            <div className={isActive ? "text": "not-text"}>
                {readyWords?.map((word) => (
                    <p key={word.id} className={word.class}>{word.name}</p>
                ))}
            </div>
            <div className="input-word">
                <input type="text" value={inputWord} onChange={handleInputWord} onKeyDown={handleSpace}/>
            </div>
            <button className="refresh-button" onClick={handleTextRefresh} onKeyDown={handleEnter}>Refresh text</button>
            
            <p>WPM: {wpm}</p>
            <p>Accuracy: {accuracy}%</p>
            <select id="wpm-select" 
            onChange={e => {
                    handleSetTimer(e.target.value);
                }}>
                <option value="60">60</option>
                <option value="30">30</option>
                <option value="15">15</option>
            </select>

            
        </div>
    );
}

export default Typing;