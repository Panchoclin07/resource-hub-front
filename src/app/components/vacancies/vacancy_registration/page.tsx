"use client"

import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { authFetch } from '../../utils/authFetch';

const VacancyRegistration = () => {
    const today = new Date().toISOString().split('T')[0];

    const searchParams = useSearchParams();
    const projectId = searchParams.get("projectId");

    enum Status {
        PENDING = "PENDING",
        APPROVED = "APPROVED",
    }

    const [form, setForm] = useState({
        name: '',
        description: '',
        requiredExperienceYears: '',
        requiredStartDate: today,
        requiredEndDate: '',
        status: Status,
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
            const response = await authFetch("http://localhost:8090/api/vacancies", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(vacancyBO),
            });

            if (response.ok) {
                const createdVacancy = await response.json();
                const vacancyId = createdVacancy.id;

                // If there's a projectId, assign the vacancy to the project
                if (projectId && vacancyId) {
                    const assignResponse = await authFetch(`http://localhost:8090/api/projects/vacancies?projectId=${projectId}&vacancyId=${vacancyId}`, {
                        method: "POST",
                    });

                    if (!assignResponse.ok) {
                        throw new Error("Failed to assign vacancy to project");
                    }
                }

                alert("Vacancy created successfully!");
            } else {
                alert("Something went wrong!");
                console.log(vacancyBO);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Something went wrong!");
        }
    }

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Container>
                    <Col>
                        <Row>
                            <h1>Create New Vacancy</h1>
                        </Row>

                        <Row className="mb-3">
                            <label>Vacancy Name</label>
                            <Form.Control type="text" placeholder="Enter the vacancy's name here" name='name' onChange={handleChange} />
                        </Row>

                        <Row className="mb-3">
                            <label>Description</label>
                            <Form.Control type="text" placeholder="Enter a description for the vacancy here" name='description' onChange={handleChange} />
                        </Row>

                        <Row className="mb-3">
                            <label>Years of Experience</label>
                            <Form.Control type="number" placeholder="Enter the required years of experience" name='requiredExperienceYears' onChange={handleChange} />
                        </Row>

                        <Row>
                            <Col className="mb-3">
                                <label>Required Start Date</label>
                                <Form.Control type="date" defaultValue={today} name="requiredStartDate" onChange={handleChange} />
                            </Col>

                            <Col className="mb-3">
                                <label>Required End Date</label>
                                <Form.Control type="date" defaultValue={today} name="requiredEndDate" onChange={handleChange} />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <label>Status</label>
                            <Form.Select aria-label="Default select example" name="status" onChange={handleChange}>
                                <option>Select an option...</option>
                                <option value={Status.PENDING}>PENDING</option>
                                <option value={Status.APPROVED}>APPROVED</option>
                            </Form.Select>
                        </Row>

                        <Row className="mt-5" align="right">
                            {/*<Link href="/components/select_field" passHref>*/}
                            <Button className='basic-custom-button-color' type="submit">
                                Create Vacancy
                            </Button>
                            {/*</Link>*/}
                        </Row>

                    </Col>
                </Container>
            </Form>
        </div>
    )
}

export default VacancyRegistration;