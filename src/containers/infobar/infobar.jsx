import React, { useEffect, useState } from "react";
import "./infobar.scss";
import {
  ProSidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "react-pro-sidebar";
import { BiDownload, BiLink } from "react-icons/bi";
import { BsShare } from "react-icons/bs";
import { MdOutlineVisibility, MdClose } from "react-icons/md";
import Dialog from "@material-ui/core/Dialog";
import FileShareDialog from "../fileShareDialog/FileShareDialog";
import moment from "moment";
import { notify } from "../../utils/services/notification";
import History from "../../utils/services/GlobalNavigation/navigationHistory";
import Skeleton from "react-loading-skeleton";
import { TbLockAccess } from "react-icons/tb";
import { getDealIDs } from "../../utils/services/filedeploy";
import ReactTooltip from "react-tooltip";

function viewFile(data) {
  if (data["encryption"] === "false" || !data["encryption"]) {
    window.open(
      "https://gateway.lighthouse.storage/ipfs/" + data["cid"],
      "_blank"
    );
  } else {
    History.navigate(`viewFile/${data?.cid}`, { state: data });
  }
}
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(`https://ipfs.io/ipfs/${text}`);
  notify("Copied To Clipboard", "success");
};
function downloadFile(cid, filename) {
  let url = `https://ipfs.io/ipfs/${cid}`;
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    })
    .catch(console.error);
}

function Infobar({ infoBarData, setInfoBarData }) {
  const [shareDialogData, setShareDialogData] = useState(null);
  const [dealID, setDealIds] = useState(null);

  useEffect(() => {
    (async () => {
      let dealIds = await getDealIDs(infoBarData?.cid);
      console.log(dealIds);
      setDealIds(dealIds?.length > 6 ? dealIds.slice(0, 6) : dealIds);
    })();
  }, [infoBarData]);

  return (
    <ProSidebar
      className="infoBarContainer"
      collapsed={infoBarData?.cid ? false : true}
    >
      <div className="bg-overlay"></div>
      <SidebarHeader>
        <p className="fileName">{infoBarData?.fileName}</p>
        <MdClose
          className="ptr"
          onClick={() => {
            setInfoBarData(null);
          }}
        />
      </SidebarHeader>
      <SidebarContent>
        <div className="row">
          <p>Size</p>
          <p className="content">
            {(infoBarData?.fileSizeInBytes / 1024).toFixed(1) + " KB"}
          </p>
        </div>
        <div className="row">
          <p>Created At</p>
          <p className="content">
            {moment(infoBarData?.createdAt).format("DD-MM-YYYY")} <br />{" "}
            {moment(infoBarData?.createdAt).format("h:mm:ss")}
          </p>
        </div>
        <div className="row">
          <p>
            CID
            <br />
            <span className="content">{infoBarData?.cid}</span>
          </p>
        </div>
        <div className="row">
          <p>
            TxHash
            <br />
            <span
              className="content ptr"
              onClick={() => {
                window.open(
                  `https://mumbai.polygonscan.com/tx/${infoBarData?.txHash}`,
                  "_blank"
                );
              }}
            >
              {infoBarData?.txHash?.length > 0
                ? infoBarData?.txHash?.substring(0, 8) +
                  "......" +
                  infoBarData?.txHash?.substring(
                    infoBarData?.txHash?.length - 8
                  )
                : "In Process"}
            </span>
          </p>
        </div>
        <div className="row">
          <p>
            Storage Deals
            <br />
            <span className="content">
              {dealID
                ? dealID.map((deal, index) => (
                    <span
                      className="link"
                      key={index}
                      onClick={() => {
                        window
                          .open(`https://filfox.info/en/deal/${deal}`, "_blank")
                          .focus();
                      }}
                    >
                      {deal}
                      {index + 1 === dealID.length ? "" : ","}&nbsp;
                    </span>
                  ))
                : "CID push to miners in progress."}
            </span>
          </p>
        </div>

        <hr />

        <div className="iconsContainer">
          <MdOutlineVisibility
            data-tip="View File"
            onClick={() => viewFile(infoBarData)}
          />
          <BiLink
            data-tip="Copy Link"
            onClick={() => {
              copyToClipboard(infoBarData?.cid);
            }}
          />
          <BsShare
            data-tip="Share File"
            onClick={() => {
              setShareDialogData(infoBarData);
            }}
          />
          <BiDownload
            data-tip="Download File"
            onClick={() => downloadFile(infoBarData?.cid, infoBarData?.cid)}
          />
        </div>

        {infoBarData?.encryption && (
          <div className="accessContainer">
            <div
              className="fillBtn__blue"
              data-tip="Access Control"
              onClick={() => {
                History.navigate(
                  `dashboard/accessControl/${infoBarData?.cid}`,
                  {
                    state: infoBarData,
                  }
                );
              }}
            >
              Apply Access Control
            </div>
          </div>
        )}
      </SidebarContent>
      <SidebarFooter></SidebarFooter>

      <Dialog
        open={shareDialogData != null ? true : false}
        onClose={() => {
          setShareDialogData(null);
        }}
      >
        <FileShareDialog
          shareDialogData={shareDialogData}
          setShareDialogData={setShareDialogData}
        />
      </Dialog>
      <ReactTooltip />
    </ProSidebar>
  );
}

export default Infobar;
