import React, { useState, useEffect, useRef } from "react";
import "./Migration.scss";
import { MdOutlineContentCopy, MdOutlineVisibility } from "react-icons/md";
import { useOutletContext } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import axios from "axios";
import moment from "moment";
import Searchbar from "../../../components/searchBar/Searchbar";
import Pagination from "../../../components/Pagination/Pagination";
import { notify } from "../../../utils/services/notification";
import { getAddress } from "../../../utils/services/auth";
import { baseUrl } from "../../../utils/config/urls";
import { bytesToString, copyToClipboard } from "../../../utils/services/other";
import Skeleton from "react-loading-skeleton";
import { Dialog } from "@material-ui/core";
import MigrationAddDialog from "../../../containers/MigrationAddDialog/MigrationAddDialog";
import History from "../../../utils/services/GlobalNavigation/navigationHistory";

function Migration() {
  const [currentItems, setCurrentItems] = useState([]);
  const [orignalItems, setOrignalItems] = useState([]);
  const [itemsPerPage, setitemsPerPage] = useState(7);
  const [responseReceived, setResponseReceived] = useState(false);
  const [isCreateMigrate, setCreateMigrate] = useState(false);

  const tableRef = useRef(null);
  const store = useSelector((store) => store);

  const isMobile = store?.otherData?.isMobile || false;

  useEffect(() => {
    getData();
    setTableItemsLength();
  }, [isCreateMigrate]);

  const setTableItemsLength = () => {
    let tableHeight = tableRef?.current?.clientHeight || 0;
    let coulumnHeight = 52;
    setitemsPerPage(Math.floor(tableHeight / coulumnHeight) - 2);
  };

  const getData = async () => {
    try {
      let data = await axios.get(
        `${baseUrl}/api/lighthouse/cid_order_status?publicKey=${getAddress().toLowerCase()}`
      );
      console.log(data?.["data"]);
      if (data["status"] === 200) {
        setOrignalItems(data?.["data"]);
        setCurrentItems(data?.["data"]);
      }
      setResponseReceived(true);
    } catch (error) {
      notify(`Error:${error}`);
    }
  };

  return (
    <>
      <div className="Migration">
        <div className="Migration__title">
          <p>Migrations</p>
          <div className="searchBar">
            <Searchbar
              orignalItems={orignalItems}
              setCurrentItems={setCurrentItems}
              placeholder={"Search Order ID"}
              primaryConditionKey={"orderID"}
            />
            <div
              className="fillBtn__blue"
              style={{ whiteSpace: "nowrap" }}
              onClick={() => {
                setCreateMigrate(true);
              }}
            >
              Create Migrations
            </div>
          </div>
        </div>

        <div className="Migration__tableContainer" ref={tableRef}>
          <table>
            <thead>
              <tr className="tableHead">
                <th>Order ID</th>
                {!isMobile ? (
                  <>
                    <th>Number of CID's</th>
                    <th>Status</th>
                    <th>Date</th>
                  </>
                ) : (
                  <></>
                )}
              </tr>
            </thead>
            <tbody>
              {responseReceived ? (
                currentItems?.length > 0 &&
                currentItems.map((item, i) => (
                  <tr
                    key={i}
                    className="ptr"
                    onClick={() => {
                      History.navigate(`dashboard/migration/${item.orderID}`);
                    }}
                  >
                    <td>
                      {item.orderID}{" "}
                      <span
                        className="icon"
                        onClick={() => {
                          copyToClipboard(item.orderID);
                        }}
                      >
                        <MdOutlineContentCopy />
                      </span>
                    </td>

                    {isMobile ? (
                      <></>
                    ) : (
                      <>
                        <td>{item?.totalCID}</td>
                        <td>{item?.orderStatus}</td>
                        <td>
                          {moment(item?.createdAt).format("DD-MM-YYYY h:mm:ss")}
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td>
                    <Skeleton />
                  </td>
                  {isMobile ? (
                    <></>
                  ) : (
                    <>
                      <td>
                        <span style={{ flex: "0.95" }}>
                          <Skeleton />
                        </span>
                      </td>
                      <td>
                        <Skeleton />
                      </td>
                      <td>
                        <Skeleton />
                      </td>
                    </>
                  )}
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="Migration__lowerContainer">
          <Pagination
            orignalData={orignalItems}
            setCurrentData={setCurrentItems}
            itemsPerPage={itemsPerPage}
          />
        </div>
        <Dialog
          open={isCreateMigrate}
          onClose={() => {
            setCreateMigrate(false);
          }}
        >
          <MigrationAddDialog setCreateMigrate={setCreateMigrate} />
        </Dialog>
      </div>
    </>
  );
}

export default Migration;
