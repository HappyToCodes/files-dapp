import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./FilePreview.scss";
import FileViewer from "react-file-viewer";
import { BiDownload } from "react-icons/bi";

import { IoArrowBackOutline } from "react-icons/io5";
import { downloadFileFromURL } from "../../utils/services/other";
import History from "../../utils/services/GlobalNavigation/navigationHistory";
import { useState } from "react";
import { MdErrorOutline } from "react-icons/md";
import axios from "axios";
import { baseUrl } from "../../utils/config/urls";


function FilePreview() {
    const { id } = useParams();
    const { state } = useLocation();
    const [fileInfo, setFileInfo] = useState(undefined);
    const [fileType, setFileType] = useState(undefined);
    const [isEncrypted, setIsEncrypted] = useState(false);
    const [isUnSupportedType, setIsUnSupportedType] = useState(false);

    useEffect(() => {
        console.log(id, state);
        state?.fileName ? setFileInfo(state) : History.navigate('/dashboard');
        state?.encryption === 'true' && setIsEncrypted(true);

        (async () => {
            await getInfo();
        })()

        setFileType(state?.fileName.split('.').pop());
    }, []);

    const getInfo = async () => {
        const info = axios.get(`${baseUrl}/api/lighthouse/file_info?cid=${id}`)
        console.log(info);
    }


    return (
        <div className="filePreviewContainer">
            <div className="header">
                <div className="logoContainer">
                    <span className="ptr" onClick={() => { History.navigate('/dashboard') }}>
                        <IoArrowBackOutline />
                    </span>
                    &nbsp; |
                    <img src="/logo.png" alt="" />
                    <p>Lighthouse</p>
                </div>
                <div className="iconsContainer">
                    {fileInfo?.fileName} &nbsp; | &nbsp;{" "}
                    <span
                        className="ptr"
                        onClick={() => {
                            downloadFileFromURL(`https://gateway.lighthouse.storage/ipfs/${id}`, fileInfo?.fileName);
                        }}
                    >
                        <BiDownload />
                    </span>
                </div>
            </div>
            <div className="body">
                {
                    isUnSupportedType ? <div className="unsupportedContainer">
                        <MdErrorOutline />
                        <p>File Type Not Supported
                            <br />
                            <span>Download File</span>
                        </p>
                    </div> : <FileViewer
                        fileType={fileType}
                        filePath={
                            `https://gateway.lighthouse.storage/ipfs/${id}`
                        }
                        onError={() => {
                            console.log("--");
                        }}
                    />
                }

            </div>
        </div>
    );
}

export default FilePreview;
