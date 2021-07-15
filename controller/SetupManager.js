import firebase from "../firebase/config";

/**
 * Creates a new data tuple for the new user
 * @param {string} user 
 * @param {object} data 
 */
export const storeUserProfile = async (user, data) => {
  const usersRef = firebase.firestore().collection("users");
  usersRef.doc(user).set(data);
}