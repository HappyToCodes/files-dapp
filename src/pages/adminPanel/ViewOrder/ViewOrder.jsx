import React, { useState, useEffect, useRef } from "react";
import "./ViewOrder.scss";
import { MdOutlineContentCopy } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";

import axios from "axios";
import Searchbar from "../../../components/searchBar/Searchbar";
import Pagination from "../../../components/Pagination/Pagination";
import { notify } from "../../../utils/services/notification";
import { baseUrl } from "../../../utils/config/urls";
import { bytesToString, copyToClipboard } from "../../../utils/services/other";
import Skeleton from "react-loading-skeleton";
import { useParams } from "react-router-dom";

function ViewOrder() {
  const [currentItems, setCurrentItems] = useState([]);
  const [orignalItems, setOrignalItems] = useState([]);
  const [itemsPerPage, setitemsPerPage] = useState(7);
  const [responseReceived, setResponseReceived] = useState(false);
  const { id } = useParams();

  const tableRef = useRef(null);
  const store = useSelector((store) => store);

  const isMobile = store?.otherData?.isMobile || false;

  useEffect(() => {
    getData();
    setTableItemsLength();
  }, []);

  const setTableItemsLength = () => {
    let tableHeight = tableRef?.current?.clientHeight || 0;
    let coulumnHeight = 52;
    setitemsPerPage(Math.floor(tableHeight / coulumnHeight) - 2);
  };

  const getData = async () => {
    try {
      let response = await axios.get(
        `${baseUrl}/api/lighthouse/order_details?orderId=${id.toLowerCase()}`
      );
      if (response["status"] === 200) {
        setOrignalItems(response?.["data"]);
        setCurrentItems(response?.["data"]);
      }
      setResponseReceived(true);
    } catch (error) {
      notify(`Error:${error}`);
    }
  };

  const getOrderDetails = async (orderID) => {};

  return (
    <>
      <div className="ViewOrder">
        <div className="ViewOrder__title">
          <p>{id}</p>
          <div className="searchBar">
            <Searchbar
              orignalItems={orignalItems}
              setCurrentItems={setCurrentItems}
              placeholder={"Search CID"}
              primaryConditionKey={"cid"}
            />
          </div>
        </div>

        <div className="ViewOrder__tableContainer" ref={tableRef}>
          <table>
            <thead>
              <tr className="tableHead">
                <th>CID</th>
                {!isMobile ? (
                  <>
                    <th>Status</th>
                    <th>File Name</th>
                    <th>File Size</th>
                    <th>Deal ID</th>
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
                      getOrderDetails(item.orderID);
                    }}
                  >
                    <td>
                      {item.cid}{" "}
                      <span
                        className="icon"
                        onClick={() => {
                          copyToClipboard(item.cid);
                        }}
                      >
                        <MdOutlineContentCopy />
                      </span>
                    </td>

                    {isMobile ? (
                      <></>
                    ) : (
                      <>
                        <td>{item?.cidStatus ? item?.cidStatus : "Queued"}</td>
                        <td>
                          {item?.fileName?.length > 0 ? item?.fileName : "-"}
                        </td>
                        <td>
                          {item?.fileSizeInBytes.length > 0
                            ? bytesToString(item?.fileSizeInBytes)
                            : "-"}
                        </td>
                        <td>{item?.deal?.length > 0 ? item?.deal : "-"}</td>
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
        <div className="ViewOrder__lowerContainer">
          <Pagination
            orignalData={orignalItems}
            setCurrentData={setCurrentItems}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>
    </>
  );
}

export default ViewOrder;
