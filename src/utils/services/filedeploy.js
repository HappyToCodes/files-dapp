import lighthouse from "@lighthouse-web3/sdk";
import { lighthouseAbi } from "../contract_abi/lighthouseAbi";
import { ethers } from "ethers";
import axios from "axios";
import { getChainNetwork } from "./chainNetwork";
import { notify } from "./notification";
import { getAccessToken, getAddress } from "./auth";
import { baseUrl } from "../config/urls";
import { currentWeb3AuthChain, web3auth } from "./web3auth";
import Web3 from "web3";

export const sign_message = async () => {
  const provider = new ethers.providers.Web3Provider(web3auth.provider);
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  const res = await axios.get(
    `${baseUrl}/api/auth/get_message?publicKey=${address}`
  );
  const message = res.data;
  const signed_message = await signer.signMessage(message);
  return {
    message: message,
    signed_message: signed_message,
    address: address,
  };
};
const sign_auth_message = async () => {
  const provider = new ethers.providers.Web3Provider(web3auth.provider);
  const signer = provider.getSigner();
  const publicKey = await signer.getAddress();
  const messageRequested = await lighthouse.getAuthMessage(publicKey);
  const signed_message = await signer.signMessage(messageRequested);
  return signed_message;
};

export const execute_transaction = async (
  cid,
  fileName,
  fileSize,
  cost,
  network
) => {
  const web3provider = await web3auth.connect();
  const provider = new ethers.providers.Web3Provider(web3provider);
  console.log(network);
  const contract_address = lighthouse.getContractAddress(network);

  const signer = provider.getSigner();
  const contract = new ethers.Contract(contract_address, lighthouseAbi, signer);
  const txResponse = await contract.store(cid, "", fileName, fileSize, {
    value: ethers.utils.parseEther(cost),
  });
  return txResponse;
};

export const uploadFile = async (
  uploadedFile,
  setUploadProgress,
  _authDetails
) => {
  uploadedFile.persist();
  setUploadProgress(10);
  let network = currentWeb3AuthChain;
  if (network) {
    try {
      setUploadProgress(20);
      let balance = await getBalance();
      if (+balance?.dataUsed < +balance?.dataLimit) {
        setUploadProgress(50);
        const deploy_response = await lighthouse.deploy(
          uploadedFile,
          getAccessToken()
        );
        setUploadProgress(70);
        setUploadProgress(0);
        notify(`File Upload Success:  ${deploy_response?.Hash}`, "success");
      } else {
        setUploadProgress(0);
        notify(`Free Data Usage Exeeded `, "error");
      }
    } catch (e) {
      notify(`ERROR:${e}`, "error");
      setUploadProgress(0);
    }
  } else {
    notify(`Please connect to a supported network`, "error");
  }
};

export const uploadEncryptedFile = async (
  uploadedFile,
  setUploadProgress,
  _authDetails
) => {
  uploadedFile.persist();
  setUploadProgress(10);
  let network = currentWeb3AuthChain;
  if (network) {
    try {
      setUploadProgress(20);
      let balance = await getBalance();
      if (+balance?.dataUsed < +balance?.dataLimit) {
        const deploy_response = await lighthouse.uploadEncrypted(
          uploadedFile,
          getAddress(),
          getAccessToken()
        );
        setUploadProgress(0);
        notify(`File Upload Success:  ${deploy_response?.Hash}`, "success");
      } else {
        setUploadProgress(0);
        notify(`Data Usage Exeeded `, "error");
      }
    } catch (e) {
      notify(`ERROR:${e}`, "error");
      setUploadProgress(0);
    }
  } else {
    notify(`Please connect to a supported network`, "error");
  }
};

export const decryptEncryptedFile = async (cid) => {
  const signed_message = await sign_auth_message();
  console.log(signed_message);
  const publicKey = getAddress();
  const key = await lighthouse.fetchEncryptionKey(
    cid,
    publicKey,
    signed_message
  );
  console.log(key);
  const decrypted = await lighthouse.decryptFile(cid, key);
  return decrypted;
};

export const uploadFolder = async (
  uploadedFile,
  setUploadProgress,
  _authDetails
) => {
  uploadedFile.persist();
  let network = currentWeb3AuthChain;
  setUploadProgress(10);
  if (network) {
    try {
      setUploadProgress(20);
      let balance = await getBalance();
      // let signed_message = await sign_message();
      if (+balance?.dataUsed < +balance?.dataLimit) {
        setUploadProgress(50);
        const deploy_response = await lighthouse.deploy(
          uploadedFile,
          getAccessToken()
        );

        console.log(deploy_response);
        setUploadProgress(70);
        let newResponse = deploy_response.split("\n");
        newResponse = JSON.parse(newResponse[newResponse.length - 2]);
        setUploadProgress(100);
        setUploadProgress(0);
        notify(`File Upload Success:\n  ${newResponse?.Hash}`, "success");
      } else {
        setUploadProgress(0);
        notify(`Free Data Usage Exeeded`, "error");
      }
    } catch (e) {
      notify(`ERROR:${e}`, "error");
      setUploadProgress(0);
    }
  } else {
    notify(`Please connect to a supported network`, "error");
  }
};

export const getBalance = async () => {
  const response = await axios.get(
    `${baseUrl}/api/user/user_data_usage?publicKey=${getAddress()}`
  );
  return response["data"];
};

export const getDealIDs = async (cid) => {
  const status = await lighthouse.status(cid);
  for (let i = 0; i < status.length; i++) {
    if (status[i]["deals"].length > 0) {
      for (let j = 0; j < status[i]["deals"].length; j++) {
        let gap = 10 + (8 - status[i]["deals"][j]["miner"].length);
        let dealIds =
          Array(gap).fill("\xa0").join("") + status[i]["deals"][j]["dealId"];
        return dealIds;
      }
    } else {
      return "CID push to miners in progress.";
    }
    break;
  }
};

export const addressValidator = (value) => {
  return Web3.utils.isAddress(value);
};

export const createAccessControl = async (cid, conditions, aggregator) => {
  console.log("Conditions", conditions);
  console.log("aggregator", aggregator);
  const publicKey = getAddress();
  const signedMessage1 = await sign_auth_message();

  // Get File Encryption Key
  const fileEncryptionKey = await lighthouse.fetchEncryptionKey(
    cid,
    publicKey,
    signedMessage1
  );

  console.log("Encryption Key", fileEncryptionKey);

  const signedMessage2 = await sign_auth_message();

  const response = await lighthouse.accessCondition(
    publicKey,
    cid,
    fileEncryptionKey,
    signedMessage2,
    conditions,
    aggregator
  );

  return response;
};
