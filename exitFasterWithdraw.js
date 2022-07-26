require("dotenv").config();
const { POSClient, use, setProofApi } = require("@maticnetwork/maticjs");
const { Web3ClientPlugin } = require("@maticnetwork/maticjs-ethers");
const { ethers } = require("ethers");

setProofApi("https://apis.matic.network/");
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

  const erc20Token = posClient.erc20(
    "0x499d11e0b6eac7c0593d8fb292dcbbf815fb29ae",
    true
  );

  const result = await erc20Token.withdrawExitFaster(
    "0xc938c6c6ef4ecc20f185b4fe1cc3566296cb74c0faa1257557c14a3c77706c03"
  );

  const txHash = await result.getTransactionHash();
  console.log("txHash", txHash);

  const receipt = await result.getReceipt();
  console.log("exit faster receipt", receipt);
}

console.log(test());
