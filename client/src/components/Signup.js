import React, {useRef, useState} from "react"
import {Alert, Button, Card, Form} from "react-bootstrap"
import {useAuth} from "../contexts/AuthContext"
import {Link, useHistory} from "react-router-dom"
import axios from "axios"

export default function Signup() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const userNameRef = useRef()
    const {signup, getCurrentUser} = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    async function handleSubmit(e) {
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Passwords do not match")
        }

        try {
            setError("")
            setLoading(true)
            await signup(emailRef.current.value, passwordRef.current.value, userNameRef.current.value)
            let newUserObj = getCurrentUser()
            console.log(newUserObj)
            // newUserObj.userName = userNameRef.current.value
            // newUserObj.email = emailRef.current.value
            await axios.post('http://localhost:3001/users', {
                uid: newUserObj.uid,
                userName: newUserObj.displayName
            })
            // updateCurrentUser(newUserObj)
            history.push(`/userprofile/${newUserObj.uid}`)
        } catch (e) {
            console.log(e)
            setError("Failed to create an account")
        }

        setLoading(false)
    }

    function handleChange(e) {
        e.preventDefault()
        if (passwordRef.current.value.length < 6) {
            setError("At least six length")
        } else {
            setError("")
        }
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Sign Up</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit} onChange={handleChange}>
                        <Form.Group id="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="username" ref={userNameRef} required/>
                        </Form.Group>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required/>
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required/>
                        </Form.Group>
                        <Form.Group id="password-confirm">
                            <Form.Label>Password Confirmation</Form.Label>
                            <Form.Control type="password" ref={passwordConfirmRef} required/>
                        </Form.Group>
                        <Button disabled={loading} className="w-100" type="submit">
                            Sign Up
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                Already have an account? <Link to="/login">Log In</Link>
            </div>
        </>
    )
}
