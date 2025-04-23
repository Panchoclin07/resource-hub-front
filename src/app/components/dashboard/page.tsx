"use client";

import Link from 'next/link';
import { Container, Card, Row, Col } from 'react-bootstrap';

const sections = [
    {
        title: 'Employees',
        href: '/components/employee/employee_search',
        description: 'Manage and search employees.',
    },
    {
        title: 'Skills Catalogue',
        href: '/components/catalogues',
        description: 'View and manage skill definitions.',
    },
    {
        title: 'Projects',
        href: '/components/projects/project_search',
        description: 'Manage project assignments.',
    },
    {
        title: 'View Vacancies',
        href: '/components/vacancies/vacancy_search',
        description: 'Explore and handle open vacancies.',
    },
    {
        title: 'Allocation Tracking',
        href: '/components/allocation_tracking/allocation_tracker',
        description: 'Track employee allocations to projects.',
    },
];

const Dashboard = () => {

    return (
        <Container className="mt-5">
            <h2 className="mb-4 text-center">Welcome to the Dashboard</h2>
            <Row xs={1} md={2} lg={3} className="g-4">
                {sections.map((section, idx) => (
                    <Col key={idx}>
                        <Link href={section.href} passHref style={{ textDecoration: 'none' }} prefetch={true}>
                            <Card className="h-100 shadow-sm card-hover" style={{ cursor: 'pointer' }}>
                                <Card.Body>
                                    <Card.Title>{section.title}</Card.Title>
                                    <Card.Text>{section.description}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Dashboard;