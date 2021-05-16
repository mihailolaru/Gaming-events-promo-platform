import React from 'react';
import {useDataFromFirestore} from "../../customHooks/useFirestore";
import {Button} from "react-bootstrap";
import {projectFirestore} from "../../fireBase";
import {Link, useHistory} from "react-router-dom";
import {useTournamentsContext} from "../../context/TournamentsContext";

function ManageTournamentsPage() {
    const history = useHistory();
    const {docsFromHook} = useDataFromFirestore('tournaments');
    const {setChosenTournamentNumber} = useTournamentsContext();
    const passedEvents = docsFromHook.filter(function (doc) {
        return doc.eventStatus === "passed";
    });

    const futureEvents = docsFromHook.filter(function (doc) {
        return doc.eventStatus === "future";
    });

//Templates
    const PassedMatchTemp = (doc) => {
        return (
            <li className="tab__item">
            <div className="tab__image"
                 style={{
                     background: "blue",
                     url: "#",
                     position: "center",
                     backgroundSize: "cover",
                     backgroundRepeat: "no-repeat"
                 }}>
            </div>
            <div className="tab__content">
                <a className="tab__title">{doc.eventCategory}</a>
                <div className="tab__name">{doc.eventTitle}</div>
                <date className="tab__date">{new Date(Date.parse(doc.eventDate))}</date>
            </div>
            <ul className="tab__icon">
                <li className="tab__item-icon">
                    <a className="tab__link-icon">
                        <img className="tab__img" src={doc.eventWinner1?doc.eventWinner1:"https://firebasestorage.googleapis.com/v0/b/aki-dragon.appspot.com/o/articles_pictures%2Fdefault-placeholder-image.png?alt=media&token=1ead64c5-c3cc-4213-ac97-a391f8c15bf2"} alt=""/>
                    </a>
                </li>
                <li className="tab__item-icon">
                    <a className="tab__link-icon">
                        <img className="tab__img" src={doc.eventWinner2?doc.eventWinner2:"https://firebasestorage.googleapis.com/v0/b/aki-dragon.appspot.com/o/articles_pictures%2Fdefault-placeholder-image.png?alt=media&token=1ead64c5-c3cc-4213-ac97-a391f8c15bf2"} alt=""/>
                    </a>
                </li>
            </ul>
            <div className="tab__btn">
                <button className="tab__link-strim">
                    <a className="" href={doc.eventVideoLink}>Watch</a>
                </button>
                <button className="tab__link-info">
                    <a className="" href={doc.eventInfoPage}>Info</a>Info
                </button>
            </div>

                <Button
                    variant="danger"
                    onClick={()=>{
                        projectFirestore.collection("tournaments").doc(doc.id).delete().then(() => {
                            window.alert("Document successfully deleted!");
                        }).catch((error) => {
                            console.error("Error removing document: ", error);
                        });
                    }}
                >
                    DELETE
                </Button>
                <Link to="/ModifyTournamentForm">
                <Button>
                    UPDATE
                </Button>
                </Link>
        </li>

        );
    }

    const PassedTournTemp = (doc) => {
        return (<li className="tab__item">
            <div className="tab__image"
                 style={{
                     background: "blue",
                     url: "#",
                     position: "center",
                     backgroundSize: "cover",
                     backgroundRepeat: "no-repeat"
                 }}>
            </div>
            <div className="tab__content">
                <a className="tab__title">{doc.eventCategory}</a>
                <div className="tab__name">Rambow Six Siege</div>
                <date className="tab__date">{doc.eventDate}</date>
            </div>
            <ul className="tab__icon">
                <li className="tab__item-icon">
                    <a className="tab__link-icon">
                        <img
                            className="tab__img"
                            src={doc.eventWinner1?doc.eventWinner1:"https://firebasestorage.googleapis.com/v0/b/aki-dragon.appspot.com/o/articles_pictures%2Fdefault-placeholder-image.png?alt=media&token=1ead64c5-c3cc-4213-ac97-a391f8c15bf2"}
                            alt=""/>
                    </a>
                </li>
            </ul>
            <div className="tab__btn">
                <button className="tab__link-strim">
                    <a className="" href={doc.eventVideoLink}>Watch</a>
                </button>
                <button className="tab__link-info">
                    <a className="" href={doc.eventInfoPage}>Info</a>Info
                </button>
            </div>
                <Button
                    variant="danger"
                    onClick={()=>{
                        projectFirestore.collection("TEMP-tournaments").doc(doc.id).delete().then(() => {
                            window.alert("Document successfully deleted!");
                        }).catch((error) => {
                            console.error("Error removing document: ", error);
                        });
                    }}
                >DELETE</Button>
            <Link onClick={()=> {
                setChosenTournamentNumber(doc.id);
                history.push(`/tournament/${doc.id}`, {from: "/ManageTournamentsPage"});
            }}  >
                <Button>
                    UPDATE
                </Button>
            </Link>
        </li>
        );
    }

    const FutureMatchTemp = (doc) => {
        return (<li className="tab__item">
            <div className="tab__image"
                 style={{
                     background: "blue",
                     url: "#",
                     position: "center",
                     backgroundSize: "cover",
                     backgroundRepeat: "no-repeat"
                 }}>
            </div>
            <div className="tab__content">
                <a className="tab__title">{doc.eventCategory}</a>
                <div className="tab__name">{doc.eventTitle}</div>
                <date className="tab__date">{doc.eventDate}</date>
            </div>
            <ul className="tab__icon">
                <li className="tab__item-icon">
                    <a href="#" className="tab__link-icon">
                        <img
                            className="tab__img"
                            src={doc.pictureURL1?doc.pictureURL1:"https://firebasestorage.googleapis.com/v0/b/aki-dragon.appspot.com/o/articles_pictures%2Fdefault-placeholder-image.png?alt=media&token=1ead64c5-c3cc-4213-ac97-a391f8c15bf2"}
                            alt=""/>
                    </a>
                </li>
                <li className="tab__item-icon">
                    <a className="tab__link-icon">
                        <img
                            className="tab__img"
                            src={doc.pictureURL2?doc.pictureURL2:"https://firebasestorage.googleapis.com/v0/b/aki-dragon.appspot.com/o/articles_pictures%2Fdefault-placeholder-image.png?alt=media&token=1ead64c5-c3cc-4213-ac97-a391f8c15bf2"}
                            alt=""/>
                    </a>
                </li>
            </ul>
            <div className="tab__btn">
                <button className="tab__link-strim">
                    <a className="" href={doc.eventVideoLink}>Watch</a>
                </button>
                <button className="tab__link-info">
                    <a className="" href={doc.eventInfoPage}>Info</a>Info
                </button>
            </div>
                <Button
                    variant="danger"
                    onClick={()=>{
                        projectFirestore.collection("TEMP-tournaments").doc(doc.id).delete().then(() => {
                            window.alert("Document successfully deleted!");
                        }).catch((error) => {
                            console.error("Error removing document: ", error);
                        });
                    }}
                >
                    DELETE
                </Button>
                <Link onClick={()=> {
                    setChosenTournamentNumber(doc.id);
                    history.push(`/tournament/${doc.id}`, {from: "/ManageTournamentsPage"});//check which one works!!!!
                }}  >
                    <Button>
                        UPDATE
                    </Button>
                </Link>
        </li>
        );
    }

    const FutureTournTemp = (doc) => {
        return (<li className="tab__item">
            <div className="tab__image"
                 style={{
                     background: "blue",
                     url: "#",
                     position: "center",
                     backgroundSize: "cover",
                     backgroundRepeat: "no-repeat"
                 }}>
            </div>
            <div className="tab__content">
                <a className="tab__title">{doc.eventCategory}</a>
                <div className="tab__name">{doc.eventTitle}</div>
                <date className="tab__date">{doc.eventDate}</date>
            </div>
            <ul className="tab__icon">
                <li className="tab__item-icon">
                    <a href="#" className="tab__link-icon">
                        <img
                            className="tab__img"
                            src={doc.pictureURL1?doc.pictureURL1:"https://firebasestorage.googleapis.com/v0/b/aki-dragon.appspot.com/o/articles_pictures%2Fdefault-placeholder-image.png?alt=media&token=1ead64c5-c3cc-4213-ac97-a391f8c15bf2"} alt=""/>
                    </a>
                </li>
                <li className="tab__item-icon">
                    <a href="#" className="tab__link-icon">
                        <img
                            className="tab__img"
                            src={doc.pictureURL2?doc.pictureURL2:"https://firebasestorage.googleapis.com/v0/b/aki-dragon.appspot.com/o/articles_pictures%2Fdefault-placeholder-image.png?alt=media&token=1ead64c5-c3cc-4213-ac97-a391f8c15bf2"}
                            alt=""/>
                    </a>
                </li>
                <li className="tab__item-icon">
                    <a href="#" className="tab__link-icon">
                        <img
                            className="tab__img"
                            src={doc.pictureURL3?doc.pictureURL3:"https://firebasestorage.googleapis.com/v0/b/aki-dragon.appspot.com/o/articles_pictures%2Fdefault-placeholder-image.png?alt=media&token=1ead64c5-c3cc-4213-ac97-a391f8c15bf2"}
                            alt=""/>
                    </a>
                </li>
                <li className="tab__item-icon">
                    <a className="tab__link-icon">
                        <img
                            className="tab__img"
                            src={doc.pictureURL4?doc.pictureURL4:"https://firebasestorage.googleapis.com/v0/b/aki-dragon.appspot.com/o/articles_pictures%2Fdefault-placeholder-image.png?alt=media&token=1ead64c5-c3cc-4213-ac97-a391f8c15bf2"}
                            alt=""/>
                    </a>
                </li>
            </ul>
            <div className="tab__btn">
                <button className="tab__link-strim">
                    <a className="" href={doc.eventVideoLink}>Watch</a>
                </button>
                <button className="tab__link-info">
                    <a className="" href={doc.eventInfoPage}>Info</a>Info
                </button>
            </div>
                <Button
                    variant="danger"
                    onClick={()=>{
                        projectFirestore.collection("TEMP-tournaments").doc(doc.id).delete().then(() => {
                            window.alert("Document successfully deleted!");
                        }).catch((error) => {
                            console.error("Error removing document: ", error);
                        });
                    }}
                >
                    DELETE
                </Button>
                <Link onClick={()=> {
                    setChosenTournamentNumber(doc.id);
                    history.push(`/tournament/${doc.id}`, {from: "/ManageTournamentsPage"});//check which one works!!!!
                }}  >
                    <Button>
                        UPDATE
                    </Button>
                </Link>
        </li>
        );
    }

    return (
        <>
            <main className="page">
                <section className="tournament">
                    <Link className='btn' to='/ModeratorAddTournamentsForm'>Add tournaments</Link>
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

                </section>
            </main>
        </>
    );
}

export default ManageTournamentsPage;
