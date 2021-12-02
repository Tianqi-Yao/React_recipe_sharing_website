import React, {useRef} from "react";
import {Form, Button, Card} from "react-bootstrap";
import {useAuth} from "../context/AuthContext";

export default function Signup() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const {signup} = useAuth()

    function handleSubmit(e) {
        e.preventDefault()
        signup(emailRef.current.value, passwordRef.current.value)
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Sign up</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required/>
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required/>
                        </Form.Group>
                        <Button className="w-100" type="submit">Sign Up</Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                Already have an account?
            </div>
        </>
    )
}