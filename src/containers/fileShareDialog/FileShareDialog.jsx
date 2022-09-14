import React, { useState } from "react";
import "./FileShareDialog.scss";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import Chips from "react-chips";
import emailjs from "emailjs-com";
import { notify } from "../../utils/services/notification";
import ToggleButton from "../../components/ToggleButton/ToggleButton";
import { ethers } from "ethers";
import { shareFileToAddress } from "../../utils/services/filedeploy";
import { MdContentCopy } from "react-icons/md";
import { copyToClipboard } from "../../utils/services/other";

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
const validateAddress = (address) => {
  return ethers.utils.isAddress(address);
};
const sendEmail = (emailIds, cid, setMailAddress) => {
  let message = {
    to_emails: emailIds.join(","),
    message: cid,
  };
  emailjs
    .send(
      "service_wtwdhbv",
      "template_osbkn86",
      message,
      "user_sWuohBQz7vY1wvfFSbCDF"
    )
    .then(
      function (response) {
        // console.log('SUCCESS!', response.status, response.text);
        if (response.status === 200) {
          notify("File Shared Successfully");
          setMailAddress([]);
        }
      },
      function (error) {
        // console.log('FAILED...', error);
      }
    );
};

const shareWithAddress = async (cid, publicAddresses, setPublicAddresses) => {
  try {
    if (publicAddresses.length > 0) {
      let response = await shareFileToAddress(cid, publicAddresses[0]);
      notify(response, "success");
      setPublicAddresses([]);
    }
  } catch (err) {
    notify(err, "error");
  }
};

const chipTheme = {
  chip: {
    cursor: "default",
    background: "#FFFFFF",
    borderRadius: "14px",
    border: "1px solid lightgrey",
    padding: "0.3rem 0.7rem",
    margin: "0.5rem 0.3rem",
  },
};

function FileShareDialog({ shareDialogData, setShareDialogData }) {
  console.log(shareDialogData);
  const [mailAddress, setMailAddress] = useState([]);
  const [publicAddresses, setPublicAddresses] = useState([]);
  const [isEmail, setIsEmail] = useState(false);
  const [isError, setError] = useState(false);

  function onChange(chips) {
    setError(false);
    let validatedChips = [];
    chips.forEach((element) => {
      if (validateEmail(element)) {
        validatedChips.push(element);
      } else {
        setError(true);
      }
    });
    setMailAddress(validatedChips);
  }
  function onChangePublicAddress(chips) {
    setError(false);
    let validatedChips = [];
    chips.forEach((element) => {
      if (validateAddress(element)) {
        validatedChips.push(element);
      } else {
        setError(true);
      }
    });
    setPublicAddresses(validatedChips);
  }
  return (
    <>
      <DialogTitle className="title">
        <span>{"Share File"}</span>
        <span>
          {" "}
          <ToggleButton
            setTrue={setIsEmail}
            isTrue={isEmail}
            trueValue={"Email"}
            falseValue={"Public Address"}
          />
        </span>
      </DialogTitle>
      {isEmail ? (
        <DialogContent>
          <p>Share your file with anyone using email</p>

          {isError && <small>Please enter a valid email</small>}

          <DialogContentText>
            <Chips
              value={mailAddress}
              onChange={onChange}
              uniqueChips={true}
              createChipKeys={[32, 188, 9, 13]}
              chipTheme={chipTheme}
            />
          </DialogContentText>
        </DialogContent>
      ) : (
        <DialogContent>
          <p>Share your file with anyone using public address</p>

          {isError && <small>Please enter a valid public address</small>}

          <DialogContentText>
            <Chips
              value={publicAddresses}
              onChange={onChangePublicAddress}
              uniqueChips={true}
              createChipKeys={[32, 188, 9, 13]}
              chipTheme={chipTheme}
            />
          </DialogContentText>

          <div className="linkShareContainer">
            <div className="shareTitle">
              <span>Sharable Link</span>
              <MdContentCopy
                className="ptr"
                onClick={() => {
                  copyToClipboard(
                    `https://files.lighthouse.storage/viewFile/${shareDialogData["cid"]}`
                  );
                }}
              />
            </div>
            <p>
              {`https://files.lighthouse.storage/viewFile/${shareDialogData["cid"]}`}
            </p>
          </div>
        </DialogContent>
      )}
      <DialogActions>
        <p className="files">
          Sharing this file with{" "}
          {isEmail ? mailAddress.length : publicAddresses.length} Users
        </p>
        <Button
          onClick={() => {
            isEmail
              ? sendEmail(mailAddress, shareDialogData.cid, setMailAddress)
              : shareWithAddress(
                  shareDialogData.cid,
                  publicAddresses,
                  setPublicAddresses
                );
          }}
        >
          Share
        </Button>
      </DialogActions>
    </>
  );
}

export default FileShareDialog;
