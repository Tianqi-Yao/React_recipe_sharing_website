import React, {useContext, useEffect, useState} from "react"
import {auth} from "../config/firebase"
import {getAuth, signInWithPopup, GoogleAuthProvider} from 'firebase/auth'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState()
    const [Likes, setLikes] = useState()
    const [loading, setLoading] = useState(true)
    const [googleAuth, setGoogleAuth] = useState(new GoogleAuthProvider())

    const value = {
        currentUser,
        storeLikes,
        login,
        signup,
        logout,
        resetPassword,
        updateEmail,
        updatePassword,
        getCurrentUser,
        googleSignInWithPopup
        // updateCurrentUser
    }

    useEffect(() => {
        return auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })
    }, [])

    function signup(email, password, username) {
        return auth.createUserWithEmailAndPassword(email, password).then(
            (res) => {
                const user = auth.currentUser
                return user.updateProfile({
                    displayName: username
                })
            })
        // function (res) {
        //     return res.user.updateProfile({
        //         displayName: username
        //     })
        // })
    }

    function storeLikes(likes) {
        setLikes(likes)
    }

    function googleSignInWithPopup() {
        return auth.signInWithPopup(googleAuth)
    }

    function getCurrentUser() {
        return auth.currentUser
    }

    function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password)
    }

    function logout() {
        return auth.signOut()
    }

    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email)
    }

    function updateEmail(email) {
        return currentUser.updateEmail(email)
    }

    function updatePassword(password) {
        return currentUser.updatePassword(password)
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )

}