import axios from "axios";
import { useState } from "react";
require("../index.css");

export default function FileUploader(props) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [uploadProgress, setUploadProgress] = useState(0);

  function handleFileChange(e) {
    console.log(e.target.files);
    if (e.target.files) {
      setFile(e.target.files[0]);
      setUploadProgress(0);
      setStatus("idle");
      props.updateVideoList(false);
    }
  }

  async function handleFileUpload() {
    if (!file) {
      setStatus("idle");
      return;
    }
    setStatus("uploading");

    try {
      // Create a ReadableStream from the file using the FileReader API
      // otherwise the whole file will be loaded to browser memory then transferred via web
      const reader = new FileReader();

      //sdf
      // Read the file as an ArrayBuffer
      reader.readAsArrayBuffer(file);

      // Wait for the file to be read
      reader.onload = async () => {
        const arrayBuffer = reader.result;
        // Send the file as binary data using Axios
        const response = await axios.post(
          "http://localhost:5112/uploadFile",
          arrayBuffer,
          {
            headers: {
              "Content-Type": "application/octet-stream",
              "X-File-Name": file.name, // Optional: Send the original file name
            },
            onUploadProgress: (ProgressEvent) => {
              let progress =
                Math.round(ProgressEvent.loaded * 100) / ProgressEvent.total;
              setUploadProgress(progress.toFixed(1));
              console.log(progress);
            },
          }
        );
        setStatus("success");
        setUploadProgress(100);
        props.updateVideoList(true);

        if (response.status === 200) {
          alert("File uploaded successfully!");
        }
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        alert("Error reading file.");
      };
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("File upload failed.");
    } finally {
      setStatus("uploading");
    }
  }

  return (
    <div>
      <h3>Upload Vedio Program</h3>
      <input type="file" onChange={handleFileChange} />
      {file && (
        <div>
          <p>File Name: {file.name}</p>
          <p>File Size: {(file.size / (1024 * 1024)).toFixed(2)} MB </p>
          <p>File Type: {file.type}</p>
        </div>
      )}
      {file && status !== "uploading" && (
        <button onClick={handleFileUpload}>Upload</button>
      )}

      {status === "uploading" && (
        <div>
          <h3>{uploadProgress} % uploaded</h3>
          <div className="progressBar" style={{ width: `${uploadProgress}%` }}>
            {" "}
          </div>
        </div>
      )}

      {status === "success" && <p>file uploading successfully !</p>}

      {status === "error" && <p>error occurred !</p>}
    </div>
  );
}
