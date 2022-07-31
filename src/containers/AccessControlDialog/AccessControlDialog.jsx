import { DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import React, { useState } from 'react'
import "./AccessControlDialog.scss"
function AccessControlDialog({ setAccessConditions, accessConditions, setAccessControlDialog }) {


    const [conditionData, setConditionData] = useState(
        {
            id: 2,
            chain: "OptimismKovan",
            method: "balanceOf",
            standardContractType: "ERC20",
            contractAddress: "0x7f5c764cbc14f9669b88837ca1490cca17c31607",
            returnValueTest: { comparator: ">=", value: "0" },
            parameters: [":userAddress"],
        }
    );


    return (
        <div className="AccessControlDialog">
            <DialogTitle>{`Add Access Condition`}</DialogTitle>
            <DialogContent>
                <div className="AccessForm">
                    <div className="fieldContainer">
                        <div className="fieldContainer__title">Chain</div>
                        <select name="chain" id="chain" value={conditionData.chain} onChange={(e) => { setConditionData(conditionData.chain = e.target.value) }}>
                            <option value="OptimismKovan">OptimismKovan</option>
                            <option value="FantomTest">FantomTest</option>
                        </select>
                    </div>
                    <div className="fieldContainer">
                        <div className="fieldContainer__title">Contract Type</div>
                        <select name="contractType" id="contractType">
                            <option value="ERC20">ERC20</option>
                        </select>
                    </div>
                    <div className="fieldContainer">
                        <div className="fieldContainer__title">Method</div>
                        <select name="contractType" id="contractType">
                            <option value="balanceOf">balanceOf</option>
                        </select>

                    </div>
                    <div className="fieldContainer">
                        <div className="fieldContainer__title">Contract Address</div>
                        <input type="text" placeholder='Item Name' />
                    </div>

                    <div style={{ display: "flex" }}>
                        <div style={{ width: "50%", paddingRight: "5px" }}>
                            <div className="fieldContainer">
                                <div className="fieldContainer__title">Comparator</div>
                                <select name="contractType" id="contractType">
                                    <option value=">=">{'>='}</option>
                                    <option value="<=">{'<='}</option>
                                    <option value="==">{'=='}</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ width: "50%", paddingLeft: '5px' }}>
                            <div className="fieldContainer">
                                <div className="fieldContainer__title">value</div>
                                <input type="text" placeholder='Item Name' />
                            </div>
                        </div>

                    </div>

                    <div className="fieldContainer">
                        <div className="fieldContainer__title">Parameter</div>
                        <input type="text" placeholder='Item Name' />
                    </div>



                </div>
            </DialogContent>
            <DialogActions>
                <div className="ActionContainer">
                    <button
                        className="btn ptr"
                        onClick={() => { console.log(conditionData) }}
                    >
                        Create Access Condition
                    </button>

                </div>

            </DialogActions>
        </div>
    )
}

export default AccessControlDialog