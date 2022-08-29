import { Dialog } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import CoinSelect from "../../../components/coinSelect/CoinSelect";
import DisclaimerBar from "../../../components/DisclaimerBar/DisclaimerBar";
import TweeterTopupDialog from "../../../containers/tweeterTopUpDialog/TweeterTopupDialog";
import {
  topupAmount,
  topupStoragePacks,
  topupValuePacks,
} from "../../../utils/config/topupConfig";
import { baseUrl } from "../../../utils/config/urls";
import { getAccessToken } from "../../../utils/services/auth";
import { notify } from "../../../utils/services/notification";
import { depositCoin } from "../../../utils/services/smartContract";

import "./TopUp.scss";

const addTopup = async (value, chainName) => {
  console.log(value);
  await depositCoin(chainName, null, value);
};

const calculateStorage = (value, setTopupStorage) => {
  // storage space per unit (USDC)
  let unitStorage = 1 / topupAmount;
  if (value > 0) {
    setTopupStorage((unitStorage * value).toFixed(2));
  } else {
    setTopupStorage(0);
  }
};

const changeInput = (type, value, inputRef, setTopupStorage) => {
  if (type === "value") {
    inputRef.current.value = value.toFixed(2);
    calculateStorage(value, setTopupStorage);
  }
  if (type === "storage") {
    let amount = (value * topupAmount).toFixed(2);
    inputRef.current.value = amount;
    calculateStorage(amount, setTopupStorage);
  }
};

function TopUp() {
  const [topupStorage, setTopupStorage] = useState(0);
  const [tweeterTopup, setTweeterTopup] = useState(false);
  const [isTweeterUsed, setTweeterUsed] = useState(false);
  const [isDisclaimer, setIsDisclaimer] = useState(true);
  const [currentCoin, setCurrentCoin] = useState("USD Tether");
  const inputRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        let response = await axios.get(`${baseUrl}/api/user/faucet_status`, {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        });
        response?.["data"]?.["twitter"] === "used" && setTweeterUsed(true);
      } catch (error) {
        setTweeterUsed(false);
      }
    })();
  }, []);

  return (
    <div className="topup">
      {/* <Overlay /> */}
      <div className="topupMain">
        {isDisclaimer && (
          <DisclaimerBar
            title={"Disclaimer"}
            content={
              "This feature is in testing mode and is currently working on Mumbai Polygon and Rinkby Testnet"
            }
            setIsDisclaimer={setIsDisclaimer}
          />
        )}
        <div className="topupMain__title">
          <p>Topup Lighthouse Storage</p>
          <button
            className="btn"
            onClick={() => {
              setTweeterTopup(true);
            }}
            disabled={isTweeterUsed}
          >
            Get 1 GB for free
          </button>
        </div>
        <div className="topupMain__description">
          <div className="container">
            <p>Add Quick Value Topups</p>
            <div className="valueTopups">
              {topupValuePacks.map((item, i) => (
                <p
                  className="planCard"
                  key={i}
                  onClick={() => {
                    changeInput("value", item, inputRef, setTopupStorage);
                  }}
                >
                  {`$ ${item.toFixed(2)}`}
                </p>
              ))}
            </div>
          </div>
          <div className="line"></div>
          <div className="container">
            <p>Add Quick Storage Topups</p>
            <div className="valueTopups">
              {topupStoragePacks.map((item, i) => (
                <p
                  className="planCard"
                  key={i}
                  onClick={() => {
                    changeInput("storage", item, inputRef, setTopupStorage);
                  }}
                >
                  {`${item} GB`}
                </p>
              ))}
            </div>
          </div>
        </div>
        <div className="topupMain__content">
          <div className="inputContainer">
            <div class="input-box">
              <span class="prefix">$</span>
              <input
                type="number"
                placeholder="Enter Topup Amount"
                ref={inputRef}
                onChange={() => {
                  calculateStorage(inputRef.current.value, setTopupStorage);
                }}
              />
              <span class="suffix">.00</span>
            </div>
            {currentCoin && (
              <CoinSelect
                currentCoin={currentCoin}
                setCurrentCoin={setCurrentCoin}
              />
            )}
          </div>

          <button
            className="btn ptr"
            onClick={() => {
              addTopup(inputRef.current.value, currentCoin);
            }}
          >
            {topupStorage > 0 ? (
              <span>Add {topupStorage + " GB"} to Lighthouse</span>
            ) : (
              <span>Add Storage to Lighthouse</span>
            )}
          </button>
        </div>
        <Dialog
          open={tweeterTopup}
          onClose={() => {
            setTweeterTopup(false);
          }}
        >
          <TweeterTopupDialog setTweeterTopup={setTweeterTopup} />
        </Dialog>
      </div>
      <div className="topupDesign">
        <div className="pattern"></div>
      </div>
    </div>
  );
}

export default TopUp;
