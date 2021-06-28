import React, {useEffect, useState} from "react";
import {useDataFromFirestore, useDataFromFirestoreBanners} from "../customHooks/useFirestore";
import {Link} from "react-router-dom";
import {useLanguageContext} from "../context/LanguageContext";
import { ShareLink } from "social-media-sharing";
import logoSection from "../assets/images/dest/logo-section.png";
import HtmlToReact from "html-to-react";

// eslint-disable-next-line no-undef
const queryString = require("query-string");

export default function Article() {
	const {docsFromHook} = useDataFromFirestore("articles");
	const {appLanguage} = useLanguageContext();
	const parsedWindowLocation = queryString.parse(window.location.hash);
	const stringifiedSlug = queryString.stringify(parsedWindowLocation).substr(13);

	const [vertical, setVertical] = useState("");
	const [_250x250320x100320x50,  set250x250320x100320x50] = useState("");
	const [Top, setTop] = useState("");
	const [bottom, setBottom] = useState("");

	const {docsFromHookBanners} = useDataFromFirestoreBanners("banners");

	let selectedBanners = "";

	useEffect(() => {
		if (docsFromHookBanners) {
			selectedBanners = docsFromHookBanners.filter(function (doc) {
				return doc.id === "individualArticlePage";
			});
		}
	});

	useEffect(() => {
		if (selectedBanners !== ""){
			selectedBanners.map(doc => {
				setVertical(doc.desktop.vertical);
				set250x250320x100320x50(doc.desktop._250x250320x100320x50);
				setTop(doc.mobile.top);
				setBottom(doc.mobile.bottom);
			});
		}
	}, [docsFromHookBanners]);

	const shareFacebook = () => {
		let socialMediaLinks = new ShareLink("facebook");
		socialMediaLinks.get({u: `http://mydomainfortesting.ml/#/article/${stringifiedSlug}`});
		socialMediaLinks.open();
	};

	let selectedArticle = "";

	if(docsFromHook) {
		//Filter the articles object and select the article who's slug corresponds to the current window slug
		selectedArticle = docsFromHook.filter(function (article) {
			return article.id === stringifiedSlug;
		});
	}

	// DB string tags parser
	const stringTagsParser = (tag) => {
		if(tag) {
			let  htmlInput = tag;
			let  htmlToReactParser = new HtmlToReact.Parser(React);
			let  reactComponent = htmlToReactParser.parse(htmlInput);
			return reactComponent;
		}
		return;
	};

	return(
		<section className="new-article">
			<div className="banner__commercial banner__commercial--left"></div>
			<div className="banner__commercial banner__commercial--right"></div>
			<div className="container">

				<section className="news">
					<div className="container">
						BANNERS:
						<ul>
							<li>{stringTagsParser(vertical)}</li>
							<li>{stringTagsParser(Top)}</li>
							<li>{stringTagsParser(_250x250320x100320x50)}</li>
							<li>{stringTagsParser(bottom)}</li>
						</ul>
					</div>
					{/*.replace(/^"(.*)"$/, "$1")*/}
				</section>

				{selectedArticle && selectedArticle.map(doc =>(
					<div key={doc.id}>
						<div className="new-article__title-box">
							<img src={logoSection} alt="" className="new-article__logo"/>
							<h1 className="new-article__title title">
                            Title: {doc.content[appLanguage].title}
							</h1>
						</div>

						<div className="new-article__inner">
							<div className="new-article__btn-bg">
								<Link to="/BlogPage">
									<button className="new-article__btn-back">Back <span>news</span></button>
								</Link>
							</div>
						</div>
						<div className="new-article__image">
							<img
								src={doc.content[appLanguage].image?doc.content[appLanguage].image:"https://firebasestorage.googleapis.com/v0/b/aki-dragon.appspot.com/o/articles_pictures%2Fdefault-placeholder-image.png?alt=media&token=1ead64c5-c3cc-4213-ac97-a391f8c15bf2"}
								className="articles-page__img"
								alt=""
							/>
						</div>

						<p className="new-article__text">
							<div className="banner banner__square banner__square--article"></div>

							<p className="new-article__text">
                            Content: {doc.content[appLanguage].text}
						</p>
						<div className="new-article__info">
						</div>
						<div className="btn-upload">
							<span className="icon-facebook2" onClick={()=>shareFacebook()}></span>
						</div>
						<div>
							<br/>
							<Link to = "/BlogPage">
								<button className="new--article__btn btn"><span>Other</span>news</button>
							</Link>
						</div>
					</div>
				)
							</p>
							<div className="new-article__info">
							</div>
							<div className="btn-upload">
								<span className="icon-facebook2" onClick={()=>shareFacebook()}></span>
							</div>
							<div>
								<br/>
								<Link to = "/BlogPage">
									<button className="new--article__btn btn"><span>Other</span>news</button>
								</Link>
							</div>

							<div className="banner banner__square banner__square--article"></div>
						</>
					)
				)}
			</div>
		</section>
	);
}