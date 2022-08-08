import React from "react";
import "./searchbar.scss";
import { BsSearch } from "react-icons/bs";

function Searchbar({
  orignalItems,
  setCurrentItems,
  placeholder,
  primaryConditionKey,
  secondaryConditionKey,
}) {
  const filterSelection = (e) => {
    let key = "cid";
    console.log(
      primaryConditionKey,
      secondaryConditionKey,
      orignalItems[0]?.[primaryConditionKey + ""],
      key
    );
    if (e !== "") {
      let filteredItems = orignalItems.filter((item) => {
        return (
          (primaryConditionKey &&
            item?.[primaryConditionKey + ""]
              ?.toLowerCase()
              ?.includes(e.toLowerCase())) ||
          (secondaryConditionKey &&
            item?.[secondaryConditionKey + ""]
              ?.toLowerCase()
              ?.includes(e.toLowerCase()))
        );
      });
      setCurrentItems(filteredItems);
    } else {
      setCurrentItems(orignalItems);
    }
  };
  return (
    <div className="searchbarContainer">
      <input
        type="text"
        placeholder={placeholder ? placeholder : "Search"}
        onChange={(e) => {
          filterSelection(e.target.value);
        }}
      />
      <BsSearch className="icon" />
    </div>
  );
}

export default Searchbar;
