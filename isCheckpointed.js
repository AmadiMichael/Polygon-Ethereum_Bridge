const { POSClient, use } = require("@maticnetwork/maticjs");
const { Web3ClientPlugin } = require("@maticnetwork/maticjs-ethers");
const { ethers } = require("ethers");
require("dotenv").config();

// install web3 plugin
use(Web3ClientPlugin);
const posClient = new POSClient();
const parentProvider = ethers.getDefaultProvider("goerli");
const childProvider = ethers.getDefaultProvider(
  "https://polygon-mumbai.g.alchemy.com/v2/TJsEglmEGSk-nRdXeA6ZGCVwRPvsplWR"
);

async function test() {
  try {
    await posClient.init({
      network: "testnet", // 'testnet' or 'mainnet'
      version: "mumbai", // 'mumbai' or 'v1'
      parent: {
        provider: new ethers.Wallet(process.env.PRIVATEKEY, parentProvider),
        defaultConfig: {
          from: process.env.WALLETADDRESS,
        },
      },
      child: {
        provider: new ethers.Wallet(process.env.PRIVATEKEY, childProvider),
        defaultConfig: {
          from: process.env.WALLETADDRESS,
        },
      },
    });

    const isCheckPointed = await posClient.isCheckPointed(
      "0x2e57509afd8a0913ede9e0fdf58b050ca29363b03bfcfc1e799a65a6a6a35884"
    );

    console.log("isCheckpointed", isCheckPointed);
  } catch (err) {
    console.log(err.message);
  }
}

console.log(test());
