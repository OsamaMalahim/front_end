import React from "react";


export default function Modal(props) {
   
	console.log(props.openStatus);
	if (!props.openStatus) {
		return <></>;
	}
	return (
		<div className="Modal-Background">
			<button className="btn-close" onClick={props.closeModal} >X close</button>
			<h2>Welcom to New Modal Popup</h2>
			<p>Hello every one nice to seee you please choose option below</p>
			<div className="modal-btn">
			<button className="btn-cancel" onClick={props.closeModal}>cancel</button>
			<button className="btn-continue" >continue</button>
			</div>
		</div>
	);
}
