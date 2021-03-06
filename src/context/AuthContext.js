/* eslint-disable no-mixed-spaces-and-tabs */
import React, {useState, useContext, useEffect} from "react";
//auth is the auth function we created in the firebase.js file. All functions called after auth. are firebase functions.
import {auth} from "../fireBase";
const authContext = React.createContext();

export function useAuthContext(){
	return useContext(authContext);
}

// eslint-disable-next-line react/prop-types
export function AuthContextProvider({ children }) {
	const [signUpFormUserUploadedFile, setSignUpFormUserUploadedFile] = useState("");
	const [userUploadedPictureUrl, setUserUploadedPictureUrl] = useState("");
	const [currentUser, setCurrentUser] = useState();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [hasAccount, setHasAccount] = useState(false);
	const [userPoints, setUserPoints] = useState(0);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	//const [userSurveyPassedStatus, setUserSurveyPassedStatus] = useState("");
	const [currentUserModerator, setCurrentUserModerator] = useState();
	const [userInfoCompleted, setUserInfoCompleted] = useState();
	const[moderator, setModerator] = useState(false);

   	const clearErrors = () => {
		setEmailError("");
		setPasswordError("");
	};

	const handleSignup = () => {
		clearErrors();
		auth
			.createUserWithEmailAndPassword(email, password)
			.catch((err) => {
				switch(err.code){
				case "auth/email-already-in-use":
				case "auth/invalid-email":
					setEmailError(err.message);
					break;
				case "auth/weak-password":
					setPasswordError(err.message);
					break;
				default: console.log(`Some crazy error that is not on my list. Here is the code: ${err.code}.`);
				}
			});
	};

	const handleLogin = () => {
		clearErrors();
		auth
			.signInWithEmailAndPassword(email, password)
			.catch((err) => {
				switch(err.code){
				case "auth/invalid-email":
				case "auth/user-disabled":
				case "auth/user-not-found":
					setEmailError(err.message);
					break;
				case "auth/wrong-password":
					setPasswordError(err.message);
					break;
				default: console.log(`Some crazy error that is not on the list: ${err.code}`);
				}
			}
			);
	};

   	const handleLogout = () => {		
		auth.signOut().then(()=>{
			localStorage.clear();
		});
	};

	// const createSurveyCheckInUserDoc = (User) => {
	// 	projectFirestore
	// 		.collection("user-profiles")
	// 		.doc(User.uid)
	// 		.update({surveyPassed: userSurveyPassedStatus})
	// 		.then(() => {
	// 			window.alert("Survey results successfully written!");
	// 		})
	// 		.catch((error) => {
	// 			window.alert("Error writing survey results: " + error);
	// 		});
	// };

	const clearInput = () => {
		setEmail("");
		setPassword("");
	};

	//User sate change listener
	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(user => {
			//Write user object to the LocalStorage to preserve it during pages refresh
			localStorage.setItem("LSCurrentUser", JSON.stringify(user));
			setCurrentUser(user);
			//Clears the login form fields
			clearInput();
		});
		return unsubscribe;
	}, [currentUser]);

	const value = {
		clearInput,
		currentUserModerator,
		// createSurveyCheckInUserDoc,
		// userSurveyPassedStatus,
		// setUserSurveyPassedStatus,
		userPoints,
		setUserPoints,
		auth,
		setCurrentUserModerator,
		hasAccount,
		setHasAccount,
		currentUser,
		setCurrentUser,
		email,
		setEmail,
		emailError,
		setEmailError,
		handleSignup,
		handleLogin,
		handleLogout,
		password,
		setPassword,
		passwordError,
		setPasswordError,
		firstName,
		setFirstName,
		lastName,
		setLastName,
		signUpFormUserUploadedFile,
		setSignUpFormUserUploadedFile,
		userUploadedPictureUrl,
		setUserUploadedPictureUrl,
		userInfoCompleted,
		setUserInfoCompleted,
		moderator,
		setModerator
	};

	return (
		<authContext.Provider value={value}>
			{children}
		</authContext.Provider>
	);
}