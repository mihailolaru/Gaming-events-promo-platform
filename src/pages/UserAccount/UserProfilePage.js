import React, {useEffect, useState} from 'react';
import ShortArticlesList from "../../components/ShortArticlesList";
import {Link} from "react-router-dom";
import {useAuthContext} from "../../context/AuthContext";
import {useDataFromFirestore} from "../../customHooks/useFirestore";
import {projectFirestore} from "../../fireBase";
import {useTranslation} from "react-i18next";

export default function UserProfilePage() {
  console.log("UserProfilePage");
    const {t} = useTranslation();
  const { currentUser } = useAuthContext();
  const CurrentUserFromLS = JSON.parse(localStorage.getItem('LSCurrentUser'));
  //const {docsFromHook} = useDataFromFirestore('user-profiles');
  //const currentUserExtraInfoLS = JSON.parse(localStorage.getItem('currentUserExtraInfo'));
  //const moderatorLS = JSON.parse(localStorage.getItem('currentUserRole'));
  const [ moderator, setModerator ] = useState();
  const [ currentUserExtraInfoFB, setCurrentUserExtraInfoFB ] = useState({});
  const [ currentUserDbPointsInfo, setCurrentUserDbPointsInfo ] = useState();

  useEffect(() => {
    async function getCurrentUserExtraInfo() {
      if (currentUser || CurrentUserFromLS) {
        await projectFirestore
            .collection('user-profiles')
            .doc(CurrentUserFromLS.uid).get().then((doc) => {
          if (doc.exists) {
            setCurrentUserExtraInfoFB(doc.data());
          } else {
            console.log("No such document!");
          }
        })
            .catch((error) => {
              console.log("Error getting document:", error);
            });
        }
    }

    async function checkCurrentUserRole() {
      console.log("checkCurrentUserRole() worked");
      await projectFirestore
          .collection("roles")
          .doc(currentUser?currentUser.uid:CurrentUserFromLS.uid)
          .get()
          .then((doc)=>{
            if(doc.exists){
              return doc.data().moderator===true?setModerator(true):setModerator(false);
            }else{
              return setModerator(false);
            }
          });
    }

    async function getDoc(){
      await projectFirestore
          .collection('score')
          .doc(CurrentUserFromLS.uid).get().then((doc)=>{
            if(doc.exists){
              setCurrentUserDbPointsInfo(doc.data());
            }else{
              console.log("No such document!");
            }
          })
          .catch((error) => {
            console.log("Error getting document:", error);
          });
    }

    getCurrentUserExtraInfo().then(()=>console.log("Got the user info!")).catch(()=>console.error("could not get current use extra info."));
    checkCurrentUserRole().then(()=>console.log(moderator)).catch(()=>console.error("could not get current use role."));
    getDoc().then(()=>console.log("Got the user info for update!")).catch(()=>console.error("could not get current use extra info."));
    //console.log(currentUserDbPointsInfo);

  }, []);

  return (
    <>
      <section className="profile" key={currentUser?currentUser.uid:CurrentUserFromLS.uid}>
        <div className="container">
          <div className="profile__inner">
            <div className="profile__box">
              <div className="profile__image">
                {currentUserExtraInfoFB&&
                  <img className="profile__img" src={currentUserExtraInfoFB.photoURL?currentUserExtraInfoFB.photoURL:"https://firebasestorage.googleapis.com/v0/b/aki-dragon.appspot.com/o/profile_pictures%2Fdepositphotos_199564354-stock-illustration-creative-vector-illustration-default-avatar.jpg?alt=media&token=5f904560-36a3-4425-9386-960fa63a92e6"} alt=""/>
                }
              </div>
              <ul className="profile__list">
                <li className="profile__item"> {moderator?<strong>{t('UserProfilePage.ModeratorPage')}:</strong>:<strong>{t('UserProfilePage.ProfilePage')}:</strong>}</li>
                <li className="profile__item">Email: {currentUser?currentUser.email:CurrentUserFromLS.email}</li>
                <li className="profile__item">{t('UserProfilePage.EmailVerified')}: {currentUser?currentUser.emailVerified===false||CurrentUserFromLS.emailVerified===false?"false":"true":""}</li>
                {currentUserExtraInfoFB&&
                    <>
                      <li className="profile__item">{t('UserProfilePage.FirstName')}: {currentUserExtraInfoFB.firstName}</li>
                      <li className="profile__item">{t('UserProfilePage.LastName')}: {currentUserExtraInfoFB.lastName}</li>
                    </>
                }
                {currentUserDbPointsInfo?
                  <li className="profile__item">{t('UserProfilePage.AvailablePoints')}: {currentUserDbPointsInfo.value}</li>:
                  <li className="profile__item">{t('UserProfilePage.AvailablePoints')}: 0</li>
                }
                <br/>
              </ul>
            </div>
            {moderator&&
            <ul className="profile__settings">
              <li>
                <div className="profile__settings-title">
                  <span className="icon-cog"></span> {t('UserProfilePage.Actions')}:
                </div>
                <ul className="profile__settings-list">
                  <li className="profile__settings-item">
                    <Link className='profile__settings-link' to='/ModeratorAddStreamsForm'>{t('UserProfilePage.Add streams')}</Link>
                  </li>
                  <li className="profile__settings-item">
                    <Link className='profile__settings-link' to='/ModeratorAddTournamentsForm'>{t('UserProfilePage.AddTournaments')}</Link>
                  </li>
                  <li className="profile__settings-item">
                    <Link className='profile__settings-link' to='/AddArticlesForm'>{t('UserProfilePage.AddArticles')}</Link>
                  </li>
                  <li className="profile__settings-item">
                    <Link className='profile__settings-link' to='/ManageArticlesPage'>{t('UserProfilePage.ManageArticles')}</Link>
                  </li>
                  <li className="profile__settings-item">
                    <Link className='profile__settings-link' to='/ManageStreamsPage'>{t('UserProfilePage.ManageStreams')}</Link>
                  </li>
                  <li className="profile__settings-item">
                    <Link className='profile__settings-link' to='/ManageTournamentsPage'>{t('UserProfilePage.ManageTournaments')}</Link>
                  </li>
                  <li className="profile__settings-item">
                    <Link className='profile__settings-link' to='/ApproveArticlesPage'>{t('UserProfilePage.ApproveArticles')}</Link>
                  </li>
                  <li className="profile__settings-item">
                    <Link className='profile__settings-link' to='/CMSMenu'>{t('UserProfilePage.EditStaticContent')}</Link>
                  </li>
                  {/*<li className="profile__settings-item">*/}
                  {/*  <Link className='profile__settings-link' to='/MainSurveyPage'>Take the survey</Link>*/}
                  {/*</li>*/}
                </ul>
              </li>
            </ul>
            }
          </div>
        </div>
      </section>

      <section className="article-profile">
        <div className="container">
          <h2 className='article-profile__title title'>Article</h2>
          <div className="article-profile__inner">
            <Link className='article-profile__btn' to="/UserProfileArticlesPage">See All</Link>
            <ShortArticlesList/>
          </div>
        </div>
      </section>
    </>
  );
}