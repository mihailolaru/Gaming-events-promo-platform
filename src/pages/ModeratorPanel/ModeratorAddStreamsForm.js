import React, {useState} from 'react';
import classes from "./styles/ModeratorAddStreamsForm.module.scss";
//import {useArticlesContext} from "../../context/ArticlesContext";
import {projectFirestore, projectStorage} from "../../fireBase";
import {useHistory} from 'react-router-dom';
import {useAuthContext} from "../../context/AuthContext";
import {Dropdown} from "react-bootstrap";
//import Loader from "react-loader-spinner";
import ReactPlayer from "react-player/lazy";
import {sanitizeUrl} from "@braintree/sanitize-url";

export default function ModeratorAddStreamsForm(){
  console.log("ModeratorAddStreamsForm worked");

  const [error, setError] = useState(null);
  const fileTypesArray = ['image/png', 'image/jpeg'];
  const history = useHistory();
  const CurrentUserFromLS = JSON.parse(localStorage.getItem('LSCurrentUser'));
  const {currentUser} = useAuthContext();
  const [streamCategory, setStreamCategory] = useState('');
  const [videoURL, setVideoURL] = useState('');
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState('');
  const [fileSuccess, setFileSuccess] = useState(false);
  //const [uploadedPicFile, setUploadedPicFile] = useState('');

  const fileUploadEventListener = (e) => {
    let uploadedFile = e.target.files[0];
    if (uploadedFile && fileTypesArray.includes(uploadedFile.type)) {
      //setUploadedPicFile(uploadedFile);
      async function putFile(uploadedFile){
        e.preventDefault();
        try {
          setLoading(true);
          setError("");
          const storageRef = projectStorage.ref('profile_pictures/').child(uploadedFile.name);
          storageRef.put(uploadedFile).on('state_changed', (err) => {
          },  (err) => {
            window.alert(err);
          }, async()=>{
            const finalUrl = await storageRef.getDownloadURL();
            finalUrl!==undefined?setFileSuccess(true):setFileSuccess(false);
            setUrl(finalUrl);
          });
        } catch {
          setError("Failed to upload file");
        }
        setLoading(false);
      }
      putFile(uploadedFile).then(()=>console.log(url));
    } else {
      //setUploadedPicFile('');
      setError('Please select an image file (png or jpg)');
    }
  };

  const addStreamsWithFBCallback = (e) => {
    const collectionRef = projectFirestore.collection('streams').doc();

    if(loading === false) {
      collectionRef.set(
          {
            "authorID": currentUser ? currentUser.uid : CurrentUserFromLS.uid,
            "category": streamCategory,
            "videoURL": videoURL,
            "imageURL": url,
            "createdAt": Date.now()
          })
          .then(() => {
            window.alert("Stream added successfully!");
            history.push("/UserProfilePage", {from: "/ModeratorAddStreamsForm"});
            return console.log("To streams collection added successfully!");
          })
          .catch((error) => {
            console.error(error.code + " " + error.message + "" + error.details);
          });
    }
    e.preventDefault();
  }

  // const clearInput = () => {
  //   //setArticleCategory("");
  //   setVideoURL("");
  //   setUrl("");
  //   setUploadedPicFile('');
  //   setUrl('');
  //   setFileSuccess(false);
  //
  //   const desertRef = projectStorage.ref('streams_pictures/').child(uploadedPicFile.name);
  //
  //   if(desertRef){
  //     desertRef.delete().then(() => {
  //       console.log("uploaded image removed successfully");
  //     }).catch((error) => {
  //       console.log("could not delete the file because:" + error);
  //     });
  //   }
  // }

  return (
    <>
      <div className={classes.container}>
        <h1 className={classes.title}>Add Stream</h1>
        <form className="form">
          {videoURL&&
            <ReactPlayer
                url={videoURL ? videoURL : ""}
                controls={true}
                light={true}
                playing={false}
            />
          }
          <label className='btn-upload input'>
            Video URL
            <input
                className='form-update__input visually-hidden'
                type="text"
                placeholder='URL Video'
                value={videoURL}
                required
                onChange={
                  (e)=>setVideoURL(sanitizeUrl(e.target.value))
                }
            />

          </label>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {streamCategory!==''? streamCategory: "Stream category"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={()=>setStreamCategory("entertainment")}>Entertainment</Dropdown.Item>
              <Dropdown.Item onClick={()=>setStreamCategory("tournaments")}>Tournaments</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <br/>
          <div className={classes.btnInner}>
            <label className='form-article__label btn-upload'> <span className='icon-upload2'></span> Upload thumbnail
              <input
                  className='form-article__btn visually-hidden'
                  type="file"
                  placeholder='file'
                  required
                  onChange={fileUploadEventListener}
              />
            </label>
            <div className="output">
              { error && <div className="error">{ error }</div>}
              {fileSuccess&&
                <div>Image Uploaded successfully:
                  <img style={{width: "25%", height: "auto"}} src={url} alt=""/>
                </div>
              }
            </div>

            <button
                className="btn-upload"
                onClick={addStreamsWithFBCallback}
            >
              Submit
            </button>
            {/*<button*/}
            {/*    className="form-article__btn"*/}
            {/*    onClick={clearInput}*/}
            {/*>*/}
            {/*  Cancel*/}
            {/*</button>*/}
          </div>
        </form>
      </div>
    </>
  );
}