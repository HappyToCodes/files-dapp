import React, { useEffect, useState } from "react";
import { Popover } from "react-tiny-popover";
import "./chainselect.scss";
import { AiOutlineCaretDown } from "react-icons/ai";
import {
  changeWeb3AuthChain,
  currentWeb3AuthChain,
} from "../../utils/services/web3auth";

function ChainSelect() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [currentChain, setCurrentChain] = useState(false);

  useEffect(() => {
    setCurrentChain(currentWeb3AuthChain);
  }, []);

  const handleNetworkSwitch = async (networkName) => {
    await changeWeb3AuthChain(networkName);
    await setCurrentChain(currentWeb3AuthChain);
    setIsPopoverOpen(false);
  };

  return (
    <Popover
      isOpen={isPopoverOpen}
      positions={["bottom", "left", "right"]}
      onClickOutside={() => setIsPopoverOpen(false)}
      content={
        <div className="chainsList">
          <div
            className="chainsList__chainItem"
            onClick={() => handleNetworkSwitch("fantom")}
          >
            <img src="/chain_icons/fantom.png" alt="" />
            <p>Fantom</p>
          </div>
          <div
            className="chainsList__chainItem"
            onClick={() => handleNetworkSwitch("polygon")}
          >
            <img src="/chain_icons/polygon.png" alt="" />
            <p>Polygon</p>
          </div>
          <div
            className="chainsList__chainItem"
            onClick={() => handleNetworkSwitch("optimism")}
          >
            <img src="/chain_icons/optimism.png" alt="" />
            <p>Optimism</p>
          </div>
          <div
            className="chainsList__chainItem"
            onClick={() => handleNetworkSwitch("ethereum")}
          >
            <img src="/chain_icons/ethereum.png" alt="" />
            <p>Ethereum</p>
          </div>
          <div
            className="chainsList__chainItem"
            onClick={() => handleNetworkSwitch("binance")}
          >
            <img src="/chain_icons/binance.png" alt="" />
            <p>Binance</p>
          </div>
          <div
            className="chainsList__chainItem"
            onClick={() => handleNetworkSwitch("ethereumTestnet")}
          >
            <img src="/chain_icons/ethereum.png" alt="" />
            <p>Rinkbey Testnet</p>
          </div>
          <div
            className="chainsList__chainItem"
            onClick={() => handleNetworkSwitch("mumbaiPolygonTestnet")}
          >
            <img src="/chain_icons/polygon.png" alt="" />
            <p>Mumbai Polygon</p>
          </div>
        </div>
      }
    >
      <div
        className="popoverBtn"
        onClick={() => setIsPopoverOpen(!isPopoverOpen)}
      >
        {(currentChain === "fantom" || currentChain === "fantom-testnet") && (
          <>Fantom</>
        )}
        {(currentChain === "polygon" || currentChain === "polygon-testnet") && (
          <>Polygon</>
        )}
        {(currentChain === "binance" || currentChain === "binance-testnet") && (
          <>Binance</>
        )}
        {currentChain === "ethereum" && <>Ethereum</>}
        {currentChain === "ethereumTestnet" && <>Rinkbey</>}
        {currentChain === "mumbaiPolygonTestnet" && <>Mumbai</>}
        {(currentChain === "optimism" ||
          currentChain === "optimism-testnet") && <>Optimism</>}
        {currentChain === null && <>Change Network</>}
        &nbsp; <AiOutlineCaretDown />
      </div>
    </Popover>
  );
}

export default ChainSelect;
