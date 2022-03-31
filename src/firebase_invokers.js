import firebase from "firebase/compat/app"; 
import {app} from "./firebase_config.js";
import{ spawn }  from "child_process";
const db = firebase.firestore(app);



function sleep(milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
		currentDate = Date.now();
	} while (currentDate - date < milliseconds);
}


async function runapp(signIn,email,password) {
	
	firebase.auth().onAuthStateChanged(firebaseUser => {
		if(firebaseUser){
			invokeListeners(firebaseUser.uid);
		}
		else {
			console.log("Logged out client");
			signIn(email,password).then(user =>  {
				console.log(user);
			}). catch (err =>{
				console.log(err);
			});

		}


	});
	console.log("Trying to sign in user");
	
}




var refUserDetails= db.collection("Users");
async function invokeListeners(userUID) {
	return refUserDetails.doc(userUID).onSnapshot((snapshot) => {
		var userData=snapshot.data();
		console.log(userData);
		executeCubeView(userData.currentView);

	});
	
}


function constructArrayFromMap(commandmap) {
	var array = [];
	for (const [key, value] of Object.entries(commandmap)) {
		var arr= [key,value];
		if (key.slice(-1)=='=' || value == "") {
			arr=arr.join('');
		}
		array.push(arr);
	}
	return array.flat();

}

var refCubeView= db.collection("CubeViews");
var childProc;
function executeCubeView(cubeViewID) {
	refCubeView.doc(cubeViewID).onSnapshot((cubeView) => {
		var fb_flags=cubeView.data().flags;
		var flags=constructArrayFromMap(fb_flags);
		var command = cubeView.data().command;
		//remove "file" flag , workaround for pathname stuff 
		if(fb_flags['file']) {
			var index = flags.indexOf("file");
			if (index !== -1) {
				  flags.splice(index, 1);
			}
		}
		console.log(flags);

		if (childProc) {
				  childProc.kill(); 
		}
		childProc = spawn(command, flags);
		childProc.stdout.on('data', (data) => {
			  console.log(`stdout: ${data}`);
		});

		childProc.stderr.on('data', (data) => {
			  console.error(`stderr: ${data}`);
		});

		childProc.on('close', (code) => {
			  console.log(`child process exited with code ${code}`);
		});
	});
}



export { runapp}
