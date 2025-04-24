"use client"

import React, { useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { authFetch } from '../../utils/authFetch';
import toast from 'react-hot-toast';

const ProjectRegistration = () => {
    const today = new Date().toISOString().split('T')[0];
    const router = useRouter();


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
        status: Status,
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
            const response = await authFetch("http://localhost:8090/api/projects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(projectBO)
            });

            if (response.ok) {
                toast.success("Project created successfully!");
                router.push(`/components/projects/project_search`);
            } else {
                toast.error("Something went wrong!");
                console.log(projectBO);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    }

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Container>
                    <Col>
                        <Row>
                            <h1>Create New Project</h1>
                        </Row>

                        <Row className="mb-3">
                            <label>Project Name</label>
                            <Form.Control type="text" placeholder="Enter the project's name here" name='name' onChange={handleChange} />
                        </Row>

                        <Row className="mb-3">
                            <label>Description</label>
                            <Form.Control type="text" placeholder="Enter a description for the project here" name='description' onChange={handleChange} />
                        </Row>

                        <Row>
                            <Col className="mb-3">
                                <label>Start Date</label>
                                <Form.Control type="date" defaultValue={today} name="startDate" onChange={handleChange} />
                            </Col>

                            <Col className="mb-3">
                                <label>End Date</label>
                                <Form.Control type="date" name="endDate" onChange={handleChange} />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <label>Experience Level</label>
                            <Form.Select aria-label="Default select example" name="status" onChange={handleChange}>
                                <option>Select an option...</option>
                                <option value="HOLD">HOLD</option>
                                <option value="STARTED">STARTED</option>
                                <option value="PLANNED">PLANNED</option>
                                <option value="ACTIVE">ACTIVE</option>
                            </Form.Select>
                        </Row>

                        <Row className="mt-5" align="right">
                            {/*<Link href="/components/select_field" passHref>*/}
                            <Button className='basic-custom-button-color' type="submit">
                                Create Project
                            </Button>
                            {/*</Link>*/}
                        </Row>

                    </Col>
                </Container>
            </Form>
        </div>
    )
}

export default ProjectRegistration;