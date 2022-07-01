import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { decrement } from '../../features/counterSlice';

const Leaderboard = () => {
    const count = useSelector((state) => state.counter.value);
    const dispatch = useDispatch();
    
    return (
        <>
            <h1>Leaderboard</h1>
            <div>
                <span>{count}</span>
                <button
                aria-label="Decrement value"
                onClick={() => dispatch(decrement())}
                >
                Decrement
                </button>
            </div>
        </>

    );
}

export default Leaderboard;