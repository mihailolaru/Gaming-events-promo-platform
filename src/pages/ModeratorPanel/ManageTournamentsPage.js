import React from "react";
import {useDataFromFirestore} from "../../customHooks/useFirestore";
import {Button} from "react-bootstrap";
import {projectFirestore} from "../../fireBase";
import {Link} from "react-router-dom";
import {useTournamentsContext} from "../../context/TournamentsContext";
import { v4 as uuidv4 } from "uuid";

function ManageTournamentsPage() {
	//Getting data from the database.
	const {docsFromHook} = useDataFromFirestore("tournaments");

	//Importing vars from the context.
	const {setChosenTournamentNumber} = useTournamentsContext();

	//Filtering data from the database
	const passedEvents = docsFromHook.filter(function (doc) {
		return doc.eventStatus === "passed";
	});

	const futureEvents = docsFromHook.filter(function (doc) {
		return doc.eventStatus === "future";
	});

	//Templates START
	const PassedMatchTemp = (doc) => {
		let date = new Date(doc.eventDate);
		let parsedDate = date.toString();

		return (
			<li className="tab__item" key={uuidv4()}>
				<div className="tab__image">
					<img
						className="tab__img"
						src={doc.eventBanner}
						alt="some text"/>
				</div>
				<div className="tab__content">
					<a className="tab__title">Category: {doc.eventCategory}</a>
					<div className="tab__name">Title: {doc.eventTitle}</div>
					<br/>
					<div className="tab__date">Event date: {parsedDate}</div>
				</div>
				<ul className="tab__icon">
					<li className="tab__item-icon">
						<a className="tab__link-icon">
							<img className="tab__img"
								src={doc.eventWinner1 ? doc.eventWinner1 : "https://firebasestorage.googleapis.com/v0/b/aki-dragon.appspot.com/o/articles_pictures%2Fdefault-placeholder-image.png?alt=media&token=1ead64c5-c3cc-4213-ac97-a391f8c15bf2"}
								alt=""/>
						</a>
					</li>
					<li className="tab__item-icon">
						<a className="tab__link-icon">
							<img className="tab__img"
								src={doc.eventWinner2 ? doc.eventWinner2 : "https://firebasestorage.googleapis.com/v0/b/aki-dragon.appspot.com/o/articles_pictures%2Fdefault-placeholder-image.png?alt=media&token=1ead64c5-c3cc-4213-ac97-a391f8c15bf2"}
								alt=""/>
						</a>
					</li>
				</ul>
				<div className='tab__btn-body'>
					<div className="tab__btn">
						<button className="tab__link-strim">
							<a className="" href={doc.eventVideoLink}>Watch</a>
						</button>
						<button className="tab__link-info">
							<a className="" href={doc.eventInfoPage}>Info</a>
						</button>

						<Link
							className="tab__link-info"
							to={`/edit-tournament/${doc.id}`}
							onClick={()=>setChosenTournamentNumber(doc.id)}
						> Update </Link>
						<Button
							className="tab__link-info del"
							ariant="danger"
							onClick={() => {
								projectFirestore.collection("tournaments").doc(doc.id).delete().then(() => {
									window.alert("Document successfully deleted!");
								}).catch((error) => {
									window.alert("Error removing document: ", error);
								});
							}}
						> Delete </Button>
					</div>
				</div>
			</li>
		);
	};

	const PassedTournTemp = (doc) => {
		let date = new Date(doc.eventDate);
		let parsedDate = date.toString();

		return (
			<li className="tab__item" key={uuidv4()}>
				<div className="tab__image">
					<img
						className="tab__img"
						src={doc.eventBanner}
						alt="some text"/>
				</div>
				<div className="tab__content">
					<a className="tab__title">Category: {doc.eventCategory}</a>
					<div className="tab__name">Title: {doc.eventTitle}</div>
					<br/>
					<div className="tab__date">Event date: {parsedDate}</div>
				</div>
				<ul className="tab__icon">
					<li className="tab__item-icon">
						<a className="tab__link-icon">
							<img
								className="tab__img"
								src={doc.eventWinner1 ? doc.eventWinner1 : "https://firebasestorage.googleapis.com/v0/b/aki-dragon.appspot.com/o/articles_pictures%2Fdefault-placeholder-image.png?alt=media&token=1ead64c5-c3cc-4213-ac97-a391f8c15bf2"}
								alt=""/>
						</a>
					</li>
				</ul>
				<div className="tab__btn-body">
					<div className="tab__btn">
						<button className="tab__link-strim">
							<a className="" href={doc.eventVideoLink}>Watch</a>
						</button>
						<button className="tab__link-info">
							<a className="" href={doc.eventInfoPage}>Info</a>
						</button>

						<Link
							className="tab__link-info"
							to={`/edit-tournament/${doc.id}`}
							onClick={()=>setChosenTournamentNumber(doc.id)}
						> Update </Link>
						<Button
							className="tab__link-info del"
							ariant="danger"
							onClick={() => {
								projectFirestore.collection("tournaments").doc(doc.id).delete().then(() => {
									window.alert("Document successfully deleted!");
								}).catch((error) => {
									window.alert("Error removing document: " + error);
								});
							}}
						> Delete </Button>
					</div>
				</div>
			</li>
		);
	};

	const FutureMatchTemp = (doc) => {
		let date = new Date(doc.eventDate);
		let parsedDate = date.toString();

		return (
			<li className="tab__item" key={uuidv4()}>
				<div className="tab__image">
					<img
						className="tab__img"
						src={doc.eventBanner}
						alt="banner"/>
				</div>
				<div className="tab__content">
					<a className="tab__title">Category: {doc.eventCategory}</a>
					<div className="tab__name">Title: {doc.eventTitle}</div>
					<br/>
					<div className="tab__date">Event date: {parsedDate}</div>
				</div>
				<ul className="tab__icon">
					<li className="tab__item-icon">
						<a href="#" className="tab__link-icon">
							<img
								className="tab__img"
								src={doc.pictureURL1 ? doc.pictureURL1 : "https://firebasestorage.googleapis.com/v0/b/aki-dragon.appspot.com/o/articles_pictures%2Fdefault-placeholder-image.png?alt=media&token=1ead64c5-c3cc-4213-ac97-a391f8c15bf2"}
								alt=""/>
						</a>
					</li>
					<li className="tab__item-icon">
						<a className="tab__link-icon">
							<img
								className="tab__img"
								src={doc.pictureURL2 ? doc.pictureURL2 : "https://firebasestorage.googleapis.com/v0/b/aki-dragon.appspot.com/o/articles_pictures%2Fdefault-placeholder-image.png?alt=media&token=1ead64c5-c3cc-4213-ac97-a391f8c15bf2"}
								alt=""/>
						</a>
					</li>
				</ul>
				<div className='tab__btn-body'>
					<div className="tab__btn">
						<button className="tab__link-strim">
							<a className="" href={doc.eventVideoLink}>Watch</a>
						</button>
						<button className="tab__link-info">
							<a className="" href={doc.eventInfoPage}>Info</a>
						</button>
						<Link
							className="tab__link-info"
							to={`/edit-tournament/${doc.id}`}
							onClick={()=>setChosenTournamentNumber(doc.id)}
						> Update </Link>
						<Button
							className="tab__link-info del"
							variant="danger"
							onClick={() => {
								projectFirestore.collection("tournaments").doc(doc.id).delete().then(() => {
									window.alert("Document successfully deleted!");
								}).catch((error) => {
									window.alert("Error removing document: " + error);
								});
							}}
						> Delete </Button>
					</div>
				</div>
			</li>
		);
	};

	const FutureTournTemp = (doc) => {
		let date = new Date(doc.eventDate);
		let parsedDate = date.toString();

		return (
			<li className="tab__item" key={uuidv4()}>

				<div className="tab__image">
					<img
						className="tab__img"
						src={doc.eventBanner}
						alt="some text"/>
				</div>
				<div className="tab__content">
					<a className="tab__title">Category: {doc.eventCategory}</a>
					<div className="tab__name">Title: {doc.eventTitle}</div>
					<br/>
					<div className="tab__date">Event date: {parsedDate}</div>
				</div>
				<ul className="tab__icon">
					<li className="tab__item-icon">
						<a href="#" className="tab__link-icon">
							<img
								className="tab__img"
								src={doc.pictureURL1 ? doc.pictureURL1 : "https://firebasestorage.googleapis.com/v0/b/aki-dragon.appspot.com/o/articles_pictures%2Fdefault-placeholder-image.png?alt=media&token=1ead64c5-c3cc-4213-ac97-a391f8c15bf2"}
								alt=""/>
						</a>
					</li>
					<li className="tab__item-icon">
						<a href="#" className="tab__link-icon">
							<img
								className="tab__img"
								src={doc.pictureURL2 ? doc.pictureURL2 : "https://firebasestorage.googleapis.com/v0/b/aki-dragon.appspot.com/o/articles_pictures%2Fdefault-placeholder-image.png?alt=media&token=1ead64c5-c3cc-4213-ac97-a391f8c15bf2"}
								alt=""/>
						</a>
					</li>
					<li className="tab__item-icon">
						<a href="#" className="tab__link-icon">
							<img
								className="tab__img"
								src={doc.pictureURL3 ? doc.pictureURL3 : "https://firebasestorage.googleapis.com/v0/b/aki-dragon.appspot.com/o/articles_pictures%2Fdefault-placeholder-image.png?alt=media&token=1ead64c5-c3cc-4213-ac97-a391f8c15bf2"}
								alt=""/>
						</a>
					</li>
					<li className="tab__item-icon">
						<a className="tab__link-icon">
							<img
								className="tab__img"
								src={doc.pictureURL4 ? doc.pictureURL4 : "https://firebasestorage.googleapis.com/v0/b/aki-dragon.appspot.com/o/articles_pictures%2Fdefault-placeholder-image.png?alt=media&token=1ead64c5-c3cc-4213-ac97-a391f8c15bf2"}
								alt=""/>
						</a>
					</li>
				</ul>
				<div className='tab__btn-body'>
					<div className="tab__btn">
						<button className="tab__link-strim">
							<a className="" href={doc.eventVideoLink}>Watch</a>
						</button>
						<button className="tab__link-info">
							<a className="" href={doc.eventInfoPage}>Info</a>
						</button>
						<Link
							className="tab__link-info"
							to={`/edit-tournament/${doc.id}`}
							onClick={()=>setChosenTournamentNumber(doc.id)}
						> Update </Link>
						<Button
							className="tab__link-info del"
							ariant="danger"
							onClick={() => {
								projectFirestore.collection("tournaments").doc(doc.id).delete().then(() => {
									window.alert("Document successfully deleted!");
								}).catch((error) => {
									window.alert("Error removing document: " + error);
								});
							}}
						> Delete </Button>
					</div>
				</div>
			</li>
		);
	};
	//Templates END

	return (
		<>
			<main className="page">
				<section className="tournament">
					<div className="container">
						<div className="tournament__tab tab">
							<div className="tab__body">
								<ul className="tab__list active" id="tab_1">
									{passedEvents && passedEvents.map(doc =>
										doc.eventCategory === "match" ? PassedMatchTemp(doc) : PassedTournTemp(doc)
									)}
									{futureEvents && futureEvents.map(doc =>
										doc.eventCategory === "match" ? FutureMatchTemp(doc) : FutureTournTemp(doc)
									)}
								</ul>
							</div>
						</div>
					</div>
					<Link className='tournament__btn btn' to='/ModeratorAddTournamentsForm'>Add tournaments</Link>
				</section>
			</main>
		</>
	);
}

export default ManageTournamentsPage;
