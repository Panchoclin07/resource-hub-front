"use client"

import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { authFetch } from '../../utils/authFetch';
import toast from 'react-hot-toast';

type Props = {
    vacancyId: string;
    projectId: string;
};

const VacancyDetails = ({ vacancyId, projectId }: Props) => {
    //const today = new Date().toISOString().split('T')[0];

    enum Status {
        PENDING = "PENDING",
        APPROVED = "APPROVED",
    }

    const [form, setForm] = useState({
        name: '',
        description: '',
        requiredExperienceYears: '',
        requiredStartDate: '',
        requiredEndDate: '',
        status: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const vacancyBO = {
            name: form.name,
            description: form.description,
            requiredExperienceYears: form.requiredExperienceYears,
            requiredStartDate: form.requiredStartDate,
            requiredEndDate: form.requiredEndDate,
            status: form.status,
        };

        try {
            const response = await authFetch(`http://localhost:8090/api/vacancies/${vacancyId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(vacancyBO)
            });

            if (response.ok) {
                toast.success("Vacancy updated successfully!");
            } else {
                toast.error("Something went wrong!");
                console.log(vacancyBO);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    useEffect(() => {
        if (!vacancyId) return;

        const fetchData = async () => {
            try {
                const vacancyResponse = await authFetch(`http://localhost:8090/api/vacancies/${vacancyId}`);

                const vacancyData = await vacancyResponse.json();
                console.info(vacancyData);

                setForm(vacancyData);
            }
            catch (error) {
                console.error("Error fetching vacancy details: ", error);
            }
        }
        fetchData();
    }, [vacancyId]);

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Container className='mt-4'>
                    <Col>
                        {/*
                        <Row className="p-3 m-3">
                            <Col >
                                <h1>Vacancy Details</h1>
                            </Col>
                            <Col>
                                <Row>
                                    <Col>
                                        <Link href={`vacancy_skills?vacancyId=${vacancyId}&projectId=${projectId}`} passHref>
                                            <Button className='basic-custom-button-color basic-custom-button-size'>Skills
                                            </Button>
                                        </Link>
                                    </Col>
                                    {projectId && projectId !== "null" && (
                                        <Col>
                                            <Link href={`/components/employee/employee_search?vacancyId=${vacancyId}&projectId=${projectId}`} passHref>
                                                <Button variant='primary' style={{ cursor: "pointer" }}>Assign Employee</Button>
                                            </Link>
                                        </Col>)}
                                </Row>
                            </Col>
                        </Row>
                        */}

                        <Row className="mb-3">
                            <label>Vacancy Name</label>
                            <Form.Control type="text" placeholder="Enter the vacancy's name here" name='name' value={form?.name || ""} onChange={handleChange} />
                        </Row>

                        <Row className="mb-3">
                            <label>Description</label>
                            <Form.Control type="text" placeholder="Enter a description for the vacancy here" name='description' value={form?.description || ""} onChange={handleChange} />
                        </Row>

                        <Row className="mb-3">
                            <label>Years of Experience</label>
                            <Form.Control type="number" placeholder="Enter the required years of experience" name='requiredExperienceYears' value={form?.requiredExperienceYears || ''} onChange={handleChange} />
                        </Row>

                        <Row>
                            <Col className="mb-3">
                                <label>Required Start Date</label>
                                <Form.Control type="date" name="requiredStartDate" value={form?.requiredStartDate || ""} onChange={handleChange} />
                            </Col>

                            <Col className="mb-3">
                                <label>End Date</label>
                                <Form.Control type="date" name="requiredEndDate" value={form?.requiredEndDate || ""} onChange={handleChange} />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <label>Status</label>
                            <Form.Select aria-label="Default select example" name="status" value={form?.status || ""} onChange={handleChange} >
                                <option>Select an option...</option>
                                <option value={Status.PENDING}>PENDING</option>
                                <option value={Status.APPROVED}>APPROVED</option>
                            </Form.Select>
                        </Row>

                        <Row className="mt-5" align="right">
                            {/*<Link href="/components/select_field" passHref>*/}
                            <Button className='basic-custom-button-color' type="submit">
                                Update Vacancy
                            </Button>
                            {/*</Link>*/}
                        </Row>

                    </Col>
                </Container>
            </Form>
        </div>
    )
}

export default VacancyDetails;