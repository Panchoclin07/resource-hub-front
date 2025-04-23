"use client"

import React, { useEffect, useState } from 'react'
import { Col, Container, Row, Table } from 'react-bootstrap';
import { authFetch } from '../../utils/authFetch';


type Props = {
    projectId: string;
};

const ProjectEmployees = ({ projectId }: Props) => {

    type ProjectEmployee = {
        employeeId: string;
        projectId: number;
        vacancyId: number;
        startDate: Date;
        endDate: Date;
    };

    const [projectEmployees, setProjectEmployees] = useState<ProjectEmployee[]>([]);

    useEffect(() => {
        const fetchProjectEmployees = async () => {
            try {
                const response = await authFetch(
                    `http://localhost:8090/api/projects/project/${projectId}`
                );
                const data: ProjectEmployee[] = await response.json();

                const withEmployees = data.filter(pe => pe.employeeId !== null);

                const uniqueByEmployee: ProjectEmployee[] = withEmployees.reduce(
                    (acc: ProjectEmployee[], curr: ProjectEmployee) => {
                        // Only add if we haven't seen this employeeId yet
                        if (!acc.some(e => e.employeeId === curr.employeeId)) {
                            acc.push(curr);
                        }
                        return acc;
                    },
                    []
                );

                setProjectEmployees(uniqueByEmployee);
            } catch (error) {
                console.error("Error fetching project employees: ", error);
            }
        };

        if (projectId) {
            fetchProjectEmployees();
        }
    }, [projectId]);

    return (
        <div>
            <Container className='p-0'>
                {!projectId && (
                    <Row>
                        <Col >
                            <h1>Project Employees</h1>
                        </Col>
                    </Row>
                )}

                {/*
                {projectId && (
                    <Row>
                        <Col >
                            <h1>Project Employees</h1>
                        </Col>
                        <Col>
                            <Row>
                                <Link href={`/components/projects/project_details?projectId=${projectId}`} passHref>
                                    <Button variant='primary' style={{ cursor: "pointer" }}>Project Details</Button>
                                </Link>
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <Link href={`/components/vacancies/vacancy_search?projectId=${projectId}`} passHref>
                                    <Button variant='primary' style={{ cursor: "pointer" }}>Vacancies</Button>
                                </Link>
                            </Row>
                        </Col>
                    </Row>
                )}
                    */}

                <Row className='mt-3'>
                    <Table striped bordered hover responsive>
                        <thead className='table-header'>
                            <tr>
                                <th className='text-center'>EmployeeID</th>
                                <th className='text-center'>Start Date</th>
                                <th className='text-center'>End Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projectEmployees.length > 0 ? (
                                projectEmployees.map(projectEmployee => (<tr key={projectEmployee.employeeId}>
                                    <td className='text-center'>{projectEmployee.employeeId}</td>
                                    <td className='text-center'>{new Date(projectEmployee.startDate).toLocaleDateString()}</td>
                                    <td className='text-center'>{new Date(projectEmployee.endDate).toLocaleDateString()}</td>
                                </tr>))
                            ) : (
                                <tr>
                                    <td colSpan={7} className='text-center'>No employees found</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Row>
            </Container>
        </div >
    )
}

export default ProjectEmployees;