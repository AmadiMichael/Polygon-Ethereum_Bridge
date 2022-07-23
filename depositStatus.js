const { POSClient, use } = require("@maticnetwork/maticjs");
const { Web3ClientPlugin } = require("@maticnetwork/maticjs-ethers");
const { ethers } = require("ethers");

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
        provider: new ethers.Wallet("process.env.PRIVATEKEY", parentProvider),
        defaultConfig: {
          from: process.env.WALLETADDRESS,
        },
      },
      child: {
        provider: new ethers.Wallet("process.env.PRIVATEKEY", childProvider),
        defaultConfig: {
          from: process.env.WALLETADDRESS,
        },
      },
    });

    const isDeposited = await posClient.isDeposited(
      "0xc6720b0fe99fc0bea4408678c520aa871cdd2bacebb2bbf737925134748c4bf5"
    );
    console.log("isDeposited", isDeposited);
  } catch (err) {
    console.log(err.message);
  }
}

console.log(test());
