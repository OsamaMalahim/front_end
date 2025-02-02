import React, { useState } from "react";
import Modal from "../Modal";

export default function VideoList(props) {
	// Modal useState
	const [open, setOpen] = useState(false);	
	console.log("below is vedio list")
	const vedioList = props.vList;
	console.log(vedioList)
	return (
		<div className="All-Vid-List">		 
			{
				vedioList.map((vedio)=>{
					return(
						<div key={vedio.id}>
						<div className="vid">
							<div className="image-container">
								<img
									src={require("../thumb/thumb200x100.jpg")}
									width="50"
									height="50"
									alt="just thumb"
								/>
								<p>{vedio.Name}</p>
								<p>{vedio.Size} MB</p>
							</div>
							<div className="right-items">
								<button className="item" onClick={() => {
										setOpen(true);
									}}>Resize</button>
								<button className="item">Extract Audio</button>
								<button className="item">Download</button>
							</div>
						</div>	
					</div>
					)
				})
			}
			
			{/* Modal Here */}
			<Modal openStatus={open} closeModal={() => setOpen(false)} />
		</div>
	);
}
