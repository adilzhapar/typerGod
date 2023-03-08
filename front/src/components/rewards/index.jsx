import React, { useEffect, useState } from "react";
import gift from '../../img/gift.svg';
import send from '../../img/send.svg';
import Swal from 'sweetalert2'

import './index.css';
import { useSelector, useDispatch } from 'react-redux';
import { setPending } from '../../features/pendingSlice';

import abi from "../../utils/TyperGod.json";
import nftAbi from "../../utils/tgNFT.json";
import { ethers } from "ethers";
import axios from "axios";
import nft1 from '../../img/NFTs/1.png';
import nft2 from '../../img/NFTs/2.png';
import nft3 from '../../img/NFTs/3.png';
import nft4 from '../../img/NFTs/4.png';
import nft5 from '../../img/NFTs/5.png';
import nft6 from '../../img/NFTs/6.png';
import nft7 from '../../img/NFTs/7.png';


const BASE_URL = "https://typer-god.herokuapp.com";
// const BASE_URL = "http://localhost:8080";


const nftCards = [
    {
        "name": "Malevich #1",
        "link": "https://gateway.pinata.cloud/ipfs/QmSZi3z2WYkTJn2xdW6Sq1nrtGBbBSM34pQ15MfRLVWm9k",
        "price": 100,
        "img": nft1
    },
    {
        "name": "Aivazovsky #1",
        "link": "https://gateway.pinata.cloud/ipfs/Qmaji6eFq5NFu5cWiBYjKcKcSSg4Aq6fkFkUEquBLRbaDD",
        "price": 200,
        "img": nft2
    },
    {
        "name": "van Gogh #1",
        "link": "https://gateway.pinata.cloud/ipfs/QmeQiuqXQr9PXp7fi2bJYbzusmagGctEdy7kWPmJ61UnS7",
        "price": 400,
        "img": nft3
    },
    {
        "name": "Aivazovsky #2",
        "link": "https://gateway.pinata.cloud/ipfs/QmZ6SUAiUGShZwNRngd8fGhiVKfefGrv9NAnPFyXHDuwLV",
        "price": 800,
        "img": nft4
    },
    {
        "name": "Da Vinci #1",
        "link": "https://gateway.pinata.cloud/ipfs/QmT7ut7J551cF5jAWwmVQG1kthVDsTzMo1mJ8WydtLP7LF",
        "price": 1500,
        "img": nft5
    },
    {
        "name": "van Gogh #2",
        "link": "https://gateway.pinata.cloud/ipfs/QmdBh2K7FmPafX5uCLMr9fEFqn2WcrNBzKM6DmCLDrbEvY",
        "price": 3000,
        "img": nft6
    },
    {
        "name": "Michelangelo #1",
        "link": "https://gateway.pinata.cloud/ipfs/QmahkL8o1xDCrh84QrudYy9hCxiuipSFeTPVQAE46pH52v",
        "price": 5000,
        "img": nft7
    }
]

const nftContractAddress = "0xC0059Fea730EefD82679062E42d11bb82F688060";

