import React from 'react'
import {Link} from "react-router-dom"
import {useAuth} from "../contexts/AuthContext"

export default function PrivateLink({component: Component, ...rest}) {
    const {currentUser} = useAuth()

    return (
        <Link
            {...rest}
            render={props => {
                return currentUser ? <Component {...props}/> : <Link to="/login"/>
            }}>
        </Link>
    )
}