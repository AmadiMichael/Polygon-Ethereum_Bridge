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

  const result = await posClient.depositEther(
    JSON.stringify(1 * 1e16),
    process.env.WALLETADDRESS
  );

  const txHash = await result.getTransactionHash();
  console.log("txHash", txHash);
  const receipt = await result.getReceipt();
  console.log("receipt", receipt);
}

console.log(test());
