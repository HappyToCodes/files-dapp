import { Dialog } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import ToggleButton from "../../../components/ToggleButton/ToggleButton";
import AccessControlDialog from "../../../containers/AccessControlDialog/AccessControlDialog";
import { createAccessControl } from "../../../utils/services/filedeploy";
import "./AccessControl.scss";

function AccessControl() {
  const { cid } = useParams();

  const [isAccessControlDialog, setAccessControlDialog] = useState(false);
  const [currentCondition, setCurrentCondition] = useState(null);
  const [isCustomAggregator, setCustomAggregator] = useState(false);
  const [allConditions, setAllConditions] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const form = useRef();

  useEffect(() => {
    let condition = { ...currentCondition };
    let conditionArr = [...allConditions];
    if (condition["id"]) {
    }
    if (condition["chain"] && !condition["id"]) {
      condition["id"] = allConditions.length + 1;
      conditionArr.push(condition);
      setAllConditions(conditionArr);
    }

    console.log(allConditions);
  }, [currentCondition]);

  const onSubmit = async (data) => {
    console.log("Form DATA", data);
    let aggregator = "";
    if (!isCustomAggregator) {
      if (
        data["condition1"] &&
        data["condition2"] !== "none" &&
        data["operator"] !== "none"
      ) {
        aggregator = `([${data["condition1"]}] ${data["operator"]} [${data["condition2"]}])`;
      } else {
        aggregator = `([${data["condition1"]}])`;
      }
    } else {
      aggregator = data["aggregator"];
    }
    console.log(allConditions, aggregator);
    aggregator = JSON.stringify(aggregator);

    let response = await createAccessControl(cid, allConditions, aggregator);

    console.log(response);
  };

  return (
    <div div className="AccessControl">
      <div className="AccessControl__title">
        <p>Access Control</p>
        <button
          onClick={() => {
            setAccessControlDialog(true);
          }}
          className="fillBtn__blue ptr"
        >
          Add Condition
        </button>
      </div>

      <div className="AccessControl__content">
        <div className="conditionsContainer">
          All Conditions
          <hr />
          <div className="cardContainer">
            {allConditions.map((condition, key) => (
              <div className="card" key={key}>{`C${condition.id}`}</div>
            ))}
          </div>
        </div>

        {allConditions.length > 0 && (
          <>
            <div className="aggregatorContainer">
              <div className="aggregatorContainer__title">
                <p>Create Aggregator</p>
                <ToggleButton
                  setTrue={setCustomAggregator}
                  isTrue={isCustomAggregator}
                  trueValue={"Custom <br/> ON"}
                  falseValue={"Custom <br/> OFF"}
                  type={""}
                />
              </div>

              <hr />
              <form
                ref={form}
                className="form"
                onSubmit={handleSubmit(onSubmit)}
              >
                {isCustomAggregator ? (
                  <div style={{ width: "100%" }}>
                    <div className="fieldContainer">
                      <input
                        type="text"
                        placeholder="Custom Aggregator"
                        className={errors.aggregator ? "errorInput" : ""}
                        {...register("aggregator", { required: true })}
                      />
                      {errors.aggregator && (
                        <span className="fieldContainer__error">
                          This field is required
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex" }}>
                    <div
                      className="fieldContainer"
                      style={{ flex: "1", padding: "0px 5px" }}
                    >
                      <select
                        className={errors.condition1 ? "errorInput" : ""}
                        {...register("condition1", { required: true })}
                      >
                        {allConditions.map((condition, key) => (
                          <option
                            key={key}
                            value={`${condition.id}`}
                          >{`C${condition.id}`}</option>
                        ))}
                      </select>
                      {errors.condition1 && (
                        <span className="fieldContainer__error">
                          This field is required
                        </span>
                      )}
                    </div>
                    <div
                      className="fieldContainer"
                      style={{ flex: "1", padding: "0px 5px" }}
                    >
                      <select
                        className={errors.operator ? "errorInput" : ""}
                        {...register("operator", { required: true })}
                      >
                        <option value="none">None</option>
                        <option value="and">& (AND)</option>
                        <option value="or">|| (OR)</option>
                      </select>
                    </div>
                    <div
                      className="fieldContainer"
                      style={{ flex: "1", padding: "0px 5px" }}
                    >
                      <select
                        className={errors.condition2 ? "errorInput" : ""}
                        {...register("condition2")}
                      >
                        <option value={"none"}>None</option>
                        {allConditions.map((condition, key) => (
                          <option
                            key={key}
                            value={`${condition.id}`}
                          >{`C${condition.id}`}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <button
                  className="fillBtn__blue ptr"
                  style={{
                    margin: "0",
                    width: "100%",
                  }}
                  type="submit"
                >
                  Create Access Condition
                </button>
              </form>
            </div>
          </>
        )}
      </div>

      <Dialog
        open={isAccessControlDialog}
        onClose={() => {
          setAccessControlDialog(false);
        }}
      >
        <AccessControlDialog
          setAccessControlDialog={setAccessControlDialog}
          setCurrentCondition={setCurrentCondition}
          currentCondition={currentCondition}
        />
      </Dialog>
    </div>
  );
}

export default AccessControl;
