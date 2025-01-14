import lighthouse from "@lighthouse-web3/sdk";
import { lighthouseAbi } from "../contract_abi/lighthouseAbi";
import { ethers } from "ethers";
import axios from "axios";

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
  console.log(provider);
  const signer = provider.getSigner();
  console.log("Signer", signer);
  const publicKey = await signer.getAddress();
  console.log("Public Key", publicKey);
  const messageRequested = await lighthouse.getAuthMessage(publicKey);
  const signed_message = await signer.signMessage(messageRequested);
  return signed_message;
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
        let signedEncryptionMessage = await sign_auth_message();
        const deploy_response = await lighthouse.uploadEncrypted(
          uploadedFile,
          getAddress(),
          getAccessToken(),
          signedEncryptionMessage
        );
        setUploadProgress(0);
        console.log("Deploy Response", deploy_response);
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

export const getDecryptKey = async (cid) => {
  const signed_message = await sign_auth_message();
  const publicKey = getAddress();
  const key = await lighthouse.fetchEncryptionKey(
    cid,
    publicKey,
    signed_message
  );
  return key;
};

export const decryptEncryptedFile = async (cid) => {
  let key = await getDecryptKey(cid);
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
  let deals = [];
  for (let i = 0; i < status?.length; i++) {
    if (status[i]["deals"]?.length > 0) {
      let tempDeal = status[i]["deals"];
      tempDeal.forEach((item) => deals.push(item.ID));
    } else {
      break;
    }
  }
  return deals.length > 0 ? deals : null;
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

export const shareFileToAddress = async (cid, publicAddress) => {
  const key = await getDecryptKey(cid);
  const signed_message = await sign_auth_message();
  const res = await lighthouse.shareFile(
    getAddress(),
    publicAddress,
    cid,
    key,
    signed_message
  );
  console.log(res); // String: "Shared"

  return res;
};
