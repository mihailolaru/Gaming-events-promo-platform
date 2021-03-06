/** For the future, consider refactoring the code in compliance with the DRY principle. */
import React, {useEffect, useRef, useState} from "react";
import {useHistory} from "react-router-dom";
import {projectFirestore, projectStorage} from "../../../fireBase";
import {useDataFromFirestoreCMS} from "../../../customHooks/useFirestore";
//The red line between team members
import { BsDashCircleFill,  BsPlusCircleFill} from "react-icons/bs";
//Unique id generator.
import { v4 as uuidv4 } from "uuid";
import {FaLinkedinIn} from "react-icons/fa";

function CMSAboutUsPageEdit() {
	// eslint-disable-next-line react/prop-types
	const ColoredLine = ({ color }) => (
		<hr
			style={{
				color: color,
				backgroundColor: color,
				height: 5
			}}
		/>
	);

	let publishBtnRef = useRef();
	const fileTypesArray = ["image/png", "image/jpeg"];
	const history = useHistory();
	//Extracting data from the database.
	const {docsFromHookCMS} = useDataFromFirestoreCMS("web-app-cms");

	// Urls states.
	const [ENBannerUrl, setENBannerUrl] = useState("");
	const [ITBannerUrl, setITBannerUrl] = useState("");

	const [ENTopBannerUrl, setENTopBannerUrl] = useState("");
	const [ITTopBannerUrl, setITTopBannerUrl] = useState("");

	const [partnerLogo1Url, setPartnerLogo1Url] = useState("");
	const [partnerLogo2Url, setPartnerLogo2Url] = useState("");
	const [partnerLogo3Url, setPartnerLogo3Url] = useState("");
	const [partnerLogo4Url, setPartnerLogo4Url] = useState("");
	const [partnerLogo5Url, setPartnerLogo5Url] = useState("");

	const [oldENBannerUrl, setOldENBannerUrl] = useState("");
	const [oldITBannerUrl, setOldITBannerUrl] = useState("");

	const [oldENTopBannerUrl, setOldENTopBannerUrl] = useState("");
	const [oldITTopBannerUrl, setOldITTopBannerUrl] = useState("");

	// Success
	const [ENBannerFileSuccess, setENBannerFileSuccess] = useState(false);
	const [ITBannerFileSuccess, setITBannerFileSuccess] = useState(false);

	const [ENTopBannerFileSuccess, setENTopBannerFileSuccess] = useState(false);
	const [ITTopBannerFileSuccess, setITTopBannerFileSuccess] = useState(false);

	// Text
	const [ENCareerTitle, setENCareerTitle] = useState("");
	const [ITCareerTitle, setITCareerTitle] = useState("");

	const [ENCareerText, setENCareerText] = useState("");
	const [ITCareerText, setITCareerText] = useState("");

	const [ENCrewTitle, setENCrewTitle] = useState("");
	const [ITCrewTitle, setITCrewTitle] = useState("");

	const [ITMissionTitle, setITMissionTitle] = useState("");
	const [ENMissionTitle, setENMissionTitle] = useState("");

	const [ITMissionText, setITMissionText] = useState("");
	const [ENMissionText, setENMissionText] = useState("");

	const [ENPartnersTitle, setENPartnersTitle] = useState("");
	const [ITPartnersTitle, setITPartnersTitle] = useState("");

	const [ENTitle, setENTitle] = useState("");
	const [ITTitle, setITTitle] = useState("");

	const [ENTitleText, setENTitleText] = useState("");
	const [ITTitleText, setITTitleText] = useState("");

	const [generalTeamMembersArr, setGeneralTeamMembersArr] = useState([]);
	const [generalPartnersLogoArr, setGeneralPartnersLogoArr] = useState([]);

	const handleAddFields = () => {
		setGeneralTeamMembersArr([...generalTeamMembersArr, { logo: "",  avatar: "", title: {en: "", it: "" }, linkedin: ""}]);
	};
	const handleAddFieldsPartners = () => {
		setGeneralPartnersLogoArr([...generalPartnersLogoArr, { logo: ""}]);
	};

	//Functions for adding and removing the fields for new team members.
	const handleRemoveFields = id => {
		const values  = [...generalTeamMembersArr];
		values.splice(values.findIndex(value => value.id === id), 1);
		setGeneralTeamMembersArr(values);
	};
	const handleRemoveFieldsPartners = id => {
		const values  = [...generalPartnersLogoArr];
		values.splice(values.findIndex(value => value.id === id), 1);
		setGeneralPartnersLogoArr(values);
	};

	//Function for changing the state for fields who's values do not vary depending on the app language.
	const handleChangeInput = (id, event) => {
		const newInputFields = generalTeamMembersArr.map(doc => {
			if(id === doc.id) {
				doc[event.target.name] = event.target.value;
			}
			return doc;
		});
		setGeneralTeamMembersArr(newInputFields);
	};

	//Function for changing the state for fields who's values vary depending on the app language.
	const handleChangeInputTitle = (id, event, lng) => {
		const newInputField = generalTeamMembersArr.map(doc => {
			if(id === doc.id) {
				doc[event.target.name][lng] = event.target.value;
			}
			return doc;
		});
		setGeneralTeamMembersArr(newInputField);
	};

	//Team members file upload listener.
	const fileChangeInput = (id, e) =>{
		let uploadedFile = e.target.files[0];
		const newInputFields = generalTeamMembersArr.map(doc => {
			if(id === doc.id) {
				if (uploadedFile && fileTypesArray.includes(uploadedFile.type)) {
					// eslint-disable-next-line no-inner-declarations
					async function putFile(uploadedFile){
						e.preventDefault();
						try {
							const storageRef = projectStorage.ref("CMS-pictures/aboutUsPage/members").child(uploadedFile.name);
							storageRef.put(uploadedFile).on("state_changed", () => {
							},  (err) => {
								window.alert(err);
							}, async()=>{
								const finalUrl = await storageRef.getDownloadURL();
								if(finalUrl!==undefined)doc[e.target.name]=finalUrl;                                
							});
						} catch {
							return window.alert("Failed to upload file");
						}
					}
					putFile(uploadedFile).then(()=>window.alert("File uploaded successfully."));
				} else {
					return window.alert("Please select an image file (png or jpg)");
				}
			}
			return doc;
		});
		setGeneralTeamMembersArr(newInputFields);
	};

	//Partners logos file upload listener.
	const fileChangeInputPartners = (id, e) =>{
		let uploadedFile = e.target.files[0];
		const newInputFields = generalPartnersLogoArr.map(doc => {
			if(id === doc.id) {
				if (uploadedFile && fileTypesArray.includes(uploadedFile.type)) {
					// eslint-disable-next-line no-inner-declarations
					async function putFile(uploadedFile){
						e.preventDefault();
						try {
							const storageRef = projectStorage.ref("CMS-pictures/aboutUsPage/partners").child(uploadedFile.name);
							storageRef.put(uploadedFile).on("state_changed", () => {
							},  (err) => {
								window.alert(err);
							}, async()=>{
								const finalUrl = await storageRef.getDownloadURL();
								if(finalUrl!==undefined)doc[e.target.name]=finalUrl;                                
							});
						} catch {
							return window.alert("Failed to upload file");
						}
					}
					putFile(uploadedFile).then(()=>window.alert("File uploaded successfully."));
				} else {
					return window.alert("Please select an image file (png or jpg)");
				}
			}
			return doc;
		});
		setGeneralPartnersLogoArr(newInputFields);
	};

	let selectedDoc = "";

	useEffect(() => {
		if (docsFromHookCMS) {
			selectedDoc = docsFromHookCMS.filter(function (doc) {
				return doc.id === "aboutUsPage";
			});
		}
	});

	let membersArr = [];
	let partnersArr = [];

	//Setting the states after extracting the data from the database.
	useEffect(() => {
		if (selectedDoc !== "") {
			selectedDoc.map(doc => {
				doc.members.map(member => membersArr.push({...member, id: uuidv4()}));
				setGeneralTeamMembersArr(membersArr);

				doc.partners.map(partner => partnersArr.push({...partner, id: uuidv4()}));
				setGeneralPartnersLogoArr(partnersArr);

				setENTitle(doc.title.en);
				setITTitle(doc.title.it);
				setENTitleText(doc.titleText.en);
				setITTitleText(doc.titleText.it);

				setENBannerUrl(doc.banner.en);
				setITBannerUrl(doc.banner.it);

				setENTopBannerUrl(doc.topBanner.en);
				setITTopBannerUrl(doc.topBanner.it);

				setPartnerLogo1Url(doc.partnersLogos.partner1);
				setPartnerLogo2Url(doc.partnersLogos.partner2);
				setPartnerLogo3Url(doc.partnersLogos.partner3);
				setPartnerLogo4Url(doc.partnersLogos.partner4);
				setPartnerLogo5Url(doc.partnersLogos.partner5);

				setOldENBannerUrl(doc.banner.en);
				setOldITBannerUrl(doc.banner.it);

				setOldENTopBannerUrl(doc.topBanner.en);
				setOldITTopBannerUrl(doc.topBanner.it);

				setITMissionTitle(doc.missionTitle.it);
				setENMissionTitle(doc.missionTitle.en);
				setITMissionText(doc.missionText.it);
				setENMissionText(doc.missionText.en);

				setENCareerTitle(doc.careerTitle.en);
				setITCareerTitle(doc.careerTitle.it);
				setENCareerText(doc.careerText.en);
				setITCareerText(doc.careerText.it);

				setENCrewTitle(doc.crewTitle.en);
				setITCrewTitle(doc.crewTitle.it);

				setENPartnersTitle(doc.partnersTitle.en);
				setITPartnersTitle(doc.partnersTitle.it);
			});
		}
	}, [docsFromHookCMS]);

	//Banners upload listeners. START
	const ENBannerFileUploadEventListener = (e) => {
		let uploadedFile = e.target.files[0];
		if (uploadedFile && fileTypesArray.includes(uploadedFile.type)) {
			// eslint-disable-next-line no-inner-declarations
			async function putFile(uploadedFile){
				e.preventDefault();
				try {
					const storageRef = projectStorage.ref("CMS-pictures/aboutUsPage").child(uploadedFile.name);
					storageRef.put(uploadedFile).on("state_changed", () => {
					},  (err) => {
						window.alert(err);
					}, async()=>{
						const finalUrl = await storageRef.getDownloadURL();
						finalUrl!==undefined?setENBannerFileSuccess(true):setENBannerFileSuccess(false);
						setENBannerUrl(finalUrl);
					});
				} catch {
					window.alert("Failed to upload file. Try uploading again.");
				}
			}
			putFile(uploadedFile).then();
		} else {
			window.alert("Please select an image file (png or jpg)");
		}
	};

	const ITBannerFileUploadEventListener = (e) => {
		let uploadedFile = e.target.files[0];
		if (uploadedFile && fileTypesArray.includes(uploadedFile.type)) {
			// eslint-disable-next-line no-inner-declarations
			async function putFile(uploadedFile){
				e.preventDefault();
				try {
					const storageRef = projectStorage.ref("CMS-pictures/aboutUsPage").child(uploadedFile.name);
					storageRef.put(uploadedFile).on("state_changed", () => {
					},  (err) => {
						window.alert(err);
					}, async()=>{
						const finalUrl = await storageRef.getDownloadURL();
						finalUrl!==undefined?setITBannerFileSuccess(true):setITBannerFileSuccess(false);
						setITBannerUrl(finalUrl);
					});
				} catch {
					window.alert("Failed to upload file. Try uploading again.");
				}
			}
			putFile(uploadedFile).then();
		} else {
			window.alert("Please select an image file (png or jpg)");
		}
	};

	const ENTopBannerFileUploadEventListener = (e) => {
		let uploadedFile = e.target.files[0];
		if (uploadedFile && fileTypesArray.includes(uploadedFile.type)) {
			// eslint-disable-next-line no-inner-declarations
			async function putFile(uploadedFile){
				e.preventDefault();
				try {
					const storageRef = projectStorage.ref("CMS-pictures/aboutUsPage").child(uploadedFile.name);
					storageRef.put(uploadedFile).on("state_changed", () => {
					},  (err) => {
						window.alert(err);
					}, async()=>{
						const finalUrl = await storageRef.getDownloadURL();
						finalUrl!==undefined?setENTopBannerFileSuccess(true):setENTopBannerFileSuccess(false);
						setENTopBannerUrl(finalUrl);
					});
				} catch {
					return window.alert("Failed to upload file. Try loading again.");
				}
			}
			putFile(uploadedFile).then();
		} else {
			return window.alert("Please select an image file (png or jpg)");
		}
	};

	const ITTopBannerFileUploadEventListener = (e) => {
		let uploadedFile = e.target.files[0];
		if (uploadedFile && fileTypesArray.includes(uploadedFile.type)) {
			// eslint-disable-next-line no-inner-declarations
			async function putFile(uploadedFile){
				e.preventDefault();
				try {
					const storageRef = projectStorage.ref("CMS-pictures/aboutUsPage").child(uploadedFile.name);
					storageRef.put(uploadedFile).on("state_changed", () => {
					},  (err) => {
						window.alert(err);
					}, async()=>{
						const finalUrl = await storageRef.getDownloadURL();
						finalUrl!==undefined?setITTopBannerFileSuccess(true):setITTopBannerFileSuccess(false);
						setITTopBannerUrl(finalUrl);
					});
				} catch {
					window.alert("Failed to upload file. Try uploading again");
				}
			}
			putFile(uploadedFile).then();
		} else {
			window.alert("Please select an image file (png or jpg)");
		}
	};
	//Banners upload listeners. END

	//Function for writing data to the database.
	const writeToFBCallback = () => {
		const collectionRef = projectFirestore.collection("web-app-cms").doc("aboutUsPage");

		collectionRef.set(
			{
				"members": generalTeamMembersArr,
				"topBanner": {
					"en": ENTopBannerUrl,
					"it": ITTopBannerUrl
				},
				"banner": {
					"en": ENBannerUrl,
					"it": ITBannerUrl
				},
				"careerText": {
					"en": ENCareerText,
					"it": ITCareerText
				},
				"careerTitle": {
					"en": ENCareerTitle,
					"it": ITCareerTitle
				},
				"crewTitle": {
					"en": ENCrewTitle,
					"it": ITCrewTitle
				},
				"missionText": {
					"en": ENMissionText,
					"it": ITMissionText
				},
				"missionTitle": {
					"en": ENMissionTitle,
					"it": ITMissionTitle
				},
				"partners": generalPartnersLogoArr,
				"partnersLogos": {
					"partner1": partnerLogo1Url,
					"partner2": partnerLogo2Url,
					"partner3": partnerLogo3Url,
					"partner4": partnerLogo4Url,
					"partner5": partnerLogo5Url,
				},
				"partnersTitle": {
					"en": ENPartnersTitle,
					"it": ITPartnersTitle
				},
				"title": {
					"en": ENTitle,
					"it": ITTitle
				},
				"titleText": {
					"en": ENTitleText,
					"it": ITTitleText
				}
			})
			.then(() => {
				window.alert("Content edited successfully!");
				history.push("/UserProfilePage", {from: "/CMSMenu"});
			})
			.catch((error) => {
				window.alert("Error: " + error.code + " " + error.message + " " + error.details);
			});
	};

	return (
		<>
			<div style={{paddingTop: "5em important"}}>
				<center><h1>Edit <strong>AboutUs</strong> Page static content:</h1></center>
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
										Current top banner IT:
										<img style={{width: "25%", height: "auto"}} src={oldITTopBannerUrl} alt=""/>
									</div>
									<label className='form-article__label btn-upload'> <span className='icon-upload2'></span> Main banner
										<input
											className='form-article__btn visually-hidden'
											type="file"
											placeholder='file'
											onChange={ITTopBannerFileUploadEventListener}
										/>
									</label>
									<div className="output">
										{ITTopBannerFileSuccess&&<div>Image Uploaded successfully: <img style={{width: "25%", height: "auto"}} src={ITTopBannerUrl} alt=""/></div> }
									</div>

									<label className='form-article__label'>
                                        Title:
										<textarea
											className='form-article__input'
											rows='2'
											name="countent"
											value={ITTitle}
											onChange={
												(e)=>setITTitle(e.target.value)
											}
										></textarea>
									</label>

									<label className='form-article__label'>
                                        Title text:
										<textarea
											className='form-article__input'
											rows='2'
											name="countent"
											value={ITTitleText}
											onChange={
												(e)=>setITTitleText(e.target.value)
											}
										></textarea>
									</label>

									{/*banner*/}
									<div>
										Current mission banner IT:
										<img style={{width: "25%", height: "auto"}} src={oldITBannerUrl} alt=""/>
									</div>
									<label className='form-article__label btn-upload'> <span className='icon-upload2'></span> Main banner
										<input
											className='form-article__btn visually-hidden'
											type="file"
											placeholder='file'
											onChange={ITBannerFileUploadEventListener}
										/>
									</label>
									<div className="output">
										{ ITBannerFileSuccess&&<div>Image Uploaded successfully: <img style={{width: "25%", height: "auto"}} src={ITBannerUrl} alt=""/></div> }
									</div>

									<label className='form-article__label'>
                                        Mission title:
										<textarea
											className='form-article__input'
											rows='2'
											name="countent"
											value={ITMissionTitle}
											onChange={
												(e)=>setITMissionTitle(e.target.value)
											}
										></textarea>
									</label>
									<label className='form-article__label'>
                                        Mission text:
										<textarea
											className='form-article__input'
											rows='2'
											name="countent"
											value={ITMissionText}
											onChange={
												(e)=>setITMissionText(e.target.value)
											}
										></textarea>
									</label>

									<label className='form-article__label'>
                                        Crew title:
										<textarea
											className='form-article__input'
											rows='2'
											name="countent"
											value={ITCrewTitle}
											onChange={
												(e)=>setITCrewTitle(e.target.value)
											}
										></textarea>
									</label>
									{/*Team members: START*/}

									<div>Team members list:

										{ generalTeamMembersArr.map(member => (
											<>
												<div key={member.id}>
													<label className='form-article__label'>
                                                        Name:
														<input
															name="name"
															className='form-article__input'
															type="text"
															placeholder={member.name}
															onChange={event => handleChangeInput(member.id, event)}
														/>
													</label>
													<div>
                                                        Current avatar:
														<img style={{width: "25%", height: "auto"}} src={member.avatar} alt=""/>
													</div>

													<label className='form-article__label btn-upload'> <span className='icon-upload2'></span> Avatar
														<input
															name="avatar"
															className='form-article__btn visually-hidden'
															type="file"
															placeholder='file'
															onChange={event => fileChangeInput(member.id, event)}
														/>
													</label>
													<div className="output">
														{/*{ avatar3FileSuccess&&<div>Image Uploaded successfully: <img style={{width: "25%", height: "auto"}} src={avatar3Url} alt=""/></div> }*/}
													</div>

													<label className='form-article__label'>
                                                        Title:
														<input
															name="title"
															className='form-article__input'
															type="text"
															placeholder={member.title.it}
															onChange={event => handleChangeInputTitle(member.id, event, "it")}
														/>
													</label>

													<label className='form-article__label'>
														<FaLinkedinIn /> LinkedIn:
														<input
															name="linkedin"
															className='form-article__input'
															type="text"
															placeholder={member.linkedin}
															onChange={event => handleChangeInput(member.id, event)}
														/>
													</label>

													<BsPlusCircleFill style={{marginRight: "2em"}} onClick={()=>handleAddFields()}/>
													<BsDashCircleFill disabled={generalTeamMembersArr.length === 1} onClick={() => handleRemoveFields(member.id)}/>
													<ColoredLine color="red" />
												</div>
												<br />
											</>

										)) }

										{/*Team members: END*/}
									</div>

									<label className='form-article__label'>
                                        Partners title:
										<input
											className='form-article__input'
											type="text"
											value={ITPartnersTitle}
											onChange={
												(e)=>setITPartnersTitle(e.target.value)
											}
										/>
									</label>

									<label className='form-article__label'>
                                        Career title:
										<input
											className='form-article__input'
											type="text"
											value={ITCareerTitle}
											onChange={
												(e)=>setITCareerTitle(e.target.value)
											}
										/>
									</label>

									<label className='form-article__label'>
                                        Career text:
										<textarea
											className='form-article__input'
											rows='2'
											name="countent"
											value={ITCareerText}
											onChange={
												(e)=>setITCareerText(e.target.value)
											}
										></textarea>
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
										Current top banner EN:
										<img style={{width: "25%", height: "auto"}} src={oldENTopBannerUrl} alt=""/>
									</div>
									<label className='form-article__label btn-upload'> <span className='icon-upload2'></span> Main banner
										<input
											className='form-article__btn visually-hidden'
											type="file"
											placeholder='file'
											onChange={ENTopBannerFileUploadEventListener}
										/>
									</label>
									<div className="output">
										{ENTopBannerFileSuccess&&<div>Image Uploaded successfully: <img style={{width: "25%", height: "auto"}} src={ENTopBannerUrl} alt=""/></div> }
									</div>

									<label className='form-article__label'>
                                        Title:
										<textarea
											className='form-article__input'
											rows='2'
											name="countent"
											value={ENTitle}
											onChange={
												(e)=>setENTitle(e.target.value)
											}
										></textarea>
									</label>

									<label className='form-article__label'>
                                        Title text:
										<textarea
											className='form-article__input'
											rows='2'
											name="countent"
											value={ENTitleText}
											onChange={
												(e)=>setENTitleText(e.target.value)
											}
										></textarea>
									</label>

									{/*banner*/}
									<div>
                                        Current mission banner EN:
										<img style={{width: "25%", height: "auto"}} src={oldENBannerUrl} alt=""/>
									</div>
									<label className='form-article__label btn-upload'> <span className='icon-upload2'></span> Main banner
										<input
											className='form-article__btn visually-hidden'
											type="file"
											placeholder='file'
											onChange={ENBannerFileUploadEventListener}
										/>
									</label>
									<div className="output">
										{ENBannerFileSuccess&&<div>Image Uploaded successfully: <img style={{width: "25%", height: "auto"}} src={ENBannerUrl} alt=""/></div> }
									</div>
									<label className='form-article__label'>
                                        Mission title:
										<textarea
											className='form-article__input'
											rows='2'
											name="countent"
											value={ENMissionTitle}
											onChange={
												(e)=>setENMissionTitle(e.target.value)
											}
										></textarea>
									</label>
									<label className='form-article__label'>
                                        Mission text:
										<textarea
											className='form-article__input'
											rows='2'
											name="countent"
											value={ENMissionText}
											onChange={
												(e)=>setENMissionText(e.target.value)
											}
										></textarea>
									</label>

									<label className='form-article__label'>
                                        Crew title:
										<textarea
											className='form-article__input'
											rows='2'
											name="countent"
											value={ENCrewTitle}
											onChange={
												(e)=>setENCrewTitle(e.target.value)
											}
										></textarea>
									</label>

									{/*Team members: START*/}

									<div>Team members list:
										{ generalTeamMembersArr.map(member => (
											<>
												<div key={member.id}>
													<label className='form-article__label'>
                                                    Name:
														<input
															name="name"
															className='form-article__input'
															type="text"
															placeholder={member.name}
															onChange={event => handleChangeInput(member.id, event)}
														/>
													</label>
													<div>
                                                    Current avatar:
														<img style={{width: "25%", height: "auto"}} src={member.avatar} alt=""/>
													</div>

													<label className='form-article__label btn-upload'> <span className='icon-upload2'></span> Avatar
														<input
															name="avatar"
															className='form-article__btn visually-hidden'
															type="file"
															placeholder='file'
															onChange={event => fileChangeInput(member.id, event)}
														/>
													</label>
													<div className="output">
														{/*{ avatar3FileSuccess&&<div>Image Uploaded successfully: <img style={{width: "25%", height: "auto"}} src={avatar3Url} alt=""/></div> }*/}
													</div>

													<label className='form-article__label'>
                                                    Title:
														<input
															name="title"
															className='form-article__input'
															type="text"
															placeholder={member.title.en}
															onChange={event => handleChangeInputTitle(member.id, event, "en")}
														/>
													</label>
													<label className='form-article__label'>
														<FaLinkedinIn /> LinkedIn:
														<input
															name="linkedin"
															className='form-article__input'
															type="text"
															placeholder={member.linkedin}
															onChange={event => handleChangeInput(member.id, event)}
														/>
													</label>

													<BsPlusCircleFill style={{marginRight: "2em"}} onClick={()=>handleAddFields()}/>
													<BsDashCircleFill disabled={generalTeamMembersArr.length === 1} onClick={() => handleRemoveFields(member.id)}/>
													<ColoredLine color="red" />
												</div>
												<br />
											</>

										)) }

										{/*Team members: END*/}

									</div>

									<label className='form-article__label'>
                                        Partners title:
										<input
											className='form-article__input'
											type="text"

											value={ENPartnersTitle}
											onChange={
												(e)=>setENPartnersTitle(e.target.value)
											}
										/>
									</label>

									<label className='form-article__label'>
                                        Career title:
										<input
											className='form-article__input'
											type="text"

											value={ENCareerTitle}
											onChange={
												(e)=>setENCareerTitle(e.target.value)
											}
										/>
									</label>

									<label className='form-article__label'>
                                        Career text:
										<textarea
											className='form-article__input'
											rows='2'
											name="countent"
											value={ENCareerText}
											onChange={
												(e)=>setENCareerText(e.target.value)
											}
										></textarea>
									</label>
								</form>
							</div>
						</div>

						{/*partners logos*/}
						<div>
							{/*Partners logos: START*/}
							{ generalPartnersLogoArr.map(partner => (
								<>
									<div key={partner.id}>
										<div>
                                            Logo:
											<img style={{width: "25%", height: "auto"}} src={partner.logo} alt=""/>
										</div>

										<label className='form-article__label btn-upload'> <span className='icon-upload2'></span> Upload
											<input
												name="logo"
												className='form-article__btn visually-hidden'
												type="file"
												placeholder='file'
												onChange={event => fileChangeInputPartners(partner.id, event)}
											/>
										</label>

										<BsPlusCircleFill style={{marginRight: "2em"}} onClick={()=>handleAddFieldsPartners()}/>
										<BsDashCircleFill disabled={generalPartnersLogoArr.length === 1} onClick={() => handleRemoveFieldsPartners(partner.id)}/>
										<ColoredLine color="red" />
									</div>
									<br />
								</>
							)) }
							{/*Partners logos: END*/}

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
					</div>
				</section>
			</div>
		</>
	);
}

export default CMSAboutUsPageEdit;