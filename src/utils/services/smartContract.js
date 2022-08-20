import { ethers } from "ethers";
import { availableNetworks } from "../config/availableNetworks";
import { depositManager } from "../contract_abi/depositManager";
import { billingManager } from "../contract_abi/billing";
import { erc20ABI } from "../contract_abi/erc20Abi";
import { notify } from "./notification";
import {
  changeWeb3AuthChain,
  currentWeb3AuthChain,
  web3auth,
} from "./web3auth";

export const getCoinInfo = (coinName) => {
  let currentChain = currentWeb3AuthChain;
  if (availableNetworks[currentChain + ""]) {
    let chainInfo = availableNetworks[currentChain + ""];
    let coins = chainInfo?.["stableCoins"];
    let coinInfo = coins.filter((coin) => coin.name === coinName);
    return coinInfo.length > 0 ? coinInfo[0] : null;
  } else {
    notify("Please Select Supported Chain", "error");
    changeWeb3AuthChain("ethereum");
    return null;
  }
};

export const getCoinBalance = async (coinName) => {
  let balance = 0;
  try {
    const coinInfo = getCoinInfo(coinName);
    const ERC20ABI = erc20ABI;
    const provider = new ethers.providers.Web3Provider(web3auth.provider);
    const signer = provider.getSigner();
    const coinContract = new ethers.Contract(
      coinInfo?.contractAddress,
      ERC20ABI,
      signer
    );
    const address = await signer.getAddress();
    balance = (await coinContract.balanceOf(address)).toString();
  } catch (error) {
    notify(error, "error");
  }
  return balance;
};

export const depositCoin = async (coinName, depositAddress, purchaseAmount) => {
  console.log(coinName, purchaseAmount);
  try {
    const coinInfo = getCoinInfo(coinName);
    const ERC20ABI = erc20ABI;
    const provider = new ethers.providers.Web3Provider(web3auth.provider);
    const signer = provider.getSigner();
    const coinContract = new ethers.Contract(
      coinInfo?.contractAddress,
      ERC20ABI,
      signer
    );
    const depositContract = new ethers.Contract(
      depositManager["contractAddress"],
      depositManager["abi"],
      signer
    );
    let refinedAmount = 10 ** (await coinContract.decimals()) * purchaseAmount;
    refinedAmount = refinedAmount + "";
    console.log(refinedAmount);
    const approvalData = await coinContract.approve(
      depositContract.address,
      refinedAmount
    );
    approvalData.wait();
    console.log(approvalData);

    const transactionData = await depositContract.addDeposit(
      coinContract.address,
      refinedAmount,
      {
        gasLimit: 500000,
      }
    );
    console.log(transactionData);
  } catch (error) {
    console.log(error);
    notify(error["message"] ? error["message"] : error, "error");
  }
};

export const checkSubscriptionActive = async () => {
  let subscriptionStatus = false;
  try {
    const provider = new ethers.providers.Web3Provider(web3auth.provider);
    const signer = provider.getSigner();
    const billingContract = new ethers.Contract(
      billingManager["contractAddress"],
      billingManager["abi"],
      signer
    );
    const address = await signer.getAddress();
    subscriptionStatus = await billingContract.isSubscriptionActive(address);
    subscriptionStatus = await subscriptionStatus.wait();
  } catch (error) {
    notify(error, "error");
  }

  return subscriptionStatus;
};

export const activateBillingSubscription = async (coinName, purchaseAmount) => {
  try {
    const coinInfo = getCoinInfo(coinName);
    const ERC20ABI = erc20ABI;
    const provider = new ethers.providers.Web3Provider(web3auth.provider);
    const signer = provider.getSigner();
    const coinContract = new ethers.Contract(
      coinInfo?.contractAddress,
      ERC20ABI,
      signer
    );
    const billingContract = new ethers.Contract(
      billingManager["contractAddress"],
      billingManager["abi"],
      signer
    );
    let refinedAmount = 10 ** (await coinContract.decimals()) * purchaseAmount;
    refinedAmount = refinedAmount + "";

    const approvalData = await coinContract.approve(
      billingContract.address,
      refinedAmount
    );
    approvalData.wait();
    console.log(approvalData);

    const billingData = await billingContract.activateSubscription(
      0,
      coinContract.address
    );
    console.log(billingData);
  } catch (error) {
    console.log(error);
    notify(error["message"] ? error["message"] : error, "error");
  }
};
