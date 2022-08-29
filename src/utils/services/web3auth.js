import { ADAPTER_EVENTS } from "@web3auth/base";
import { Web3Auth } from "@web3auth/web3auth";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { availableNetworks } from "../config/availableNetworks";
import { Web3AuthCore } from "@web3auth/core";
import { WALLET_ADAPTERS } from "@web3auth/base";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";
import History from "./GlobalNavigation/navigationHistory";

let clientId = process.env.REACT_APP_WEB3AUTH_APP_ID;
export var web3auth = undefined;

export var currentWeb3AuthChain = "ethereum";

export const initWeb3Auth = async () => {
  try {
    web3auth = new Web3AuthCore({
      chainConfig: getWeb3AuthChainConfig(currentWeb3AuthChain),
    });
    console.log(web3auth, "init web3auth");

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
  currentWeb3AuthChain = chainName;
  await initWeb3Auth();
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
