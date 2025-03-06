import React, { useEffect, useState } from "react";
import FileUploader from "./component/FileUploader";
import VideoList from "./component/VideoList";
import axios from "axios";

function App() {
  const [vidList, setVidList] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const updateVideoList = (newUpdate) => {
    setRefresh(newUpdate);
  };

  // upon first page load all video list from node backend

  useEffect(() => {
    console.log("useEffect runs ...");

    async function fetchVedioList() {
      await axios
        .get("http://localhost:5112/")
        .then((response) => {
          setVidList(response.data.data);
        })
        .catch((error) => {
          alert("failed to load Vedio List");
          console.log(error.message);
        });

      // await axios
      //   .get("http://localhost:5112/thumb")
      //   .then((response) => {
      //     console.log(response.data); // get image list in array
      //   })
      //   .catch((error) => {
      //     console.log(error.message);
      //   });
    }
    fetchVedioList();
    //hit root / to get all vid list
  }, [refresh]);

  return (
    <div className="App">
      <FileUploader updateVideoList={updateVideoList} />
      <VideoList vList={vidList} />
    </div>
  );
}

export default App;
