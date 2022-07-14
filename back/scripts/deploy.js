const main = async () => {
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = await deployer.getBalance();

    console.log("Deploying contracts with account: ", deployer.address);
    console.log("Account balance: ", accountBalance.toString());

    const typerGodContractFactory = await hre.ethers.getContractFactory("TyperGod");
    const typerGodContract = await typerGodContractFactory.deploy();
    await typerGodContract.deployed();

    console.log("typerGod address: ", typerGodContract.address);
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