import React from 'react'
import firebase from '../firebase/config'

/**
 * Handles the creation of user account on Firebase
 * @param {string} email 
 * @param {string} password 
 * @returns 
 */
export const userEmailSignup = async(email, password) => {
	try {
		const response = await firebase.auth().createUserWithEmailAndPassword(email, password)
		return {signUpError: false, uid: response.user.uid}
	} catch(error) {
		return {signUpError: true, signUpErrorCode: error.code}
	}
}
