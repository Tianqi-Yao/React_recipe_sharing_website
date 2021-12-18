import React from "react"
import {useAuth} from "../contexts/AuthContext"
import {Link} from "react-router-dom"

export default function UserSignLogin() {
    const {currentUser, logout} = useAuth()

    async function handleLogout() {
        try {
            await logout()
        } catch (e) {
            console.log(e)
        }
    }

    const noUserLink = <>
        <Link className="showlink" to="/signup">Signup</Link>
        <Link className="showlink" to="/login">Login</Link>
    </>

    const hasUserLink = <>
        <Link className="showlink" onClick={handleLogout}>Logout</Link>
    </>

    return (currentUser ? hasUserLink : noUserLink)
}