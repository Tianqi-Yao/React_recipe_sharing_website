import React, {useRef, useState} from "react"
import {Alert, Button, Card, Form} from "react-bootstrap"
import axios from "axios"
import {useAuth} from "../contexts/AuthContext"
import {Link, Redirect, useHistory} from "react-router-dom"
import database from "../config/awsUrl"

export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const {login, googleSignInWithPopup, currentUser} = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setError("")
            setLoading(true)
            let newUserObj = await login(emailRef.current.value, passwordRef.current.value)
            // await axios.post('http://localhost:3001/users', {uid: newUserObj.user.uid})
            history.push(`/userprofile/${newUserObj.user.uid}`)
        } catch {
            setError("Failed to log in")
        }

        setLoading(false)
    }

    async function handleGoogleSign(e) {
        e.preventDefault()
        try {
            let newUserObj = await googleSignInWithPopup()
            await axios.post(`${database}/users`, {
                uid: newUserObj.user.uid,
                userName: newUserObj.user.displayName
            })
            history.push(`/userprofile/${newUserObj.user.uid}`)
        } catch {
            setError("Failed to log in")
        }
    }

    return (
        currentUser ? <Redirect to={`/userprofile/${currentUser.uid}`}/> :
            <>
                <Card>
                    <Card.Body>
                        <h2 className="text-center mb-4">Log In</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group id="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" ref={emailRef} required/>
                            </Form.Group>
                            <Form.Group id="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" ref={passwordRef} required/>
                            </Form.Group>
                            <Button disabled={loading} className="w-100" type="submit">
                                Log In
                            </Button>
                        </Form>
                        <Button onClick={handleGoogleSign}>
                            Google Login
                        </Button>
                        <div className="w-100 text-center mt-3">
                            <Link to="/forgot-password">Forgot Password?</Link>
                        </div>
                    </Card.Body>
                </Card>
                <div className="w-100 text-center mt-2">
                    Need an account? <Link to="/signup">Sign Up</Link>
                </div>
            </>
    )
}
