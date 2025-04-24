"use client"

import React, { useEffect, useState } from 'react';
import { Button, Form, Row, Col, Container } from "react-bootstrap";
import { useRouter } from 'next/navigation';
import { authFetch } from '../../utils/authFetch';
import toast from 'react-hot-toast';

const EmployeeRegistration = () => {
    const today = new Date().toISOString().split('T')[0];
    const router = useRouter();

    // Form state
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        accountEmail: '',
        startDate: today,
        experienceLevel: '',
        jobId: '',
        locationId: '',
        document: null,
    });

    const [document, setDocument] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length) setDocument(e.target.files[0])
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const employeeBO = {
            firstName: form.firstName,
            lastName: form.lastName,
            accountEmail: form.accountEmail,
            startDate: form.startDate,
            experienceLevel: form.experienceLevel,
        };

        const formData = new FormData();
        formData.append("employeeBO", new Blob([JSON.stringify(employeeBO)], { type: 'application/json' }));
        formData.append("jobId", form.jobId);
        formData.append("locationId", form.locationId);

        formData.append("document", document || new Blob());

        try {
            const response = await authFetch("http://localhost:8090/api/employees",

                {
                    method: "POST",
                    body: formData,
                });

            if (response.ok) {
                toast.success("Employee created successfully!");
                router.push(`/components/employee/employee_search`);
            } else {
                toast.error("Something went wrong!");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    type Job = {
        jobId: number;
        jobName: string;
    };

    type Location = {
        id: number;
        name: string;
    };

    const [jobs, setJobs] = useState<Job[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [jobsResponse, locationsResponse] = await Promise.all([
                    authFetch("http://localhost:8090/api/jobs"),
                    authFetch("http://localhost:8090/api/locations"),
                ]);

                const jobsData = await jobsResponse.json();
                const locationsData = await locationsResponse.json();

                setJobs(jobsData);
                setLocations(locationsData);
            } catch (error) {
                console.error("Error fetching jobs or locations: ", error);
            }
        };
        fetchData();

    }, []);

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Container>
                    <Row>
                        <h1>Create New Employee</h1>
                    </Row>

                    <Row>
                        <Col className="p-3">
                            <Row className="mb-3">
                                <label>First Name</label>
                                <Form.Control type="text" placeholder="Enter your first name here" name='firstName' onChange={handleChange} />
                            </Row>

                            <Row className="mb-3">
                                <label>Email</label>
                                <Form.Control type="email" placeholder="hello@example.com" name="accountEmail" onChange={handleChange} />
                            </Row>

                            <Row className="mb-3">
                                <label>Start Date</label>
                                <Form.Control type="date" defaultValue={today} name="startDate" onChange={handleChange} />
                            </Row>

                            <Row className="mb-3">
                                <label>Jobs</label>
                                <Form.Select aria-label="Default select example" name="jobId" onChange={handleChange}>
                                    <option value="">Select a job...</option>
                                    {jobs.map((job) => (
                                        <option key={job.jobId} value={job.jobId}>
                                            {job.jobName}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Row>
                        </Col>

                        <Col className="p-3">
                            <Row className="mb-3">
                                <label>Last Name</label>
                                <Form.Control type="text" placeholder="Enter your last name here" name="lastName" onChange={handleChange} />
                            </Row>


                            <Row className="mb-3">
                                <label>Experience Level</label>
                                <Form.Select aria-label="Default select example" name="experienceLevel" onChange={handleChange}>
                                    <option>Select an option...</option>
                                    <option value="JUNIOR">Junior</option>
                                    <option value="MID">Mid</option>
                                    <option value="SENIOR">Senior</option>
                                </Form.Select>
                            </Row>

                            <Row className="mb-3">
                                <label>CV</label>
                                <Form.Control type="file" name="document" onChange={handleFileChange} />
                            </Row>

                            <Row className="mb-3">
                                <label>Location</label>
                                <Form.Select aria-label="Default select example" name="locationId" onChange={handleChange}>
                                    <option value="">Select an option...</option>
                                    {locations.map((location) => (
                                        <option key={location.id} value={location.id}>
                                            {location.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Row>
                        </Col>
                    </Row>

                    <Row className="mt-5" align="right">
                        {/*<Link href="/components/select_field" passHref>*/}
                        <Button className='basic-custom-button-color' type="submit">
                            Create Employee
                        </Button>
                        {/*</Link>*/}
                    </Row>
                </Container>
            </Form>
        </div >
    )
}

export default EmployeeRegistration