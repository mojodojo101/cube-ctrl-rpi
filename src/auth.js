import firebase from "firebase/compat/app"; 
import "firebase/compat/auth";
import {app} from "./firebase_config.js";


const auth= firebase.auth();



//probably dont need this on the pi later
function createUser(email,password) {
	auth.createUserWithEmailAndPassword(auth, email )
		.then((userCredential) => {
			// Signed in 
			const user = userCredential.user;
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
		});


}


//probably dont need this on the pi later
function deleteUser(email,password) {

}


async function signIn(email,password) {
	var myuser=firebase.auth().signInWithEmailAndPassword(email, password)
		.then((userCredential) => {
			// Signed in
			var user = userCredential.user;
			return user;
			// ...
		})
		.catch((error) => {
			var errorCode = error.code;
			var errorMessage = error.message;
			console.log(error);
			throw error;
		});

	return myuser;
}


function signOut() {
	firebase.auth().signOut().then(() => {
		// Sign-out successful.
		console.log("User signed out");
	}).catch((error) => {
		// An error happened.
	});
}

export { createUser, deleteUser, signIn,signOut }
