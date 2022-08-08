import { Dialog, Popover } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import AccessControlDialog from "../../../containers/AccessControlDialog/AccessControlDialog";
import "./AccessControl.scss";

function AccessControl() {
  const { cid } = useParams();

  const [isAccessControlDialog, setAccessControlDialog] = useState(false);
  const [currentCondition, setCurrentCondition] = useState(null);
  const [inputTerm, setInputTerm] = useState("");
  const [allConditions, setAllConditions] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
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
            {allConditions.map((condition) => (
              <div className="card">{`C${condition.id}`}</div>
            ))}
          </div>
        </div>

        <div className="aggregatorContainer">
          Create Aggregator
          <hr />
          <form ref={form} className="form" onSubmit={handleSubmit()}>
            <div style={{ display: "flex" }}>
              <div
                className="fieldContainer"
                style={{ flex: "1", padding: "0px 5px" }}
              >
                <select
                  className={errors.chain ? "errorInput" : ""}
                  {...register("chain", { required: true })}
                >
                  <option value="OptimismKovan">OptimismKovan</option>
                  <option value="FantomTest">FantomTest</option>
                </select>
                {errors.chain && (
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
                  className={errors.chain ? "errorInput" : ""}
                  {...register("chain", { required: true })}
                >
                  <option value="OptimismKovan">OptimismKovan</option>
                  <option value="FantomTest">FantomTest</option>
                </select>
                {errors.chain && (
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
                  className={errors.chain ? "errorInput" : ""}
                  {...register("chain", { required: true })}
                >
                  <option value="OptimismKovan">OptimismKovan</option>
                  <option value="FantomTest">FantomTest</option>
                </select>
                {errors.chain && (
                  <span className="fieldContainer__error">
                    This field is required
                  </span>
                )}
              </div>
            </div>

            <button className="btn ptr" type="submit">
              Create Access Condition
            </button>
          </form>
        </div>
        <div className="aggregatorCustomContainer">
          Create Custom Aggregator
          <hr />
          <div className="input-box">
            <input
              type="text"
              placeholder="Aggregator"
              value={inputTerm}
              onChange={(e) => setInputTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              setAccessControlDialog(true);
            }}
            className="fillBtn__blue ptr"
          >
            Apply Access Control
          </button>
        </div>
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
