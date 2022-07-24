const { POSClient, use } = require("@maticnetwork/maticjs");
const { Web3ClientPlugin } = require("@maticnetwork/maticjs-ethers");
const { ethers } = require("ethers");
const axios = require("axios");
require("dotenv").config();

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

  let response = await axios("https://gasstation-mainnet.matic.network/v2");
  let json = await response;

  console.log(json);

  const erc20Token = posClient.erc20(
    "0x6FF0C4Ea2E3E33C7dB7cF4cEc263D727fd50461D"
  );

  const result = await erc20Token.withdrawStart(JSON.stringify(1 * 1e14), {
    maxFeePerGas: ethers.utils.parseUnits(
      `${Math.ceil(json.data.fast.maxFee)}`,
      "gwei"
    ),
    maxPriorityFeePerGas: ethers.utils.parseUnits(
      `${Math.ceil(json.data.fast.maxPriorityFee)}`,
      "gwei"
    ),
  });

  const txHash = await result.getTransactionHash();
  console.log("txHash", txHash);
  const receipt = await result.getReceipt();
  console.log("receipt", receipt);
}

console.log(test());
