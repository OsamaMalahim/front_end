import React, { useState } from "react";

export default function Modal(props) {
  const [videoName, setVideoName] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  //   setVideoName(props.fileName);
  if (!props.openStatus) {
    return <></>;
  }
  ///
  const handleSubmit = async (e) => {
    e.preventDefault();

    const videoData = {
      videoName,
      width: parseInt(width),
      height: parseInt(height),
    };

    try {
      const response = await fetch("http://localhost:5112/api/resizeVideo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(videoData),
      });

      if (response.ok) {
        console.log("Video data sent successfully");
      } else {
        console.error("Failed to send video data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  function handleClose() {
    props.closeModal();
    setWidth(0);
    setHeight(0);
  }

  return (
    <div className="Modal-Background">
      <button className="btn-close" onClick={handleClose}>
        X close
      </button>
      <h2>Resize {props.fileName} </h2>
      <p>specify new width and height :</p>
      <form onSubmit={handleSubmit}>
        <div className="Modal-input">
          <input
            type="text"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            placeholder="width"
            required
          ></input>
          <p>X</p>
          <input
            type="text"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="height"
            required
          ></input>
          <button
            type="submit"
            onClick={() => {
              setVideoName(props.fileName);
            }}
          >
            Resize
          </button>
        </div>
      </form>
      <div className="modal-btn">
        <button className="btn-cancel" onClick={handleClose}>
          cancel
        </button>
      </div>
      <div>
        <h4>Your Resizes</h4>
      </div>
      <div className="Modal-Resizes">
        <p>you have not resize this vedio yet</p>
      </div>
    </div>
  );
}
