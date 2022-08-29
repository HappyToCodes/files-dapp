import React, { useEffect, useState } from "react";
import { bytesToString, copyToClipboard } from "../../../utils/services/other";
import "./Profile.scss";
import { MdOutlineContentCopy } from "react-icons/md";
import Progress from "react-progressbar";
import { getAddress } from "../../../utils/services/auth";
import { useSelector } from "react-redux";
import TokenCard from "../../../components/TokenCard/TokenCard";
import { stableCoinContractAddress } from "../../../utils/config/stableCoins";

function Profile() {
  const [userBalance, setUserBalance] = useState(null);
  const store = useSelector((store) => store);
  const stableCoins = stableCoinContractAddress;

  useEffect(() => {
    setUserBalance(store["balance"]);
  }, []);

  return (
    <div className="Profile">
      <div className="Profile__title">
        <p>My Profile</p>
      </div>
      <hr />
      <div className="Profile__InfoContainer">
        <div className="AddressContainer">
          <div className="label">
            Public Address
            <MdOutlineContentCopy
              onClick={() => {
                copyToClipboard(getAddress());
              }}
            />
          </div>
          <div className="addressBox">
            <p className="address">{getAddress()}</p>
            <div
              className="icon"
              onClick={() => {
                copyToClipboard(getAddress());
              }}
            >
              <MdOutlineContentCopy />
            </div>
          </div>
        </div>
        <div className="SpaceContainer">
          <div className="label">Space Used</div>
          {userBalance && (
            <div className="spaceBox">
              <Progress
                completed={
                  (userBalance["dataUsed"] / userBalance["dataLimit"]) * 100
                }
              />
              {
                <p>
                  {bytesToString(userBalance["dataUsed"])} /{" "}
                  {bytesToString(userBalance["dataLimit"])}
                </p>
              }
            </div>
          )}
        </div>
      </div>

      <div className="Profile__TokenBalanceContainer">
        <div className="title">Available Tokens</div>
        <div className="tokenContainer">
          {stableCoins &&
            stableCoins.map((coin, key) => <TokenCard {...coin} key={key} />)}
        </div>
      </div>
    </div>
  );
}

export default Profile;
