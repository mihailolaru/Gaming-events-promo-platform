import React, {useEffect, useRef, useState} from "react";
import {projectStorage, functions} from "../../../fireBase";
import {useHistory} from "react-router-dom";
import {useDataFromFirestore} from "../../../customHooks/useFirestore";
import {useTranslation} from "react-i18next";
// eslint-disable-next-line no-undef
const queryString = require("query-string");

export default function EditArticleForm() {
	const history = useHistory();

	const {t} = useTranslation();
	let publishBtnRef = useRef();

	//Accepted file types array.
	const fileTypesArray = ["image/png", "image/jpeg"];

	//Getting data from the database.
	const {docsFromHook} = useDataFromFirestore("articles");

	//States.
	const [ENTitle, setENTitle] = useState("");
	const [ENDescription, setENDescription] = useState("");
	const [ENText, setENText] = useState("");
	const [ITTitle, setITTitle] = useState("");
	const [ITDescription, setITDescription] = useState("");
	const [ITText, setITText] = useState("");

	const [ITFileUploadError, setITFileUploadError] = useState("");
	const [ENFileUploadError, setENFileUploadError] = useState("");

	const [ITFileTypeError, setITFileTypeError] = useState("");
	const [ENFileTypeError, setENFileTypeError] = useState("");

	const [ITFileSuccess, setITFileSuccess] = useState(false);
	const [ENFileSuccess, setENFileSuccess] = useState(false);

	const [ITUrl, setITUrl] = useState("");
	const [ENUrl, setENUrl] = useState("");

	const [OldITUrl, setOldITUrl] = useState("");
	const [OldENUrl, setOldENUrl] = useState("");

	const [videoGamesSwitch, setVideoGamesSwitch] = useState(0);
	const [musicSwitch, setMusicSwitch] = useState(0);
	const [moviesSwitch, setMoviesSwitch] = useState(0);
	const [currentCategories, setCurrentCategories] = useState();

	// Static length categories array. In the function that writes data to the database this array is filtered on empty strings.
	const categoryArr = [
		videoGamesSwitch===1?"videogames":"",
		moviesSwitch===1?"movies":"",
		musicSwitch===1?"music":""
	];

	//Getting an parsing data from url field
	let parsedWindowLocation = queryString.parse(window.location.hash);
	const stringifiedSlug = queryString.stringify(parsedWindowLocation).substr(18);

	let selectedArticle = "";

	//Filtering database data.
	useEffect(() => {
		if(docsFromHook) {
			selectedArticle = docsFromHook.filter(function (article) {
				return article.id === stringifiedSlug;
			});
		}
	});

	//Updating the states on each database call.
	useEffect(() => {
		if(selectedArticle!==""){
			selectedArticle && selectedArticle.map( doc =>
			{
				setENDescription(doc.content.en.description);
				setENText(doc.content.en.text);
				setENTitle(doc.content.en.title);
				setITDescription(doc.content.it.description);
				setITText(doc.content.it.text);
				setITTitle(doc.content.it.title);
				setENUrl(doc.content.en.image);
				setOldENUrl(doc.content.en.image);
				setITUrl(doc.content.it.image);
				setOldITUrl(doc.content.it.image);
				setCurrentCategories(doc.categories.map(category=>`${category} \n`));
			});
		}
	}, [docsFromHook]);

	//File upload event listeners.
	const ENFileUploadEventListener = (e) => {
		let uploadedFile = e.target.files[0];
		if (uploadedFile && fileTypesArray.includes(uploadedFile.type)) {
			// eslint-disable-next-line no-inner-declarations
			async function putFile(File){
				e.preventDefault();
				try {
					setENFileUploadError("");
					setENFileTypeError("");
					const storageRef = projectStorage.ref("articles_pictures/").child(Date.now()+File.name);
					storageRef.put(File).on("state_changed", () => {
					},  (err) => {
						window.alert(err);
					}, async()=>{
						const finalUrl = await storageRef.getDownloadURL();
						finalUrl!==undefined? setENFileSuccess(true): setENFileSuccess(false);
						setENUrl(finalUrl);
					});
				} catch {
					setENFileUploadError("Failed to upload file");
				}
			}
			putFile(uploadedFile).then();
		} else {
			setENFileTypeError("Please select an image file (png or jpg)");
		}
	};

	const ITFileUploadEventListener = (e) => {
		let uploadedFile = e.target.files[0];
		if (uploadedFile && fileTypesArray.includes(uploadedFile.type)) {
			// eslint-disable-next-line no-inner-declarations
			async function putFile(uploadedFile){
				e.preventDefault();
				try {
					setITFileUploadError("");
					setITFileTypeError("");
					const storageRef = projectStorage.ref("articles_pictures/").child(Date.now()+uploadedFile.name);
					storageRef.put(uploadedFile).on("state_changed", () => {
					},  (err) => {
						window.alert(err);
					}, async()=>{
						const finalUrl = await storageRef.getDownloadURL();
						finalUrl!==undefined? setITFileSuccess(true): setITFileSuccess(false);
						setITUrl(finalUrl);
					});
				} catch {
					setITFileUploadError("Failed to upload file");
				}

			}
			putFile(uploadedFile).then();
		} else {
			setITFileTypeError("Please select an image file (png or jpg)");
		}
	};

	//Writing data to the database function.
	const publishArticleCFTrigger = () => {
		const addData = functions.httpsCallable("publishArticle");
		publishBtnRef.current&&publishBtnRef.current.setAttribute("disabled", "disabled");
		addData({
			"id": stringifiedSlug,
			"content": {
				"en": {
					"description": ENDescription,
					"text": ENText,
					"title": ENTitle,
					"image": ENUrl,
				},
				"it": {
					"description": ITDescription,
					"text": ITText,
					"title": ITTitle,
					"image": ITUrl,
				},
			},
			"categories": categoryArr.filter(value=>value!=="")

		})
			.then(() => {
				publishBtnRef.current&&publishBtnRef.current.removeAttribute("disabled");
				window.alert("Article edited successfully!");
				history.push("/UserProfilePage", {from: "/EditArticleForm"});
			}
			).catch((error) => {
				window.aler("Error: " + error.code + " " + error.message + " " + error.details);
			});

	};

	return (
		<>
			<section style={{paddingTop: "20em"}}>
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
									Titolo
									<input
										className='form-article__input'
										type="text"
										required
										value={ITTitle}
										onChange={
											(e)=>setITTitle(e.target.value)
										}
									/>
								</label>
								<label className='form-article__label'>
									Description
									<textarea
										className='form-article__input'
										rows='1'
										name="text"
										value={ITDescription}
										onChange={
											(e)=>setITDescription(e.target.value)
										}
									></textarea>
								</label>

								<label className='form-article__label'>
                                    Content
									<textarea
										className='form-article__input'
										rows='2'
										name="countent"
										value={ITText}
										onChange={
											(e)=>setITText(e.target.value)
										}
									></textarea>
								</label>
								<div>
									Miniatura attuale:
									<img style={{width: "25%", height: "auto"}} src={OldITUrl} alt=""/>
								</div>
								<div className="form-article__box-btn">

									<label className='form-article__label btn-upload'> <span className='icon-upload2'></span> Upload
										<input
											className='form-article__btn visually-hidden'
											type="file"
											placeholder='file'
											onChange={ITFileUploadEventListener}
										/>
									</label>
									<div className="output">
										{ ITFileUploadError!=="" && <div className="error">{ ITFileUploadError }</div>}
										{ ITFileTypeError!=="" && <div className="error">{ ITFileTypeError }</div> }
										{ ITFileSuccess&&<div>Immagine caricata con successo: <img style={{width: "25%", height: "auto"}} src={ITUrl} alt=""/></div> }
									</div>
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
									Title
									<input
										className='form-article__input'
										type="text"
										required
										value={ENTitle}
										onChange={
											(e)=>setENTitle(e.target.value)
										}/>
								</label>
								<label className='form-article__label'>
									<textarea
										className='form-article__input'
										rows='1'
										name="text"
										value={ENDescription}
										required
										onChange={
											(e)=>setENDescription(e.target.value)
										}
									></textarea>
								</label>

								<label className='form-article__label'>
                                    Content
									<textarea
										className='form-article__input'
										rows='2'
										name="countent"
										value={ENText}
										required
										onChange={
											(e)=>setENText(e.target.value)
										}
									></textarea>
								</label>
								<div>
                                    Current thumbnail:
									<img style={{width: "25%", height: "auto"}} src={OldENUrl} alt=""/>
								</div>
								<div className="form-article__box-btn">

									<label className='form-article__label btn-upload'>
										<span className='icon-upload2'></span>
										Upload
										<input
											className='form-article__btn visually-hidden'
											type="file"
											placeholder='file'
											onChange={ENFileUploadEventListener}
										/>
									</label>
									<div className="output">
										{ ENFileUploadError!=="" && <div className="error">{ ENFileUploadError }</div>}
										{ ENFileTypeError!=="" && <div className="error">{ ENFileTypeError }</div> }
										{ ENFileSuccess&&<div>Image Uploaded successfully: <img style={{width: "25%", height: "auto"}} src={ENUrl} alt=""/></div> }
									</div>
								</div>
							</form>
						</div>
					</div>

					<div className="form-article__checkbox-title form-article__label">
						{t("EditArticleForm.ArticleCategory")}: {currentCategories?currentCategories:""}
					</div>

					<label className="form-article__label-check">
						<input
							type="checkbox"
							onChange={()=>videoGamesSwitch===0?setVideoGamesSwitch(1):setVideoGamesSwitch(0)}
						/> {t("EditArticleForm.VideoGames")}
					</label>

					<label className="form-article__label-check">
						<input
							type="checkbox"
							onChange={()=>musicSwitch===0?setMusicSwitch(1):setMusicSwitch(0)}
						/> {t("EditArticleForm.Music")}
					</label>

					<label className="form-article__label-check">
						<input
							type="checkbox"
							onChange={()=>moviesSwitch===0?setMoviesSwitch(1):setMoviesSwitch(0)}
						/> {t("EditArticleForm.Movies")}
					</label>

					<button
						ref={publishBtnRef}
						className="form-article__btn"
						onClick={()=>publishArticleCFTrigger()}
					>
						{t("EditArticleForm.SaveChanges")}
					</button>
				</div>
			</section>
		</>
	);
}