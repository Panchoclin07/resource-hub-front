"use client"

import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { authFetch } from '../../utils/authFetch';


type Props = {
    projectId: string;
};

const ProjectDetails = ({ projectId }: Props) => {
    const today = new Date().toISOString().split('T')[0];

    enum Status {
        HOLD = "HOLD",
        STARTED = "STARTED",
        PLANNED = "PLANNED",
        ACTIVE = "ACTIVE",
    }

    const [form, setForm] = useState({
        name: '',
        description: '',
        startDate: today,
        endDate: '',
        status: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const projectBO = {
            name: form.name,
            description: form.description,
            startDate: form.startDate,
            endDate: form.endDate,
            status: form.status,
        };

        try {
            const response = await authFetch(`http://localhost:8090/api/projects/${projectId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(projectBO)
            });

            if (response.ok) {
                alert("Project updated successfully!");
            } else {
                alert("Something went wrong!");
                console.log(projectBO);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    useEffect(() => {
        if (!projectId) return;

        const fetchData = async () => {
            try {
                const projectResponse = await authFetch(`http://localhost:8090/api/projects/${projectId}`);

                const projectData = await projectResponse.json();
                console.info(projectData);

                setForm(projectData);
            }
            catch (error) {
                console.error("Error fetching project details: ", error);
            }
        }
        fetchData();
    }, [projectId]);

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Container>
                    <Col>
                        {/*
                        <Row>
                            <Col>
                                <h1>Project Details</h1>
                            </Col>
                            <Col>
                                <Row>
                                    <Link href={`/components/vacancies/vacancy_search?projectId=${projectId}`} passHref>
                                        <Button variant='primary' style={{ cursor: "pointer" }}>Vacancies</Button>
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

                        </Row>
                        */}

                        <Row className="mb-3">
                            <label>Project Name</label>
                            <Form.Control type="text" placeholder="Enter the project's name here" name='name' value={form?.name || ""} onChange={handleChange} />
                        </Row>

                        <Row className="mb-3">
                            <label>Description</label>
                            <Form.Control type="text" placeholder="Enter a description for the project here" name='description' value={form?.description || ""} onChange={handleChange} />
                        </Row>

                        <Row>
                            <Col className="mb-3">
                                <label>Start Date</label>
                                <Form.Control type="date" name="startDate" value={form?.startDate || ""} onChange={handleChange} />
                            </Col>

                            <Col className="mb-3">
                                <label>End Date</label>
                                <Form.Control type="date" name="endDate" value={form?.endDate || ""} onChange={handleChange} />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <label>Experience Level</label>
                            <Form.Select aria-label="Default select example" name="status" value={form?.status || ""} onChange={handleChange}>
                                <option>Select an option...</option>
                                <option value={Status.HOLD}>HOLD</option>
                                <option value={Status.STARTED}>STARTED</option>
                                <option value={Status.PLANNED}>PLANNED</option>
                                <option value={Status.ACTIVE}>ACTIVE</option>
                            </Form.Select>
                        </Row>

                        <Row className="mt-5" align="right">
                            {/*<Link href="/components/select_field" passHref>*/}
                            <Button className='basic-custom-button-color' type="submit">
                                Update Project
                            </Button>
                            {/*</Link>*/}
                        </Row>

                    </Col>
                </Container>
            </Form>
        </div>
    )
}

export default ProjectDetails;