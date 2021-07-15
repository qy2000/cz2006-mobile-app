import React from 'react'
import firebase from '../firebase/config'

/**
 * Updates the user's profile on Firestore
 * @param {string} uid 
 * @param {object} profile 
 */
export const updateProfileToFirebase = async (uid, profile) => {
    const usersRef = firebase.firestore().collection('users')
    const doc = await usersRef.doc(uid).set(profile)
}