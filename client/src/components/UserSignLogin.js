import React from "react"
import {useAuth} from "../contexts/AuthContext"
import {Link, useHistory} from "react-router-dom"

export default function UserSignLogin() {
    const {currentUser, logout} = useAuth()
    const history = useHistory()

    async function handleLogout() {
        try {
            await logout()
        } catch (e) {
            console.log(e)
        }
    }

    if (currentUser) {
        return <>
            <Link className="showlink" to={`/userprofile/${currentUser.uid}`}>Hello {currentUser.displayName}</Link>
            <Link className="showlink" to="/" onClick={handleLogout}>Logout</Link>
        </>
    } else {
        return <>
            <Link className="showlink" to="/signup">Signup</Link>
            <Link className="showlink" to="/login">Login</Link>
        </>
    }
}