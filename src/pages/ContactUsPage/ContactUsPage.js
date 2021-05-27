import React, {useEffect, useState} from 'react';
import ContactUsForm from "./ContactUsForm";
import {useDataFromFirestoreCMS} from "../../customHooks/useFirestore";
import {useLanguageContext} from "../../context/LanguageContext";

function ContactUsPage(props) {
  const {appLanguage} = useLanguageContext();
  const {docsFromHookCMS} = useDataFromFirestoreCMS('web-app-cms');

  const [ENAddress, setENAddress] = useState("");
  const [ITAddress, setITAddress] = useState("");
  const [ENText, setENText] = useState("");
  const [ITText, setITText] = useState("");
  const [ENTitle, setENTitle] = useState("");
  const [ITTitle, setITTitle] = useState("");
  const [phone, setPhone] = useState("");

  let selectedDoc = "";

  useEffect(() => {
    console.log(docsFromHookCMS);
    if (docsFromHookCMS) {
      selectedDoc = docsFromHookCMS.filter(function (doc) {
        return doc.id === "contactUsPage";
      });
      console.log(selectedDoc);
    }
  });

  useEffect(() => {
    if (selectedDoc !== "") {
      selectedDoc.map(doc => {
        setENAddress(doc.address.en);
        setITAddress(doc.address.it);
        setENText(doc.text.en);
        setITText(doc.text.it);
        setENTitle(doc.title.en);
        setITTitle(doc.title.it);
        setPhone(doc.phone);
      })
    }
  }, [docsFromHookCMS]);

  return (
    <>
      <main className="page">
        <section className="contact-intro">
          <div className="container">
            <h1 className="contact-intro__title title"><span>{appLanguage==="it"?ITTitle:ENTitle}</span></h1>
            <p className="contact-intro__text">
              {appLanguage==="it"?ITText:ENText}
            </p>
            <ContactUsForm/>
          </div>
        </section>

        <section className="map">
          <div className="container">
            <ul className="map__list">
              <li className="map__item map__address">
                <span className="icon-location"> </span>
                {appLanguage==="it"?ITAddress:ENAddress}
              </li>
              <li className="map__item map__phone">
                <span className="icon-phone"> </span>
                <a href="tel:+390636712213">{phone}</a>
              </li>
              <li className="map__item map__chat">
                <span className="icon-whatsapp"> </span>
                Scrivici su Whatsapp
              </li>
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}

export default ContactUsPage;