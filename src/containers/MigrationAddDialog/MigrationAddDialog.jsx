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
import chargeSample from "../../utils/contract_abi/billing";
import Papa from "papaparse";

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
      let refinedPasteContent = pasteContent.replaceAll(/\s/g, "");
      setCids(refinedPasteContent.split(","));
    };
    window.addEventListener("paste", handlePasteAnywhere);
    return () => {
      window.removeEventListener("paste", handlePasteAnywhere);
    };
  }, []);

  const uploadFile = () => {
    document.getElementById("file").click();
  };
  const downloadFile = () => {
    let url =
      "https://gateway.lighthouse.storage/ipfs/QmYxbsUXJdpAGzUa4Rns9tGMkfRF2MGZhxsjWTz6DWTLve";
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "sampleFile.csv";
        link.click();
      })
      .catch(console.error);
  };

  const getEventFile = (event) => {
    const files = event.target.files;
    let unProcessedArray = [];
    let processedArray = [];
    if (files) {
      Papa.parse(files[0], {
        complete: function (results) {
          unProcessedArray = results.data;

          if (unProcessedArray.length > 0) {
            unProcessedArray.forEach((item) => {
              item?.[0]?.length > 0 && processedArray.push(item[0]);
            });
          }

          setCids(processedArray);
        },
      });
    }
  };
  return (
    <>
      <DialogTitle>{"Migrate Files"}</DialogTitle>
      <DialogContent>
        <p>
          Enter CID's you want to migrate or &nbsp;
          <span
            className="link"
            onClick={() => {
              uploadFile();
            }}
          >
            upload the csv file
          </span>{" "}
          &nbsp; with the cids
        </p>
        <DialogContentText>
          <Chips
            value={cids}
            onChange={onChange}
            uniqueChips={true}
            createChipKeys={[32, 188, 9, 13]}
            chipTheme={chipTheme}
          />
        </DialogContentText>
        <a
          // onClick={() => {
          //   downloadFile();
          // }}
          href={chargeSample}
          download="name.csv"
          className="link"
        >
          Download Sample CSV
        </a>
        <input
          type="file"
          accept=".csv"
          id="file"
          onChange={(e) => getEventFile(e)}
          hidden
        />
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
