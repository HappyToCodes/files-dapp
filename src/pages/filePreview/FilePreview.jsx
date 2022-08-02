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
import { decryptEncryptedFile } from "../../utils/services/filedeploy";


function FilePreview() {
    const { id } = useParams();
    const { state } = useLocation();
    const [fileType, setFileType] = useState(undefined);
    const [fileInfo, setFileInfo] = useState(undefined);
    const [fileURL, setFileURL] = useState(undefined);
    const [isUnSupportedType, setIsUnSupportedType] = useState(false);

    useEffect(() => {
        (async () => {
            let info = await getInfo();
            info?.cid ? setFileInfo(info) : History.navigate('/dashboard');
            info?.encryption === 'true' ? setFileURL(await getDecryptedFileURL(info?.cid)) : setFileURL(`https://gateway.lighthouse.storage/ipfs/${id}`)
            setFileType(info?.fileName.split('.').pop());
        })()
    }, []);

    const getDecryptedFileURL = async (cid) => {
        let blob = await decryptEncryptedFile(cid)
        console.log(blob);
        const url = URL.createObjectURL(blob);
        console.log(url);
        return url
    }


    const getInfo = async () => {
        const info = await axios.get(`${baseUrl}/api/lighthouse/file_info?cid=${id}`)
        return info['data'];
    }


    return (
        <div className="filePreviewContainer">
            {
                fileURL && <>
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
                                className="ptr fillBtn__blue"
                                onClick={() => {
                                    downloadFileFromURL(fileURL, fileInfo?.fileName);
                                }}
                            > Download &nbsp;
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
                                filePath={fileURL}
                                onError={() => { }}
                            />
                        }

                    </div>
                </>
            }

        </div>
    );
}

export default FilePreview;
