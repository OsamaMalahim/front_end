import React, { useState, useEffect } from "react";
import Modal from "../Modal";
import axios from "axios";
import "../App.css";

export default function VideoList(props) {
  // Modal useState
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [buttonStates1, setButtonStates1] = useState({});

  // State to manage the text for each button
  const [buttonStates, setButtonStates] = useState({}); // Extract, Download, Processing

  const vedioList = props.vList;
  console.log("below is vedio list", vedioList);

  // Update Audio label [Extract Audio, Download Audio, Processing]
  useEffect(() => {
    const newButtonStates1 = {};
    vedioList.forEach((vedio) => {
      if (vedio.audio) {
        newButtonStates1[vedio.id] = "Download Audio";
      }
    });
    setButtonStates1(newButtonStates1);
  }, [vedioList]); // Only run this effect when vedioList changes

  function extractAudioClick(id, vedName) {
    // add condition here if audio = Extract || Download || Processing
    console.log("id is : ", id);

    setButtonStates1((prevStates) => {
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
              setButtonStates1((prev) => ({ ...prev, [id]: "Download Audio" }));
            }
          })
          .catch((error) => {
            console.log("error in extract audio", error);
            console.log("reach 500");
            setButtonStates1((prev) => ({ ...prev, [id]: "Extract Audio" }));
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

  // Function ...extract audio ... to get the button class based on its state
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

  // Function download vedio click handler

  function downloadVedioHandler(id, vedName) {
    try {
      axios
        .get(`http://localhost:5112/vedio/${id}`, {
          responseType: "blob",
        })
        .then((response) => {
          if (response.status === 200) {
            // create blob from response data
            const blob = new Blob([response.data], { type: "video/mp4" });
            //create link element
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = vedName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        });
    } catch (error) {
      console.log("error in downloading audio", error);
    }
  }

  return (
    <div className="All-Vid-List">
      {vedioList.map((vedio) => {
        // thumb baby.jpg from baby.mp4
        // regexp /\.[^/.]+$/ convert any extension to .jpg
        const thumbFile = vedio.Name.replace(/\.[^/.]+$/, ".jpg");
        return (
          <div key={vedio.id}>
            <div className="vid">
              <div className="image-container">
                <img
                  src={`http://localhost:5112/thumb/${thumbFile}`}
                  width="50"
                  height="50"
                  alt="thumb"
                />
                <p>{vedio.Name}</p>
                <p>{vedio.resolution}</p>
                <p>{Math.floor(Number(vedio.Size) / (1024 * 1024))} MB</p>
              </div>
              <div className="right-items">
                <button
                  className="button download"
                  onClick={() => {
                    setOpen(true);
                    setFileName(vedio.Name);
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
                  {buttonStates1[vedio.id] || "Extract Audio"}
                  {/* {buttonStates[vedio.id] || "Extract Audio"} */}
                </button>
                <button
                  className="button download"
                  onClick={() => {
                    downloadVedioHandler(vedio.id, vedio.Name);
                  }}
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Modal Here */}
      <Modal
        fileName={fileName}
        openStatus={open}
        closeModal={() => setOpen(false)}
      />
    </div>
  );
}
