import { Dialog } from '@material-ui/core';
import React, { useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import AccessControlDialog from '../../../containers/AccessControlDialog/AccessControlDialog';
import './AccessControl.scss';







function AccessControl() {
    const { cid } = useParams();
    const [isAccessControlDialog, setAccessControlDialog] = useState(false);
    const [accessConditions, setAccessConditions] = useState([]);
    // const { state } = useLocation();

    console.log(cid, 'CID Access Control')
    return (
        <div div className="AccessControl" >
            <div className="uploadNew__title">
                <p>Access Control</p>
                <button onClick={() => { setAccessControlDialog(true) }} className="fillBtn__blue ptr">
                    Add Condition
                </button>
            </div>

            <div className="uploadNew__content">

            </div>

            <Dialog
                open={isAccessControlDialog}
                onClose={() => {
                    setAccessControlDialog(false);
                }}
            >
                <AccessControlDialog
                    setAccessControlDialog={setAccessControlDialog}
                    accessConditions={accessConditions}
                    setAccessConditions={setAccessConditions} />
            </Dialog>
        </div>
    )
}

export default AccessControl