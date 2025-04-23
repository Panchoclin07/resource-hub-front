import React from 'react';
import Link from "next/link";
import { Button, Form, Row, Col, Container, Card } from "react-bootstrap";
import '../../styles/LoginCard.css';

const LoginCard = () => {
    return (
        <main className="content">
            <Container>
                <Card className="p-5">
                    <Card.Title><h1>Employee Login</h1></Card.Title>
                    <Card.Body>
                        <Row className="mb-3">
                            <Row className="mb-3">
                                <label>Username</label>
                                <Form.Control type="text" placeholder="Enter your username here" />
                            </Row>

                            <Row className="mb-3">
                                <label>Password</label>
                                <Form.Control type="password" placeholder="Password" />
                            </Row>

                        </Row>
                        <Row className="mt-5" align="right">
                            <Col>
                                <Link href="/components/dashboard" passHref>
                                    <Button className='basic-custom-button-color'>Login</Button>
                                </Link>
                            </Col>
                        </Row>
                    </Card.Body>
                    <Card.Link href="/components/employee_registration">Forgot Password?</Card.Link>
                </Card>
            </Container>
        </main>
    )
}

export default LoginCard;