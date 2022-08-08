import { DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import React, { useRef, useState } from "react";
import "./AccessControlDialog.scss";
import { useForm } from "react-hook-form";
import {
  conditionChains,
  contractType,
} from "../../utils/config/accessControlConfig";

function AccessControlDialog({
  setCurrentCondition,
  setAccessControlDialog,
  currentCondition,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const form = useRef();

  const onSubmit = (data) => {
    console.log(data);
    data["returnValueTest"] = {
      comparator: data["comparator"],
      value: data["value"],
    };
    delete data["comparator"];
    delete data["value"];
    setCurrentCondition(data);
    setAccessControlDialog(false);
    console.log(data);
  };

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
                {...register("contractAddress", { required: true })}
              />
              {errors.contractAddress && (
                <span className="fieldContainer__error">
                  This field is required
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
                    <option value=">=">{">="}</option>
                    <option value="<=">{"<="}</option>
                    <option value="==">{"=="}</option>
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
                    {...register("value", { required: true })}
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
                className={errors.parameters ? "errorInput" : ""}
                {...register("parameters", { required: true })}
              />
              {errors.parameters && (
                <span className="fieldContainer__error">
                  This field is required
                </span>
              )}
            </div>
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
