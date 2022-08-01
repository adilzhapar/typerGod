const main = async () => {
    const nftContractFactory = await hre.ethers.getContractFactory('tgNFT');
    const nftContract = await nftContractFactory.deploy();
    await nftContract.deployed();
    console.log("Contract deployed to:", nftContract.address);
  
    // Call the function.
    let txn = await nftContract.makeAnEpicNFT("ipfs://QmPPSM3QW7UvksAAMasecNtj3Ag4uwyoHjcgmF2FScVDo3");
    // Wait for it to be mined.
    await txn.wait()
    let total = await nftContract.getTotalNFTsMintedSoFar();

    let urls = await nftContract.getTotalMintedNFTUrls();
    console.log(urls);
    console.log(total);

  
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