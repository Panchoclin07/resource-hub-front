"use client"

import React, { useState } from 'react'
import { Navbar, Container, Button, Col } from "react-bootstrap";
import ListIcon from '../icons/list';
import Sidebar from '../sidebar';
import '../../../styles/HeaderComponent.css';
import LoginButton from '../../login_card/login_button';

const HeaderComponent = () => {
    const [showSidebar, setShowSidebar] = useState(false);

    const handleMenuClick = () => { setShowSidebar(prev => !prev); };

    const handleSidebarClose = () => { setShowSidebar(false); };

    //const handleLogout = () => { console.log("Logged Out"); };

    return (
        <>
            <Navbar className="header">
                <Container fluid className='p-0'>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center w-100">
                        <Col>
                            <Button onClick={handleMenuClick} className="mx-3 mb-2 mb-md-0 custom-button">
                                <ListIcon />
                            </Button>
                        </Col>
                        <Col className='d-flex justify-content-center'>
                            <Navbar.Brand className="header-title fs-4 mb-2 mb-md-0">Resource Hub</Navbar.Brand>
                        </Col>
                        <Col>
                            <LoginButton />
                        </Col>
                    </div>
                </Container>
            </Navbar >

            <Sidebar show={showSidebar} handleClose={handleSidebarClose} />
        </>
    );
};

export default HeaderComponent;