import { DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import React from 'react'
function AccessControlDialog({ setAccessConditions, accessConditions, setAccessControlDialog }) {
    return (
        <div className="AccessControlDialog">
            <DialogTitle>{`Add Access Condition`}</DialogTitle>
            <DialogContent>
                <div className="AccessForm">
                    <div className="wrapper">
                        <label htmlFor="">Type</label>
                        <input
                            type="text"
                            placeholder="Enter CID | eg. QmNYeP41TMqN...........94b8nYHM"
                            onInput={(e) => { }}
                        />
                    </div>

                    <input
                        type="text"
                        placeholder="Enter File Name"
                        onInput={(e) => { }}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <div className="ActionContainer">
                    <button
                        className="btn"
                        onClick={() => { }}
                    >
                        Upload
                    </button>

                </div>

            </DialogActions>
        </div>
    )
}

export default AccessControlDialog