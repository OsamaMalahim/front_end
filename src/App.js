import React, { useEffect, useState } from "react";
import FileUploader from "./component/FileUploader";
import VideoList from "./component/VideoList"; 
import axios from "axios";

function App() {
	// array to handle all notes
  const [vidList, setVidList] = useState([])

	// upon first page load all video list from node backend
	
  useEffect(() => {
    console.log('useEffect runs ...')

		//use root / to get all vid list
    axios.get("http://localhost:3001/")
      .then(response => {
        setVidList(response.data.data);         
      })
      .catch(error => {        
        alert('failed to load Vedio List')
        console.log(error.message)
      })
  }, []);



	return (
		<div className="App">
			<FileUploader />
			<VideoList vList = {vidList} />
		</div>
	);
}

export default App;
