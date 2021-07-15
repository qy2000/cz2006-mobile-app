import React from 'react'
import firebase from '../firebase/config'

/**
 * Authenticates the user with Firebase database and returns his uid, profile if valid
 * @param {string} email 
 * @param {string} password 
 * @returns 
 */
const userEmailLogin = async(email, password) => {
	try {
		const response = await firebase.auth().signInWithEmailAndPassword(email, password)
		return {loginError: false, uid: response.user.uid}
	} catch(error) {
		return {loginError: true, loginErrorCode: error.code}
	}
}

/**
 * Reads and returns user profile from Firestore using the uid
 * @param {string} uid 
 * @returns profile data
 */
const getProfileFromFirebase = async (uid) => {
    const usersRef = firebase.firestore().collection('users')
    const doc = await usersRef.doc(uid).get()
	return {profileError: !doc.exists, profile: doc.exists ? doc.data() : null}
}

/**
 * Method exposed for email user login
 * @param {string} email 
 * @param {string} password 
 * @returns login response
 */
export const EmailLoginHandler = async (email, password) => {
	var loginResponse = await userEmailLogin(email, password)
	if(loginResponse.loginError)
		return loginResponse
		
	var profileResponse = await getProfileFromFirebase(loginResponse.uid)
	return {...loginResponse, ...profileResponse}
}

