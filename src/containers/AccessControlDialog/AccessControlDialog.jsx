import { DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import "./AccessControlDialog.scss";
import { useForm } from "react-hook-form";
import {
  conditionChains,
  contractType,
  comparators,
} from "../../utils/config/accessControlConfig";
import { addressValidator } from "../../utils/services/filedeploy";

function AccessControlDialog({
  setCurrentCondition,
  setAccessControlDialog,
  currentCondition,
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const form = useRef();
  const [showTokenID, setShowTokenID] = useState(false);

  const onSubmit = (data) => {
    data["returnValueTest"] = {
      comparator: data["comparator"],
      value: data["value"],
    };
    let temp = data["parameters"];
    data["parameters"] =
      data["standardContractType"] === "ERC1155"
        ? [temp, data["tokenID"]]
        : [temp];
    delete data["comparator"];
    delete data["value"];
    data["tokenID"] && delete data["tokenID"];
    console.log("DATA SEND BY DIALOG", data);
    setCurrentCondition(data);
    setAccessControlDialog(false);
  };

  useEffect(() => {
    reset({ method: "balanceOf", parameters: ":userBalance" });
    const subscription = watch((value, { name, type }) => {
      value["standardContractType"] === "ERC1155"
        ? setShowTokenID(true)
        : setShowTokenID(false);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <div className="AccessControlDialog">
      <DialogTitle>{`Add Access Condition`}</DialogTitle>
      <DialogContent>
        <div className="AccessForm">
          <form ref={form} className="form" onSubmit={handleSubmit(onSubmit)}>
            <div className="fieldContainer">
              <div className="fieldContainer__title">Chain</div>
              <select
                className={errors.chain ? "errorInput" : ""}
                {...register("chain", { required: true })}
              >
                {conditionChains.map((chain) => (
                  <option value={chain}>{chain}</option>
                ))}
              </select>
              {errors.chain && (
                <span className="fieldContainer__error">
                  This field is required
                </span>
              )}
            </div>
            <div className="fieldContainer">
              <div className="fieldContainer__title">Contract Type</div>
              <select
                className={errors.standardContractType ? "errorInput" : ""}
                {...register("standardContractType", { required: true })}
              >
                {contractType.map((type, key) => (
                  <option key={key} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.standardContractType && (
                <span className="fieldContainer__error">
                  This field is required
                </span>
              )}
            </div>
            <div className="fieldContainer">
              <div className="fieldContainer__title">Method</div>
              <input
                type="text"
                placeholder="Method"
                disabled={true}
                className={errors.method ? "errorInput" : ""}
                {...register("method", { required: true })}
              />
              {errors.method && (
                <span className="fieldContainer__error">
                  This field is required
                </span>
              )}
            </div>
            <div className="fieldContainer">
              <div className="fieldContainer__title">Contract Address</div>
              <input
                type="text"
                placeholder="Contract Address"
                className={errors.contractAddress ? "errorInput" : ""}
                {...register("contractAddress", {
                  required: true,
                  validate: addressValidator,
                })}
              />
              {errors.contractAddress &&
                errors.contractAddress.type === "required" && (
                  <span className="fieldContainer__error">
                    This field is required
                  </span>
                )}
              {errors.contractAddress &&
                errors.contractAddress.type === "validate" && (
                  <span className="fieldContainer__error">
                    Enter Valid Contract Address
                  </span>
                )}
            </div>

            <div style={{ display: "flex" }}>
              <div style={{ width: "50%", paddingRight: "5px" }}>
                <div className="fieldContainer">
                  <div className="fieldContainer__title">Comparator</div>
                  <select
                    className={errors.comparator ? "errorInput" : ""}
                    {...register("comparator", { required: true })}
                  >
                    {comparators.map((type, key) => (
                      <option key={key} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.comparator && (
                    <span className="fieldContainer__error">
                      This field is required
                    </span>
                  )}
                </div>
              </div>
              <div style={{ width: "50%", paddingLeft: "5px" }}>
                <div className="fieldContainer">
                  <div className="fieldContainer__title">value</div>
                  <input
                    type="number"
                    placeholder="Value"
                    className={errors.value ? "errorInput" : ""}
                    {...register("value", {
                      required: true,
                      pattern: {
                        value: /^(0|[1-9]\d*)(\.\d+)?$/,
                      },
                    })}
                  />

                  {errors.value && (
                    <span className="fieldContainer__error">
                      This field is required
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="fieldContainer">
              <div className="fieldContainer__title">Parameter</div>
              <input
                type="text"
                placeholder="Parameter"
                disabled={true}
                className={errors.parameters ? "errorInput" : ""}
                {...register("parameters")}
              />
              {errors.parameters && (
                <span className="fieldContainer__error">
                  This field is required
                </span>
              )}
            </div>
            {showTokenID && (
              <div className="fieldContainer">
                <div className="fieldContainer__title">Token ID</div>
                <input
                  type="number"
                  placeholder="Parameter"
                  className={errors.tokenID ? "errorInput" : ""}
                  {...register("tokenID", {
                    required: true,
                    pattern: {
                      value: /^(0|[1-9]\d*)(\.\d+)?$/,
                    },
                  })}
                />
                {errors.tokenID && (
                  <span className="fieldContainer__error">
                    This field is required
                  </span>
                )}
              </div>
            )}
            <button className="btn ptr" type="submit">
              Create Access Condition
            </button>
          </form>
        </div>
      </DialogContent>
    </div>
  );
}

export default AccessControlDialog;
