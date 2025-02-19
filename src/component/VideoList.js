import React, { useState } from "react";
import Modal from "../Modal";
import axios from "axios";
import "../App.css";
// import path from "n"

export default function VideoList(props) {
  // Modal useState
  const [open, setOpen] = useState(false);
  // extract adudio button

  // State to manage the text for each button
  const [buttonStates, setButtonStates] = useState({}); // Extract, Download, Processing

  const vedioList = props.vList;
  console.log("below is vedio list", vedioList);

  function extractAudioClick(id, vedName) {
    // add condition here if audio = Extract || Download || Processing
    console.log("id is : ", id);

    setButtonStates((prevStates) => {
      const currentState = prevStates[id] || "Extract Audio"; // Default to 'Extract Audio' if no state exists
      let nextState;
      if (currentState === "Extract Audio") {
        nextState = "Processing";
        //now update state through API Call
        axios
          .post(
            "http://localhost:5112/extractAudio",
            { vedioId: id },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
            console.log("response for extracting data", response.data);
            if (response.status === 200) {
              console.log("response 200");
              setButtonStates((prev) => ({ ...prev, [id]: "Download Audio" }));
            }
          })
          .catch((error) => {
            console.log("error in extract audio", error);
            console.log("reach 500");
            setButtonStates((prev) => ({ ...prev, [id]: "Extract Audio" }));
          });
      } else if (currentState === "Download Audio") {
        nextState = "Download Audio";
        console.log("its download");
        //api to ask backend to download that specific file id
        console.log(id);
        try {
          axios
            .get(`http://localhost:5112/${id}`, {
              responseType: "blob",
            })
            .then((response) => {
              if (response.status === 200) {
                // Create a blob from the response data
                const blob = new Blob([response.data], { type: "audio/mpeg" });
                // Create a link element
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                // prepare file name
                const fileName = vedName;
                const nameWithoutExtension = fileName.split(".")[0];
                console.log(nameWithoutExtension); // Output: 'baby'
                link.download = `${nameWithoutExtension}.mp3`; // Specify the default filename
                document.body.appendChild(link);
                link.click(); // Trigger the download
                document.body.removeChild(link); // Clean up
              }
            })
            .catch((error) => {
              console.log("error in downloading audio");
            });
        } catch (error) {
          console.error("Error downloading the file:", error);
        }
      } else {
        nextState = currentState; // Keep the current state if it's 'Processing'
      }
      return {
        ...prevStates,
        [id]: nextState,
      };
    });
  } // end function

  // Function to get the button class based on its state
  const getButtonClass = (state) => {
    switch (state) {
      case "Download":
        return "button download";
      case "Processing":
        return "button processing";
      case "Extract Audio":
        return "button extract";
      default:
        return "button download";
    }
  };

  return (
    <div className="All-Vid-List">
      {vedioList.map((vedio) => {
        // Convert the Base64 image string to a data URL
        const imageSrc = `data:image/jpg;base64,${vedio.thumb}`;

        return (
          <div key={vedio.id}>
            <div className="vid">
              <div className="image-container">
                <img src={imageSrc} width="50" height="50" alt="just thumb" />
                <p>{vedio.Name}</p>
                <p>{vedio.Size} MB</p>
              </div>
              <div className="right-items">
                <button
                  className="button download"
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  Resize
                </button>
                <button
                  className={getButtonClass(buttonStates[vedio.id])}
                  onClick={() => {
                    extractAudioClick(vedio.id, vedio.Name);
                  }}
                >
                  {/* {vedio.audio ? "Download Audio" : "Extract Audio"} */}
                  {buttonStates[vedio.id] || "Extract Audio"}
                </button>
                <button className="button download">Download</button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Modal Here */}
      <Modal openStatus={open} closeModal={() => setOpen(false)} />
    </div>
  );
}
