  
import firebase from 'firebase/app';
import '@firebase/auth';
import '@firebase/firestore';

/**
 * Contains the configuration for Firebase and Firestore
 */
const firebaseConfig = {
	apiKey: "AIzaSyBtTlhSdTZUoF-lvUrfFtToKMlWknjszVA",
	authDomain: "befit-4305a.firebaseapp.com",
	databaseURL: "https://befit-4305a-default-rtdb.firebaseio.com",
	projectId: "befit-4305a",
	storageBucket: "befit-4305a.appspot.com",
	messagingSenderId: "274409655018",
	appId: "1:274409655018:web:83cd10ab74c43d6f482593",
	measurementId: "G-7VV1N436Y0"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase