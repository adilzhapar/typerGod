// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract TyperGod {
    mapping(address => uint256) public leadersByTokens;
    

    event NewSend(address indexed from, uint256 tokens);

    struct User {
        address user;
        uint256 tokens;
    } 
    User[] users;

    constructor() payable {
        console.log("We've constructed");

    }

    function getLeadersByCoins() public view returns (User[] memory){
        return users;
    }

    function substractTokens(uint256 _tokens) public {
        leadersByTokens[msg.sender] -= _tokens;

        
        for(uint256 i = 0; i < users.length; i++){
            if(users[i].user == msg.sender){
                users[i].tokens -= _tokens;
                break;
            }
        }
    } 


    function sendTokens(uint256 _tokens) public {
        leadersByTokens[msg.sender] += _tokens;
        
        bool isExist = false;
        for(uint256 i = 0; i < users.length; i++){
            if(users[i].user == msg.sender){
                isExist = true;
                users[i].tokens += _tokens;
                break;
            }
        }
        if(!isExist){
            users.push(User(msg.sender, _tokens));
        }

        emit NewSend(msg.sender, _tokens);
    }


    function getTokens() public view returns (uint256){
        return leadersByTokens[msg.sender];
    }


}