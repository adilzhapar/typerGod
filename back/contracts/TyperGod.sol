// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract TyperGod {
    mapping(address => uint256) public leaders;

    event NewSend(address indexed from, uint256 wpm);

    struct User {
        address user;
        uint256 wpm;
    }

    User[] users;   

    constructor() payable {
        console.log("We've constructed");

    }

}