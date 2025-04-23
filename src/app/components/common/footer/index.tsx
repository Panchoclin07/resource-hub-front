import React from 'react'
import { Container } from 'react-bootstrap';
import '../../../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer d-flex align-items-center">
            <Container className="text-center">
                <span className='text-muted footer-title'>© {new Date().getFullYear()} Resource Hub. All rights reserved</span>
            </Container>
        </footer>
    )
}

export default Footer;