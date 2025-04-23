"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import '../../../styles/EmployeeCard.css';
import PenIcon from '../../common/icons/pen';
import { authFetch } from '../../utils/authFetch';


type Props = {
    projectId: string;
};

const VacancySearch = ({ projectId }: Props) => {

    enum Status {
        PENDING = "PENDING",
        APPROVED = "APPROVED",
    }

    type Vacancy = {
        id: number;
        name: string;
        description: string;
        requiredExperienceYears: number;
        requiredStartDate: Date;
        requiredEndDate: Date;
        status: Status;
    };

    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');

    type ProjectVacancyRelation = {
        employeeId: number | null;
        projectId: number;
        vacancyId: number;
        startDate: string | null;
        endDate: string | null;
    };

    useEffect(() => {
        const fetchVacancies = async () => {
            try {
                if (projectId) {
                    const projectResponse = await authFetch(`http://localhost:8090/api/projects/project/${projectId}`);
                    const projectData: ProjectVacancyRelation[] = await projectResponse.json();
                    const vacancyIds = projectData.map(item => item.vacancyId);

                    // Fetch each vacancy by ID (sequentially or in parallel)
                    const vacancyResponses = await Promise.all(
                        vacancyIds.map((id: number) =>
                            authFetch(`http://localhost:8090/api/vacancies/${id}`).then(res => res.json())
                        )
                    );

                    setVacancies(vacancyResponses);
                } else {
                    const response = await authFetch("http://localhost:8090/api/vacancies");
                    const data = await response.json();
                    setVacancies(data);
                }
            } catch (error) {
                console.error("Error fetching vacancies: ", error);
            }
        };

        fetchVacancies();
    }, [projectId]);

    const filteredVacancies = vacancies.filter(vacancy =>
        vacancy.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <Container>
                {/*
                {projectId && (
                    <Row>
                        <Col>
                            <h1>Project Vacancies</h1>
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
                                <Link href={`/components/projects/project_employees?projectId=${projectId}`} passHref>
                                    <Button variant='primary' style={{ cursor: "pointer" }}>Employees</Button>
                                </Link>
                            </Row>
                        </Col>
                    </Row>)}
                    */}

                <Row className="my-4">
                    <Col md={4}>
                        <Form.Control
                            type="text"
                            placeholder="Search vacancies by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Col>
                    {projectId && (
                        <Col>
                            <Link href={`/components/vacancies/vacancy_registration?projectId=${projectId}`} passHref>
                                <Button variant='primary' style={{ cursor: "pointer" }}>Create Project Vacancy</Button>
                            </Link>
                        </Col>)}
                </Row>

                <Row>
                    <Table striped bordered hover responsive>
                        <thead className='table-header'>
                            <tr>
                                <th className='text-center'>Name</th>
                                <th className='text-center'>Description</th>
                                <th className='text-center'>Required Years of Experience</th>
                                <th className='text-center'>Required Start Date</th>
                                <th className='text-center'>Required End Date</th>
                                <th className='text-center'>Status</th>
                                {projectId && (
                                    <th className='text-center'>Edit</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVacancies.length > 0 ? (
                                filteredVacancies.map(vacancy => (
                                    <tr key={vacancy.id}>
                                        <td className='text-center'>{vacancy.name}</td>
                                        <td className='text-center'>{vacancy.description}</td>
                                        <td className='text-center'>{vacancy.requiredExperienceYears}</td>
                                        <td className='text-center'>{new Date(vacancy.requiredStartDate).toLocaleDateString()}</td>
                                        <td className='text-center'>{new Date(vacancy.requiredEndDate).toLocaleDateString()}</td>
                                        <td className='text-center'>{vacancy.status}</td>
                                        {projectId && (
                                            <td className='text-center'>
                                                <Link href={`/components/vacancies/vacancy_edit?vacancyId=${vacancy.id}&projectId=${projectId}`} passHref>
                                                    <Button variant='dark'><PenIcon /></Button>
                                                </Link>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className='text-center'>No vacancies found</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Row>
            </Container>
        </div>
    )
}

export default VacancySearch;