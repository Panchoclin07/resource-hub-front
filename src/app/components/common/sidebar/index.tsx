"use client";

import React from "react";
import { Button, Offcanvas } from "react-bootstrap";
import '../../../styles/Sidebar.css';
import Link from "next/link";

type SidebarProps = {
    show: boolean;
    handleClose: () => void;
};

const Sidebar = ({ show, handleClose }: SidebarProps) => {
    return (
        <Offcanvas show={show} onHide={handleClose} placement="start" className="sidebar">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                {/*This is where future links or navigation will be*/}
                <Link href="/components/dashboard" passHref>
                    <Button className="sidebar-button" onClick={handleClose} style={{ cursor: "pointer" }}>Dashboard</Button>
                </Link>

                {/*
                <Link href="/components/employee/employee_registration" passHref>
                    <Button className="sidebar-button" onClick={handleClose} style={{ cursor: "pointer" }}>Employee Registration</Button>
                </Link>
                */}

                <Link href="/components/employee/employee_search" passHref>
                    <Button className="sidebar-button" onClick={handleClose} style={{ cursor: "pointer" }}>Employees</Button>
                </Link>
                <Link href="/components/catalogues" passHref>
                    <Button className="sidebar-button" onClick={handleClose} style={{ cursor: "pointer" }}>Skills Catalogue</Button>
                </Link>

                {/*
                <Link href="/components/projects/project_registration" passHref>
                    <Button className="sidebar-button" onClick={handleClose} style={{ cursor: "pointer" }}>Project Creation</Button>
                </Link>
                */}

                <Link href="/components/projects/project_search" passHref>
                    <Button className="sidebar-button" onClick={handleClose} style={{ cursor: "pointer" }}>Projects</Button>
                </Link>

                {/*
                <Link href="/components/vacancies/vacancy_registration" passHref>
                    <Button className="sidebar-button" onClick={handleClose} style={{ cursor: "pointer" }}>Vacancy Creation</Button>
                </Link>
                */}

                <Link href="/components/vacancies/vacancy_search" passHref>
                    <Button className="sidebar-button" onClick={handleClose} style={{ cursor: "pointer" }}>View Vacancies</Button>
                </Link>
                <Link href="/components/allocation_tracking/allocation_tracker" passHref>
                    <Button className="sidebar-button" onClick={handleClose} style={{ cursor: "pointer" }}>Allocation Tracking</Button>
                </Link>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default Sidebar;