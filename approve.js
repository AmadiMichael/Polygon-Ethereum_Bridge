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

  // approve method can be used to approve required amount on the root token.
  // approve is required in order to deposit amount on polygon chain.
  const erc20RootToken = posClient.erc20(
    "0x499d11e0b6eac7c0593d8fb292dcbbf815fb29ae",
    true
  );
  //approve 100 amount
  const approveResult = await erc20RootToken.approve(
    JSON.stringify(1 * 1e10)
    //, {
    //spenderAddress: "0x499d11e0b6eac7c0593d8fb292dcbbf815fb29ae",
    //}
  );
  const txHash = await approveResult.getTransactionHash();
  const txReceipt = await approveResult.getReceipt();
  console.log("approve", txReceipt);
}

console.log(test());
