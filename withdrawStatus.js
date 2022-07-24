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

    const erc20Token = posClient.erc20(
      "0x499d11e0b6eac7c0593d8fb292dcbbf815fb29ae",
      true
    );
    const isExited = await erc20Token.isWithdrawExited(
      "0xc161732e9b212eaf7db9206f2eb52c3d3a0c452b1ca4a031f48745ddff0f264d"
      //"0xa92eeeffbdec472964827341053b940c1d2b5d23275042bab68267f9e40d4315"
    );

    // 0xa92eeeffbdec472964827341053b940c1d2b5d23275042bab68267f9e40d4315

    console.log("is exited result", isExited);
  } catch (err) {
    console.log(err.message);
  }
}

console.log(test());
