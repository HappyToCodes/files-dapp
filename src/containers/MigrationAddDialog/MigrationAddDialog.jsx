import React, { useEffect, useState } from "react";
import "./MigrationAddDialog.scss";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import Chips from "react-chips";
import { notify } from "../../utils/services/notification";
import axios from "axios";
import { baseUrl } from "../../utils/config/urls";
import { getAddress, getSignMessage } from "../../utils/services/auth";
import { sign_message } from "../../utils/services/filedeploy";

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

const migrateCids = async (setCreateMigrate, cids) => {
  try {
    let message = await sign_message();
    console.log(message);

    if (message?.address) {
      let response = await axios.post(
        `${baseUrl}/api/lighthouse/bulk_cid_add`,
        {
          publicKey: message?.address,
          signedMessage: message?.signed_message,
          data: JSON.stringify(cids),
        }
      );

      response["status"] === 200 &&
        notify(`Order ID : ${response?.["data"]?.["orderID"]}`, "success");
      setCreateMigrate(false);
    } else {
      notify("Migration Aborted", "error");
    }
  } catch (error) {
    notify(`Error: ${error}`, "error");
  }
};

function MigrationAddDialog({ setCreateMigrate }) {
  const [cids, setCids] = useState([]);
  function onChange(chips) {
    setCids(chips);
  }

  useEffect(() => {
    const handlePasteAnywhere = (event) => {
      let pasteContent = event.clipboardData.getData("text");
      setCids(pasteContent.split(","));
    };
    window.addEventListener("paste", handlePasteAnywhere);
    return () => {
      window.removeEventListener("paste", handlePasteAnywhere);
    };
  }, []);

  return (
    <>
      <DialogTitle>{"Migrate Files"}</DialogTitle>
      <DialogContent>
        <p>Enter CID's you want to migrate</p>
        <DialogContentText>
          <Chips
            value={cids}
            onChange={onChange}
            uniqueChips={true}
            createChipKeys={[32, 188, 9, 13]}
            chipTheme={chipTheme}
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            migrateCids(setCreateMigrate, cids);
          }}
        >{`Migrate ${cids.length} CID's`}</Button>
      </DialogActions>
    </>
  );
}

export default MigrationAddDialog;
