import React, { useEffect, useState } from "react";
import FileUploader from "./component/FileUploader";
import VideoList from "./component/VideoList"; 
import axios from "axios";

function App() {
	
  const [vidList, setVidList] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const updateVideoList = (newUpdate)=>{
    setRefresh(newUpdate);
  }


	// upon first page load all video list from node backend
	
  useEffect(() => {
    console.log('useEffect runs ...')

		//hit root / to get all vid list
    axios.get("http://localhost:3001/")
      .then(response => {
        setVidList(response.data.data);         
      })
      .catch(error => {        
        alert('failed to load Vedio List')
        console.log(error.message)
      })
  }, [refresh]);



	return (
		<div className="App">
			<FileUploader updateVideoList= {updateVideoList} />
			<VideoList vList = {vidList} />
		</div>
	);
}

export default App;
