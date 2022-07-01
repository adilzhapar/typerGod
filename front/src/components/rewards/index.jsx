import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { increment } from '../../features/counterSlice';


const Rewards = () => {
    const count = useSelector((state) => state.counter.value);
    const dispatch = useDispatch();

    return (
        <>
            <h1>Rewards</h1>
            <div>
                <button
                aria-label="Increment value"
                onClick={() => dispatch(increment())}
                >
                Increment
                </button>
                <span>{count}</span>
                
            </div>
        </>

    );
}

export default Rewards;