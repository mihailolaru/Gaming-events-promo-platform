/* eslint-disable no-mixed-spaces-and-tabs */
import React, {useEffect, useRef, useState} from "react";
import {projectFirestore, projectStorage} from "../../../fireBase";
import {useDataFromFirestoreCMS} from "../../../customHooks/useFirestore";

function CMSSponsorshipPageEdit() {
	const publishBtnRef = useRef();

	const fileTypesArray = ["image/png", "image/jpeg"];
	//States.
	const [ENBannerUrl, setENBannerUrl] = useState("");
	const [ITBannerUrl, setITBannerUrl] = useState("");

	const [oldENBannerUrl, setOldENBannerUrl] = useState("");
	const [oldITBannerUrl, setOldITBannerUrl] = useState("");
    
	const [ENHowItWorksTitle, setENHowItWorksTitle] = useState("");
	const [ITHowItWorksTitle, setITHowItWorksTitle] = useState("");
	const [ENHowItWorksText, setENHowItWorksText] = useState("");
	const [ITHowItWorksText, setITHowItWorksText] = useState("");

	const [ITFileTypeError ,setITFileTypeError] = useState("");
	const [ENFileTypeError ,setENFileTypeError] = useState("");

	const [ITUploadError ,setITUploadError] = useState("");
	const [ENUploadError ,setENUploadError] = useState("");

	const [ITFileSuccess ,setITFileSuccess] = useState(false);
	const [ENFileSuccess ,setENFileSuccess] = useState(false);

	//Getting data from the database.
	const {docsFromHookCMS} = useDataFromFirestoreCMS("web-app-cms");

	let selectedDoc = "";
	//Filtering the data from the database.
	useEffect(() => {
		if (docsFromHookCMS) {
			selectedDoc = docsFromHookCMS.filter(function (doc) {
				return doc.id === "sponsorshipPage";
			});
		}
	});

	//Updating the states on each database data call.
	useEffect(() => {
		if (selectedDoc !== "") {
			selectedDoc.map(doc => {
				setENBannerUrl(doc.bannerUrl.en);
				setITBannerUrl(doc.bannerUrl.it);
				setOldENBannerUrl(doc.bannerUrl.en);
				setOldITBannerUrl(doc.bannerUrl.it);
				setENHowItWorksTitle(doc.howItWorksTitle.en);
				setITHowItWorksTitle(doc.howItWorksTitle.it);
				setENHowItWorksText(doc.howItWorksText.en);
				setITHowItWorksText(doc.howItWorksText.it);
			});
		}
	}, [docsFromHookCMS]);

	//Writing data to the database.
	const writeToFBCallback = () => {
		const collectionRef = projectFirestore.collection("web-app-cms").doc("sponsorshipPage");
		collectionRef.set(
			{
				"bannerUrl": {
					"en": ENBannerUrl,
					"it": ITBannerUrl
				},
				"howItWorksTitle": {
					"en": ENHowItWorksTitle,
					"it": ITHowItWorksTitle
				},
				"howItWorksText": {
					"en": ENHowItWorksText,
					"it": ITHowItWorksText
				}
			})
			.then(() => {
				window.alert("Content edited successfully!");
			})
			.catch((error) => {
				window.alert("Error: " + error.code + " " + error.message + " " + error.details);
			});
	};

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
					const storageRef = projectStorage.ref("CMS-pictures/sponsorshipPage").child(uploadedFile.name);
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

	return (
		<>
			<div style={{paddingTop: "5em important"}}>
				<center><h1>Edit <strong>Sponsorship</strong> Page static content:</h1></center>
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
									<div>
                                            Current banner:
										<img style={{width: "25%", height: "auto"}} src={oldITBannerUrl} alt=""/>
									</div>
									{/*file input*/}
									<label className='form-article__label btn-upload'>
										<span className='icon-upload2'> </span> Main banner
									 <input
											className='form-article__btn visually-hidden'
											type="file"
											placeholder='file'
											onChange={ITFileUploadEventListener}
										/>
									</label>
									<div className="output">
										{ITUploadError !== "" && <div className="error">{ITUploadError}</div>}
										{ITFileTypeError !== "" && <div className="error">{ITFileTypeError}</div>}
										{ITFileSuccess &&
                                        <div>Image Uploaded successfully: <img style={{width: "25%", height: "auto"}}
                                        	src={ITBannerUrl} alt=""/></div>}
									</div>
									<label className='form-article__label'>
                                        Banner title:
										<textarea
											className='form-article__input'
											rows='2'
											name="countent"
											value={ITHowItWorksTitle}
											onChange={
												(e) => setITHowItWorksTitle(e.target.value)
											}
										> </textarea>
									</label>

									<label className='form-article__label'>
                                        Banner text:
										<textarea
											className='form-article__input'
											rows='2'
											name="countent"
											value={ITHowItWorksText}
											onChange={
												(e) => setITHowItWorksText(e.target.value)
											}
										> </textarea>
									</label>
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
									<div>
                                        Current banner:
										<img style={{width: "25%", height: "auto"}} src={oldENBannerUrl} alt=""/>
									</div>
									{/*file input*/}
									<label className='form-article__label btn-upload'>
										<span className='icon-upload2'> </span> Main banner
										<input
											className='form-article__btn visually-hidden'
											type="file"
											placeholder='file'
											onChange={ENFileUploadEventListener}
										/>
									</label>
									<div className="output">
										{ENUploadError !== "" && <div className="error">{ENUploadError}</div>}
										{ENFileTypeError !== "" && <div className="error">{ENFileTypeError}</div>}
										{ENFileSuccess &&
                                        <div>Image Uploaded successfully: <img style={{width: "25%", height: "auto"}}
                                        	src={ENBannerUrl} alt=""/></div>}
									</div>

									<label className='form-article__label'>
                                        Banner text:
										<textarea
											className='form-article__input'
											rows='2'
											name="content"
											value={ENHowItWorksTitle}
											onChange={
												(e) => setENHowItWorksTitle(e.target.value)
											}
										> </textarea>
									</label>

									<label className='form-article__label'>
                                        Footer text:
										<textarea
											className='form-article__input'
											rows='2'
											name="content"
											value={ENHowItWorksText}
											onChange={
												(e) => setENHowItWorksText(e.target.value)
											}
										> </textarea>
									</label>
								</form>
							</div>
						</div>

						<div className="form-article__box-btn">

							<button
								ref={publishBtnRef}
								className="form-article__btn"
								onClick={() => writeToFBCallback()}
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

export default CMSSponsorshipPageEdit;