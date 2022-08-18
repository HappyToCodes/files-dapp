import { ethers } from "ethers";
import {
  tokenCost,
  receiverAddress,
  contractAddress,
} from "../config/tokenTransferData";
import { usdtABI } from "../contract_abi/usdcABi";
import { erc20ABI } from "../contract_abi/erc20Abi";
import { notify } from "./notification";
import { currentWeb3AuthChain, web3auth } from "./web3auth";

export async function SendTransaction() {
  const send_abi = usdtABI;
  const provider = new ethers.providers.Web3Provider(web3auth.provider);
  const signer = provider.getSigner();
  let chainInfo = await getContractInfo();
  const contract = new ethers.Contract(
    chainInfo["contractAddress"],
    send_abi,
    signer
  );

  const numberOfTokens = ethers.utils.parseUnits(
    tokenCost,
    chainInfo["decimal"]
  );

  console.log(numberOfTokens, contract);

  try {
    const txResponse = await contract.transfer(receiverAddress, numberOfTokens);
    return txResponse;
  } catch (error) {
    notify(error["data"]["message"], "error");

    return false;
  }
}

async function getContractInfo() {
  let currentChain = currentWeb3AuthChain;
  let contractObj = contractAddress.filter(
    (chain) => chain.chain === currentChain
  );
  return contractObj[0];
}
