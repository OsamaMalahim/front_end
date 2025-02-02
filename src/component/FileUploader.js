import axios from "axios";
import { useState } from "react";
require("../index.css")

export default function FileUploader() {

    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("idle");
    const [uploadProgress, setUploadProgress] = useState(0);

    function handleFileChange(e) {
        console.log(e.target.files);
        if (e.target.files) {
            setFile(e.target.files[0]);
            setUploadProgress(0);
            setStatus("idle");
        }
    }

    async function handleFileUpload() {
        if (!file) {
           setStatus("idle")
            return;
        }
        setStatus("uploading");

        const formData = new FormData();
        formData.append("file", file);

        try {
            await axios.post("http://localhost:3001/uploadFile", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'file-name': file.name
                },
                onUploadProgress: (ProgressEvent) => {
                    // console.log(ProgressEvent.loaded);
                    // console.log(ProgressEvent.total);
                    let progress = Math.round(ProgressEvent.loaded * 100) / ProgressEvent.total;
                    setUploadProgress(progress.toFixed(1));
                    console.log(progress)
                    // console.log(uploadProgress)
                }
            })

            setStatus("success")
            setUploadProgress(100)
        } catch (error) {
            setStatus("error")
            setUploadProgress(0)
        }

    }

    return (
        <div>
        <h3>Upload Vedio Program</h3>
            <input type="file" onChange={handleFileChange} />
            {file &&
                <div>
                    <p>File Name: {file.name}</p>
                    <p>File Size: {(file.size / (1024 * 1024)).toFixed(2)} MB </p>
                    <p>File Type: {file.type}</p>

                </div>
            }
            {file && status !== "uploading" && <button onClick={handleFileUpload}>Upload</button>
            }

            {status === "uploading" && (
                <div>
                    <h3>{uploadProgress} % uploaded</h3>
                    <div className="progressBar" style={{ width: `${uploadProgress}%` }}> </div>
                </div>
            )
            }

            {status === "success" && (
                <p>file uploading successfully !</p>
            )}

            {status === "error" && (
                <p>error occurred !</p>
            )}
        </div>
    )
}