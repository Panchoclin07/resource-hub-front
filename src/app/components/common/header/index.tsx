
import React from 'react'
import { Button, Col, Row } from 'react-bootstrap';
import '../../styles/Header.css';
import ListIcon from '../icons/list';
import Link from 'next/link';

interface HeaderProps {
    toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
    return (
        <header className="header">
            <Row>
                {/*This button will need to be created as it's own component */}
                <Col className="mt-4 ml-4" align="left">
                    <Button onClick={toggleSidebar} className="custom-button">
                        <ListIcon />
                    </Button>
                </Col>

                {/*This will be able to be kept the same, maybe adding an icon*/}
                <Col className="mt-3" align="center">
                    <h1 className="header-title">
                        This is a Header
                    </h1>
                </Col>

                {/*This button will be simple, we'd just need to call a function that is in charge of doing the logging out*/}
                <Col className="mt-4 mr-4" align="right">
                    <Link href="/" passHref>
                        <Button className="custom-button">Logout Button</Button>
                    </Link>
                </Col>
            </Row>
        </header >
    )
}

export default Header;