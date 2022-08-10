import { DialogContent } from "@material-ui/core";
import React, { useRef } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { GrGoogle, GrGithub, GrMail } from "react-icons/gr";
import {
  web3AuthLogin,
  Web3AuthLoginWithWallet,
} from "../../utils/services/web3auth";
import { WALLET_ADAPTERS } from "@web3auth/base";
import { ethers } from "ethers";
import axios from "axios";
import { baseUrl } from "../../utils/config/urls";
import { login } from "../../utils/services/auth";
import { IoWallet } from "react-icons/io5";
import "./LoginDialog.scss";
import { sign_message } from "../../utils/services/filedeploy";

function LoginDialog({ setLoginDialog, loginRediect }) {
  const email = useRef("");
  const loginSocial = async (type) => {
    const web3provider = await web3AuthLogin(WALLET_ADAPTERS.OPENLOGIN, type);
    await proceedLogin();
  };
  const handleLoginWithEmail = async () => {
    const web3provider = await web3AuthLogin(
      WALLET_ADAPTERS.OPENLOGIN,
      "email_passwordless",
      email.current.value
    );
    await proceedLogin();
  };
  const handleWallet = async () => {
    const web3provider = await Web3AuthLoginWithWallet();
    await proceedLogin();
  };

  const proceedLogin = async () => {
    const obj = await sign_message();
    const authToken = await axios.post(`${baseUrl}/api/auth/verify_signer`, {
      publicKey: obj.address,
      signedMessage: obj.signed_message,
    });
    login(
      obj.address,
      obj.signed_message,
      authToken?.["data"]?.["accessToken"],
      authToken?.["data"]?.["refreshToken"],
      loginRediect
    );
  };

  return (
    <div className="LoginDialog">
      <div className="LoginDialog__content">
        <DialogContent>
          <div className="title">
            <p>Login To Lighthouse</p>
            <AiOutlineCloseCircle
              className="ptr"
              onClick={() => {
                setLoginDialog(false);
              }}
            />
          </div>

          <div className="content">
            <div className="email">
              <label htmlFor="">Using an Email</label>
              <input type="text" ref={email} />
              <button
                className="fillBtn__blue"
                onClick={() => {
                  handleLoginWithEmail();
                }}
              >
                {" "}
                <span className="icon">
                  <GrMail />
                </span>{" "}
                Continue with Email
              </button>
            </div>

            <div className="directLogin">
              <label htmlFor="">Or Using one of our following</label>
              <button
                className="fillBtn__blue"
                onClick={() => {
                  handleWallet();
                }}
              >
                <span className="icon">
                  <IoWallet />
                </span>
                Continue with Wallet
              </button>
              <button
                className="fillBtn__blue"
                onClick={() => {
                  loginSocial("google");
                }}
              >
                {" "}
                <span className="icon">
                  <GrGoogle />
                </span>{" "}
                Continue with Google
              </button>
              <button
                className="fillBtn__blue"
                onClick={() => {
                  loginSocial("github");
                }}
              >
                <span className="icon">
                  <GrGithub />
                </span>
                Continue with github
              </button>
            </div>
          </div>
        </DialogContent>
      </div>
    </div>
  );
}

export default LoginDialog;
