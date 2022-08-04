import { Dialog } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import {  useParams } from 'react-router-dom';
import AccessControlDialog from '../../../containers/AccessControlDialog/AccessControlDialog';
import './AccessControl.scss';







function AccessControl() {
    const { cid } = useParams();
    // let allConditions = [];
    const [isAccessControlDialog, setAccessControlDialog] = useState(false);
    const [currentCondition, setCurrentCondition] = useState(null);
    const [inputTerm, setInputTerm] = useState('')
    const [allConditions, setAllConditions] = useState([])

    useEffect(() => {
        let condition = { ...currentCondition }
        let conditionArr = [ ...allConditions ]       
        if (condition['id']) {

        } 
        if(condition['chain'] && !condition['id']){
            condition['id'] = allConditions.length+1;
            conditionArr.push(condition);
            setAllConditions(conditionArr);
        }


        console.log(allConditions);



    }, [currentCondition])



    return (
        <div div className="AccessControl" >
            <div className="AccessControl__title">
                <p>Access Control</p>
                <button onClick={() => { setAccessControlDialog(true) }} className="fillBtn__blue ptr">
                    Add Condition
                </button>
            </div>

            <div className="AccessControl__content">

                <div className="conditionsContainer">
                    All Conditions
                    <hr />
                    <div className="cardContainer">
                        {
                            allConditions.map((condition) => <div className="card">
                                {`C${condition.id}`}
                            </div>)
                        }

                    </div>
                </div>


                <div className="aggregatorContainer">
                    Create Aggregator
                    <hr />

                    <div className="input-box">

                        {/* <input type="text" placeholder="Aggregator" value={inputTerm} onChange={(e) => setInputTerm(e.target.value)} /> */}

                    </div>
                    <button onClick={() => { setAccessControlDialog(true) }} className="fillBtn__blue ptr">
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
    )
}

export default AccessControl