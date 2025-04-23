"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import '../../../styles/EmployeeCard.css';
import { useSearchParams } from 'next/navigation';
import PenIcon from '../../common/icons/pen';
import { authFetch } from '../../utils/authFetch';


const ProjectSearch = () => {
    const searchParams = useSearchParams();
    const employeeId = searchParams.get("employeeId");

    enum Status {
        HOLD = "HOLD",
        STARTED = "STARTED",
        PLANNED = "PLANNED",
        ACTIVE = "ACTIVE",
    }

    type Project = {
        id: number;
        name: string;
        description: string;
        startDate: Date;
        endDate: Date;
        status: Status;
    };

    const [projects, setProjects] = useState<Project[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const endpoint = employeeId
                    ? `http://localhost:8090/api/projects/${employeeId}/projects`
                    : "http://localhost:8090/api/projects";

                const response = await authFetch(endpoint);
                const data = await response.json();
                setProjects(data);
            } catch (error) {
                console.error("Error fetching projects: ", error);
            }
        };

        fetchProjects();
    }, [employeeId]);

    // Filter projects by search term
    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <Container>
                {/*
                {employeeId && (
                    <Row className="p-3 m-3">
                        <Col >
                            <h1>Employee Projects</h1>
                        </Col>
                        <Col>
                            <Row>
                                <Col>
                                    <Link href={`/components/employee/employee_details?employeeId=${employeeId}`} passHref>
                                        <Button className='basic-custom-button-color basic-custom-button-size'>Details
                                        </Button>
                                    </Link>
                                </Col>
                                <Col>
                                    <Link href={`/components/employee/employee_timeoff?employeeId=${employeeId}`} passHref>
                                        <Button className='basic-custom-button-color basic-custom-button-size'>Time off
                                        </Button>
                                    </Link>
                                </Col>
                                <Col>
                                    <Link href={`/components/employee/employee_skills?employeeId=${employeeId}`} passHref>
                                        <Button className='basic-custom-button-color basic-custom-button-size'>Skills
                                        </Button>
                                    </Link>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                )}
                    */}
                <Row className="my-4">
                    <Col md={4}>
                        <Form.Control
                            type="text"
                            placeholder="Search projects by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Col>

                    {!employeeId && (
                        <Col>
                            <Link href="/components/projects/project_registration" passHref>
                                <Button variant='primary' style={{ cursor: "pointer" }}>New Project </Button>
                            </Link>
                        </Col>
                    )}
                </Row>

                <Row>
                    <Table striped bordered hover responsive>
                        <thead className='table-header'>
                            <tr>
                                <th className='text-center'>Name</th>
                                <th className='text-center'>Description</th>
                                <th className='text-center'>Start Date</th>
                                <th className='text-center'>End Date</th>
                                <th className='text-center'>Status</th>
                                {!employeeId && (<th className='text-center'>Edit</th>)}

                            </tr>
                        </thead>
                        <tbody>
                            {filteredProjects.length > 0 ? (
                                filteredProjects.map(project => (
                                    <tr key={project.id}>
                                        <td className='text-center'>{project.name}</td>
                                        <td className='text-center'>{project.description}</td>
                                        <td className='text-center'>{new Date(project.startDate).toLocaleDateString()}</td>
                                        <td className='text-center'>{new Date(project.endDate).toLocaleDateString()}</td>
                                        <td className='text-center'>{project.status}</td>
                                        {!employeeId && (<td className='text-center'>
                                            <Link href={`/components/projects/project_edit?projectId=${project.id}`} passHref>
                                                <Button variant='dark'><PenIcon /></Button>
                                            </Link>
                                        </td>)}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className='text-center'>No projects found</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Row>
            </Container>
        </div>
    )
}

export default ProjectSearch;