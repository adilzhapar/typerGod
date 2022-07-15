const main = async () => {
    const typerGodContractFactory = await hre.ethers.getContractFactory("TyperGod");
    const typerGodContract = await typerGodContractFactory.deploy({
        value: hre.ethers.utils.parseEther("1"),
    });
    await typerGodContract.deployed();
    console.log("Contract deployed to:", typerGodContract.address);

    let contractBalance = await hre.ethers.provider.getBalance(
        typerGodContract.address
    );
    console.log(
        "Contract balance:",
        hre.ethers.utils.formatEther(contractBalance)
    );

    const typerFlow = await typerGodContract.sendTokens(20);
    await typerFlow.wait();

    const typerFlow2 = await typerGodContract.substractTokens(7);
    await typerFlow2.wait();

    let tokens = await typerGodContract.getTokens();
    console.log("This address has tokens: ", tokens);

    let allUsers = await typerGodContract.getLeadersByCoins();
    console.log(allUsers);

};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();