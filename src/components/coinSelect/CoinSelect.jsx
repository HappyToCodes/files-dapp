import React, { useState } from "react";
import { Popover } from "react-tiny-popover";
import "./coinSelect.scss";
import { AiOutlineCaretDown } from "react-icons/ai";
import { stableCoinContractAddress } from "../../utils/config/stableCoins";

function CoinSelect({ currentCoin, setCurrentCoin }) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  return (
    <Popover
      isOpen={isPopoverOpen}
      positions={["bottom", "left", "right"]}
      onClickOutside={() => setIsPopoverOpen(false)}
      content={
        <div className="coinSelect">
          {stableCoinContractAddress.map((coin) => (
            <div
              className="coinSelect__chainItem"
              onClick={() => {
                setCurrentCoin(coin.name);
                setIsPopoverOpen(false);
              }}
            >
              <img src={coin?.logo} alt="logo" />
              <p>{coin?.name}</p>
            </div>
          ))}
        </div>
      }
    >
      <div
        className="coinSelect__popoverBtn"
        onClick={() => setIsPopoverOpen(!isPopoverOpen)}
      >
        {stableCoinContractAddress.map(
          (coin) =>
            currentCoin === coin?.name && (
              <div className="logoContainer">
                <img src={coin?.logo} alt="logo" />
              </div>
            )
        )}
        &nbsp; <AiOutlineCaretDown />
      </div>
    </Popover>
  );
}

export default CoinSelect;
