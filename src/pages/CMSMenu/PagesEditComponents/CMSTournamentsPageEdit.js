import React, {useEffect, useRef, useState} from "react";
import {useHistory} from "react-router-dom";
import {projectFirestore, projectStorage} from "../../../fireBase";
import {useDataFromFirestoreCMS} from "../../../customHooks/useFirestore";

function CMSTournamentsPageEdit() {
	const publishBtnRef = useRef();

	const fileTypesArray = ["image/png", "image/jpeg"];
	const history = useHistory();
	// States.
	const [ENBannerUrl, setENBannerUrl] = useState("");
	const [ITBannerUrl, setITBannerUrl] = useState("");
	const [OldENBannerUrl, setOldENBannerUrl] = useState("");
	const [OldITBannerUrl, setITOldBannerUrl] = useState("");

	const [ENBannerText, setENBannerText] = useState("");
	const [ITBannerText, setITBannerText] = useState("");
	const [ENFooterMessage, setENFooterMessage] = useState("");
	const [ITFooterMessage, setITFooterMessage] = useState("");

	const [ITFileTypeError ,setITFileTypeError] = useState("");
	const [ENFileTypeError ,setENFileTypeError] = useState("");

	const [ITUploadError ,setITUploadError] = useState("");
	const [ENUploadError ,setENUploadError] = useState("");

	const [ITFileSuccess ,setITFileSuccess] = useState(false);
	const [ENFileSuccess ,setENFileSuccess] = useState(false);

	const {docsFromHookCMS} = useDataFromFirestoreCMS("web-app-cms");

	let selectedDoc = "";

	//Filtering data from the database.
	useEffect(() => {
		if (docsFromHookCMS) {
			selectedDoc = docsFromHookCMS.filter(function (doc) {
				return doc.id === "tournamentsPage";
			});
		}
	});

	//Updating the states on each database data call.
	useEffect(() => {
		if (selectedDoc !== "") {
			selectedDoc.map(doc => {
				setENBannerUrl(doc.mainBanner.en);
				setOldENBannerUrl(doc.mainBanner.en);

				setITBannerUrl(doc.mainBanner.it);
				setITOldBannerUrl(doc.mainBanner.it);

				setENBannerText(doc.bannerText.en);
				setITBannerText(doc.bannerText.it);
				setENFooterMessage(doc.footerMessage.en);
				setITFooterMessage(doc.footerMessage.it);
			});
		}
	}, [docsFromHookCMS]);

	//File upload listeners. START
	const ITFileUploadEventListener = (e) => {
		let uploadedFile = e.target.files[0];
		if (uploadedFile && fileTypesArray.includes(uploadedFile.type)) {
			// eslint-disable-next-line no-inner-declarations
			async function putFile(uploadedFile){
				e.preventDefault();
				try {
					setITFileTypeError("");
					setITUploadError("");
					const storageRef = projectStorage.ref("CMS-pictures/tournamentsPage").child(uploadedFile.name);
					storageRef.put(uploadedFile).on("state_changed", () => {
					},  (err) => {
						window.alert(err);
					}, async()=>{
						const finalUrl = await storageRef.getDownloadURL();
						finalUrl!==undefined?setITFileSuccess(true):setITFileSuccess(false);
						setITBannerUrl(finalUrl);

					});
				} catch {
					setITUploadError("Failed to upload file");
				}
			}
			putFile(uploadedFile).then();
		} else {
			setITFileTypeError("Please select an image file (png or jpg)");
		}
	};

	const ENFileUploadEventListener = (e) => {
		let uploadedFile = e.target.files[0];
		if (uploadedFile && fileTypesArray.includes(uploadedFile.type)) {
			// eslint-disable-next-line no-inner-declarations
			async function putFile(uploadedFile){
				e.preventDefault();
				try {
					setENFileTypeError("");
					setENUploadError("");
					const storageRef = projectStorage.ref("CMS-pictures/tournamentsPage").child(uploadedFile.name);
					storageRef.put(uploadedFile).on("state_changed", () => {
					},  (err) => {
						window.alert(err);
					}, async()=>{
						const finalUrl = await storageRef.getDownloadURL();
						finalUrl!==undefined?setENFileSuccess(true):setENFileSuccess(false);
						setENBannerUrl(finalUrl);
					});
				} catch {
					setENUploadError("Failed to upload file");
				}
			}
			putFile(uploadedFile).then();
		} else {
			setENFileTypeError("Please select an image file (png or jpg)");
		}
	};
	//File upload listeners. END

	//Writing data to the database.
	const writeToFBCallback = () => {
		const collectionRef = projectFirestore.collection("web-app-cms").doc("tournamentsPage");

		collectionRef.set(
			{
				"mainBanner": {
					"en": ENBannerUrl,
					"it": ITBannerUrl
				},
				"bannerText": {
					"en": ENBannerText,
					"it": ITBannerText
				},
				"footerMessage": {
					"en": ENFooterMessage,
					"it": ITFooterMessage
				}
			})
			.then(() => {
				window.alert("Stream added successfully!");
				history.push("/UserProfilePage", {from: "/CMSMenu"});
			})
			.catch((error) => {
				window.alert(error.code + " " + error.message + "" + error.details);
			});
	};

	return (
		<>
			<div style={{paddingTop: "5em important"}}>
				<center><h1>Edit <strong>Tournaments</strong> Page static content:</h1></center>
				<section>
					<ul className="nav nav-tabs" id="myTab" role="tablist">
						<li className="nav-item">
							<a
								className="nav-link active"
								id="home-tab"
								data-toggle="tab"
								href="#tab1"
								role="tab"
								aria-controls="home"
								aria-selected="true"
							>Italian</a>
						</li>
						<li className="nav-item">
							<a className="nav-link"
								id="profile-tab"
								data-toggle="tab"
								href="#tab2"
								role="tab"
								aria-controls="profile"
								aria-selected="false"
							>English</a>
						</li>
					</ul>
					<div className="tab-content" id="myTabContent">
						{/*Tab1*/}
						<div
							className="tab-pane fade show active"
							id="tab1"
							role="tabpanel"
							aria-labelledby="home-tab">
							<div className='form-article__body'>
								<form className="form-article">

									<label className='form-article__label'>
                                        Banner text:
										<textarea
											className='form-article__input'
											rows='2'
											name="countent"
											value={ITBannerText}
											required
											onChange={
												(e)=>setITBannerText(e.target.value)
											}
										></textarea>
									</label>

									<label className='form-article__label'>
                                        Footer message:
										<textarea
											className='form-article__input'
											rows='2'
											name="countent"
											value={ITFooterMessage}
											required
											onChange={
												(e)=>setITFooterMessage(e.target.value)
											}
										></textarea>
									</label>
									<div>
                                        Current banner:
										<img style={{width: "25%", height: "auto"}} src={OldITBannerUrl} alt=""/>
									</div>
									{/*file input*/}
									<label className='form-article__label btn-upload'> <span className='icon-upload2'></span> Main banner
										<input
											className='form-article__btn visually-hidden'
											type="file"
											placeholder='file'
											onChange={ITFileUploadEventListener}
										/>
									</label>
									<div className="output">
										{ ITUploadError!=="" && <div className="error">{ ITUploadError }</div>}
										{ ITFileTypeError!=="" && <div className="error">{ ITFileTypeError }</div>}
										{ ITFileSuccess&&<div>Image Uploaded successfully: <img style={{width: "25%", height: "auto"}} src={ITBannerUrl} alt=""/></div> }
									</div>
								</form>
							</div>
						</div>

						{/*Tab2*/}

						<div
							className="tab-pane fade"
							id="tab2"
							role="tabpanel"
							aria-labelledby="profile-tab"
						>
							<div className='form-article__body'>
								<form className="form-article">

									<label className='form-article__label'>
                                        Content
										<textarea
											className='form-article__input'
											rows='2'
											name="countent"
											value={ENBannerText}
											required
											onChange={
												(e)=>setENBannerText(e.target.value)
											}
										></textarea>
									</label>

									<label className='form-article__label'>
                                        Content
										<textarea
											className='form-article__input'
											rows='2'
											name="countent"
											value={ENFooterMessage}
											required
											onChange={
												(e)=>setENFooterMessage(e.target.value)
											}
										></textarea>
									</label>
									<div>
                                        Current banner:
										<img style={{width: "25%", height: "auto"}} src={OldENBannerUrl} alt=""/>
									</div>
									{/*file input*/}
									<label className='form-article__label btn-upload'> <span className='icon-upload2'></span> Main banner
										<input
											className='form-article__btn visually-hidden'
											type="file"
											placeholder='file'
											onChange={ENFileUploadEventListener}
										/>
									</label>
									<div className="output">
										{ ENUploadError!=="" && <div className="error">{ ENUploadError }</div>}
										{ ENFileTypeError!=="" && <div className="error">{ ENFileTypeError }</div>}
										{ ENFileSuccess&&<div>Image Uploaded successfully: <img style={{width: "25%", height: "auto"}} src={ENBannerUrl} alt=""/></div> }
									</div>
								</form>
							</div>
						</div>

						<div className="form-article__box-btn">

							<button
								ref={publishBtnRef}
								className="form-article__btn"
								onClick={()=>writeToFBCallback()}
							>
                                Publish
							</button>

						</div>
					</div>
				</section>
			</div>
		</>
	);
}

export default CMSTournamentsPageEdit;