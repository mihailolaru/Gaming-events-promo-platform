//TODO Make this page + translation.
// TODO Start from defining the states and assigning a slug on creating teams
/* eslint-disable no-mixed-spaces-and-tabs */
import React, {useEffect, useState} from "react";
import {useDataFromFirestoreCMS} from "../../customHooks/useFirestore";
import {Link} from "react-router-dom";
import {useTeamsContext} from "../../context/TeamsContext";
import {useLanguageContext} from "../../context/LanguageContext";
import {useTranslation} from "react-i18next";

export default function GameTeamsPage() {
	const {t} = useTranslation();
	const {appLanguage} = useLanguageContext();

	const [ITGamingTeamBannerUrl, setITGamingTeamBannerUrl] = useState("");
	const [ENGamingTeamBannerUrl, setENGamingTeamBannerUrl] = useState("");
	const [ITGamingTeamText, setITGamingTeamText] = useState("");
	const [ENGamingTeamText, setENGamingTeamText] = useState("");

	const [gameTeamMembersArr, setGameTeamMembersArr] = useState([]);

	const {setChosenTeamNumber} = useTeamsContext();
	const {docsFromHookCMS} = useDataFromFirestoreCMS("web-app-cms");

   	let teamsArr = [];
	let selectedDoc = "";

	useEffect(() => {
		if (docsFromHookCMS) {
			selectedDoc = docsFromHookCMS.filter(function (doc) {
				return doc.id === "game-teams";
			});
		}
		console.log(selectedDoc);
	});

	console.log(docsFromHookCMS);


	useEffect(() => {
		if (selectedDoc !== "") {
			selectedDoc.map(doc => {
				doc.gameTeams.map(member => teamsArr.push({...member}));
				setGameTeamMembersArr(teamsArr);

				setITGamingTeamBannerUrl(doc.topBanner.it);
				setENGamingTeamBannerUrl(doc.topBanner.en);
				setITGamingTeamText(doc.text.it);
				setENGamingTeamText(doc.text.en);
			});
		}
	}, [docsFromHookCMS]);

	return (
		<>
			<div>
				<div>{t("GameSalesPage.GamingTeam")}</div>
				<div>
					<img src={appLanguage === "it" ? ITGamingTeamBannerUrl : ENGamingTeamBannerUrl} alt="" className="feed__img"/>
					{appLanguage === "it" ? ITGamingTeamText : ENGamingTeamText}
				</div>
			</div>

			<div>
				<div>
					{gameTeamMembersArr && gameTeamMembersArr.map(team => (
						<article className="article" key={team.slug}>
							<img
								src={team.avatar[appLanguage] ? team.avatar[appLanguage] : "https://firebasestorage.googleapis.com/v0/b/aki-dragon.appspot.com/o/articles_pictures%2Fdefault-placeholder-image.png?alt=media&token=1ead64c5-c3cc-4213-ac97-a391f8c15bf2"}
								alt="" className="article__image"/>
						

							<ul>								
								<li className="social__item">
									<a href={team.social.facebook} className="social__link">
										<span className="icon-facebook2"> </span>
									</a>
								</li>
								<li className="social__item">
									<a href={team.social.instagram} className="social__link">
										<span className="icon-instagram"> </span>
									</a>
								</li>
								<li className="social__item">
									<a href={team.social.youtube} className="social__link">
										<span className="icon-youtube"> </span>
									</a>
								</li>
								<li className="social__item">
									<a href={team.social.twitch} className="social__link">
										<span className="icon-twitch"> </span>
									</a>
								</li>
							</ul>
						
							<Link to={`/team/${team.slug}`} className="article__link" onClick={() => setChosenTeamNumber(team.slug)}>{team.title[appLanguage]}</Link>
						</article>
					))}
				</div>

				<div>{t("GameSalesPage.JoinUs")}</div>
				<div className="contact__btn">
					<Link className="contact__btn-link" to="/ContactUsPage">
						{t("GameSalesPage.ContactsButton")}
					</Link>
				</div>
			</div>
		</>
	);
}