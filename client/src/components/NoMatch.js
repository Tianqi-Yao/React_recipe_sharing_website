import React from "react"
import {useLocation} from "react-router-dom"

export default function NoMatch() {
    let location = useLocation()
    return (
        <>
            <h3>404,No path for {location.pathname}</h3>
        </>
    )
}