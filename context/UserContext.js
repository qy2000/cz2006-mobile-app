import React, { createContext, useState } from 'react'

export const UserContext = createContext();

/**
 * Provides the UserContext
 * @param {Component} param0 The children component that can consume the UserContext
 * @returns UserProvider
 */
export const UserProvider = ({children}) => {
    const [user, setUser] = useState('');
    const [profile, setProfile] = useState(null)
    const [auth, setAuth] = useState(false)
    const [chatid, setchatid] = useState('')

    /**
     * Login the user by initialising his uid and profile
     * @param {string} uid  The uid of the user
     * @param {object} profile The profile information of the user
     */
    const login = (uid, profile) => {
        setUser(uid)
        setProfile(profile)
        setAuth(true)
    }

    /**
     * Logout the user by setting his uid to empty string
     */
    const logout = () => {
        setUser('')
        setAuth(false)
    }

    /**
     * Updates the user profile. Allows the user to manage/create his profile
     * @param {object} profile The profile information of the user
     */
    const updateProfile = (profile) => {
        setProfile(profile)
    }

    return(
        <UserContext.Provider value={{user, profile, auth, chatid, setchatid, login, logout, updateProfile}}>
            {children}
        </UserContext.Provider>
    )
}