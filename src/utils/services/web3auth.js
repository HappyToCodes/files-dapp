import { ADAPTER_EVENTS } from "@web3auth/base";
import { Web3Auth } from "@web3auth/web3auth";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { availableNetworks } from "../config/availableNetworks";
import { Web3AuthCore } from "@web3auth/core";
import { WALLET_ADAPTERS } from "@web3auth/base";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";
import History from "./GlobalNavigation/navigationHistory";
import Web3 from "web3";

let clientId = process.env.REACT_APP_WEB3AUTH_APP_ID;
export var web3auth = undefined;

export var currentWeb3AuthChain = "mumbaiPolygonTestnet";

export const initWeb3Auth = async () => {
  try {
    web3auth = new Web3AuthCore({
      chainConfig: getWeb3AuthChainConfig(currentWeb3AuthChain),
    });
    // console.log(web3auth["walletAdapters"]["metamask"], "init web3auth");

    const openloginAdapter = new OpenloginAdapter({
      adapterSettings: {
        network: "mainnet",
        clientId: clientId,
      },
    });
    const metamaskAdapter = new MetamaskAdapter();
    web3auth.configureAdapter(openloginAdapter);
    web3auth.configureAdapter(metamaskAdapter);
    await web3auth.init();
  } catch (error) {
    console.error(error, "INSIDE WEB3AUTH");
  }
};

export const checkWeb3AuthConnection = () => {
  web3auth.on(ADAPTER_EVENTS.CONNECTED, (data) => {
    console.log("Yeah!, you are successfully logged in", data);
    return true;
  });
};

export const web3authLogout = async () => {
  if (!web3auth) {
    console.log("web3auth not initialized yet");
    return;
  }
  await web3auth.logout();
};

export const getWeb3AuthChainConfig = (chainName) => {
  let chainData = availableNetworks[chainName];
  if (chainData) {
    let chainConfig = {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: chainData.chainId,
      rpcTarget: chainData.rpcUrls,
      displayName: chainData.chainName,
      blockExplorer: chainData.blockExplorerUrls,
      ticker: chainData?.nativeCurrency?.symbol,
      tickerName: chainData?.nativeCurrency?.name,
    };
    return chainConfig;
  } else {
    console.log("Invalid Chain Name");
    return;
  }
};

export const changeWeb3AuthChain = async (chainName) => {
  console.log(chainName, "change chain");
  let currentAdapter = localStorage.getItem("Web3Auth-cachedAdapter");
  console.log(currentAdapter, "change chain");
  currentAdapter === "metamask" && (await changeAddNetworkMetamask(chainName));
  currentWeb3AuthChain = chainName;
  await initWeb3Auth();
};

export const changeAddNetworkMetamask = async (chainName) => {
  let chainConfig = getWeb3AuthChainConfig(chainName);

  if (window.ethereum.networkVersion !== chainConfig["chainId"]) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: Web3.utils.toHex(chainConfig["chainId"]) }],
      });
    } catch (err) {
      // This error code indicates that the chain has not been added to MetaMask
      if (err.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainName: chainConfig["displayName"],
              chainId: Web3.utils.toHex(chainConfig["chainId"]),
              nativeCurrency: {
                name: chainConfig["tickerName"],
                decimals: 18,
                symbol: chainConfig["ticker"],
              },
              rpcUrls: chainConfig["rpcTarget"],
            },
          ],
        });
      }
    }
  }
};

export const web3AuthLogin = async (adapter, loginProvider, login_hint) => {
  try {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    let web3authProvider = await web3auth.connectTo(adapter, {
      loginProvider,
      login_hint,
    });
    return web3authProvider;
  } catch (error) {
    console.log("error", error);
    return;
  }
};

export const Web3AuthLoginWithWallet = async () => {
  try {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    let web3authProvider = await web3auth.connectTo(
      WALLET_ADAPTERS.METAMASK,
      {}
    );
    return web3authProvider;
  } catch (error) {
    console.log("error", error["code"]);
    error["code"] === 5111 && History.push("/dashboard");
    return;
  }
};
