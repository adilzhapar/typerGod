const main = async () => {
    const typerGodContractFactory = await hre.ethers.getContractFactory("TyperGod");
    const typerGodContract = await typerGodContractFactory.deploy();
    await typerGodContract.deployed();
    console.log("Contract deployed to:", typerGodContract.address);
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