const Rewards = () => {
    const wpm = useSelector((state) => state.wpm.value);
    const pending = useSelector((state) => state.pending.value);
    const [onChain, setOnChain] = useState(0);
    const dispatch = useDispatch();
    const currentAccount = useSelector((state) => state.currentAccount.value);
    const [nftItems, setNftItems] = useState(nftCards);
    const [ownedNFT, setOwnedNFT] = useState(null);

    const contractAddress = "0xd3F1319F7b50a8ea22A36F7A2625d44310aeebf5";

    const contractABI = abi.abi;
    const nftABI = nftAbi.abi;

    const checkIfWalletIsConnected = async () => {
        try {
            const { ethereum } = window;
            handleOnChain();

            if (!ethereum) {
                console.log("Make sure you have metamask!");
                return;
            } else {
                console.log("We have the ethereum object in Rewards", ethereum);
            }

            const accounts = await ethereum.request({ method: "eth_accounts" });

            if (accounts.length !== 0) {
                const account = accounts[0];
                console.log("Found an authorized account:", account);
                
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const connectedContract = new ethers.Contract(nftContractAddress, nftABI, signer);
                
                let owned = await connectedContract.getTotalMintedNFTUrls();
                console.log("Owned nft-s ", owned);
                
                setOwnedNFT(owned);
                handleOnChain();
            } else {
                console.log("No authorized account found");
                setOwnedNFT(null);
            }

        } catch (error) {
            console.log(error);
        }
    };

    const handleMinting = async ({ link, price }) => {
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const connectedContract = new ethers.Contract(nftContractAddress, nftABI, signer);

                const signerTG = provider.getSigner();
                const typerGodContract = new ethers.Contract(contractAddress, contractABI, signerTG);

                console.log("Going to pop wallet now to pay gas...")
                let nftTxn = await connectedContract.makeAnEpicNFT(link);
                // let minted = await connectedContract.getTotalNFTsMintedSoFar();

                console.log("Mining...please wait.")
                Swal.fire({
                    position: 'top',
                    icon: 'success',
                    height: 100,
                    title: 'Transaction approved! You will see your NFT in Opensea soon',
                    footer: `<a class="footer-a" target="_blank" href="https://testnets.opensea.io/${currentAccount}">Go to OpenSea</a>`
                })
                await nftTxn.wait();
                console.log(nftTxn);

                
                await typerGodContract.substractTokens(price);
                // await waveTxn.wait();
                handleOnChain();
                console.log(`Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`);
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleTransaction = async () => {
        if (pending > 0) {
            try {
                const { ethereum } = window;


                if (ethereum) {
                    const provider = new ethers.providers.Web3Provider(ethereum);
                    const signer = provider.getSigner();
                    const typerGodContract = new ethers.Contract(contractAddress, contractABI, signer);

                    const waveTxn = await typerGodContract.sendTokens(pending, { gasLimit: 300000 });
                    console.log("Mining...", waveTxn.hash);
                    Swal.fire({
                        position: 'top',
                        icon: 'success',
                        height: 100,
                        title: 'Transaction will be synced soon',
                        showConfirmButton: false,
                        timer: 3000
                    })

                    await waveTxn.wait().then(() => Swal.fire({
                        position: 'top',
                        icon: 'success',
                        height: 100,
                        title: 'Transaction have synced',
                        showConfirmButton: false,
                        timer: 3000
                    }));
                    console.log("Mined -- ", waveTxn.hash);
                    handleOnChain();

                    let WpmSum, attempts, highscore, img;


                    const newData = await axios.get(`${BASE_URL}/users/${currentAccount}`);
                    WpmSum = newData.data[0].WpmSum;
                    attempts = newData.data[0].attempts;
                    highscore = newData.data[0].highscore;
                    img = newData.data[0].img;
                    await axios.put(`${BASE_URL}/users/${currentAccount}`,
                        {
                            WpmSum,
                            attempts,
                            highscore,
                            "pending": 0,
                            img,
                        });


                    dispatch(setPending(0));

                } else {
                    console.log("Ethereum object doesn't exist!");
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            Swal.fire({
                position: 'top',
                icon: 'error',
                height: 100,
                title: 'Insufficient tokens',
                showConfirmButton: false,
                timer: 1000
            })
        }
    }

    const handleOnChain = async () => {
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const typerGodContract = new ethers.Contract(contractAddress, contractABI, signer);

                const tokens = await typerGodContract.getTokens();
                // console.log(tokens);
                setOnChain(parseInt(String(tokens)));
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
        // handleOnChain();
    }, []);

    useEffect(() => {
        handleOnChain();
    }, [onChain])

    


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
                    <div className="stat-reward" id="wpm">{wpm}</div>
                </div>
                <div className="state">
                    <p className="stat-p">Synced on-chain</p>
                    <div className="stat-reward" id="chain">{onChain}</div>
                </div>
                <div className="state">
                    <p className="stat-p">Pending</p>
                    <div className="stat-reward" id="pending">{pending}</div>

                </div>
                <div className="send-button">
                    <button id="send" onClick={handleTransaction}><img src={send} alt="send" style={{ "marginTop": "0.5vh" }} /></button>
                </div>
            </div>

            <div className="opensea-link">
                <a id="opensea-a" target="_blank" href={`https://testnets.opensea.io/${currentAccount}`}>Go to OpenSea</a>
            </div>

            <div className="rewards-nft">
                {nftItems.map((item, index) => (
                    <div className="rewards-nft-object" key={index}>
                        <div
                            className="rewards-nft-object-div1"
                            style={{ backgroundImage: `url(${item.img})` }}>
                            <h2>{item.name}</h2>
                            <p className="rewards-nft-object-div1-p">{item.price} on-chain tokens required</p>
                        </div>

                        {ownedNFT?.includes(item.link)
                                ? (
                                    <div className="rewards-nft-object-div2">
                                        <button className="rewards-nft-object-btn3">Already owned</button>
                                    </div>
                                )
                                :
                                item.price <= onChain
                                    ? (
                                        <div className="rewards-nft-object-div2">
                                            <button onClick={() => handleMinting(item)} className="rewards-nft-object-btn">Mint NFT</button>
                                        </div>
                                    )
                                    : (
                                        <div className="rewards-nft-object-div2">
                                            <button className="rewards-nft-object-btn2">Insufficient TGT tokens</button>
                                        </div>
                                    )
                        }

                    </div>
                ))}
            </div>


        </div>

    );
}

export default Rewards;