"use client"
import React, { useEffect, useState } from 'react'
import { Button, Form, Row, Col, Container } from "react-bootstrap";
import { useSearchParams } from 'next/navigation';
import { authFetch } from '../../utils/authFetch';


const EmployeeDetails = () => {

    enum ExperienceLevel {
        JUNIOR = "JUNIOR",
        MID = "MID",
        SENIOR = "SENIOR"
    }

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

    const searchParams = useSearchParams();
    const employeeId = searchParams.get("employeeId");

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        accountEmail: '',
        startDate: new Date(),
        experienceLevel: ExperienceLevel.JUNIOR,
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
            const response = await authFetch(`http://localhost:8090/api/employees/${employeeId}`, {
                method: "PUT",
                body: formData
            });
            if (response.ok) {
                alert("Employee was updated successfully!");
            } else {
                alert("Something went wrong!");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };


    useEffect(() => {
        if (!employeeId) return;

        const fetchData = async () => {
            try {
                const [employeeResponse, jobsResponse, locationsResponse] = await Promise.all([
                    authFetch(`http://localhost:8090/api/employees/${employeeId}`),
                    authFetch("http://localhost:8090/api/jobs"),
                    authFetch("http://localhost:8090/api/locations"),
                ]);

                const employeeData = await employeeResponse.json();
                const jobsData = await jobsResponse.json();
                const locationsData = await locationsResponse.json();
                console.info(employeeData);

                setForm(employeeData);
                setJobs(jobsData);
                setLocations(locationsData);
            } catch (error) {
                console.error("Error fetching employee, jobs or locations: ", error);
            }
        }

        fetchData();
    }, [employeeId]);

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Container className="p-4">
                    {/*
                    <Row className="p-3 m-3">
                        <Col >
                            <h1>Employee Profile</h1>
                        </Col>
                        <Col>
                            <Row>
                                <Col>
                                    <Link href={`/components/employee/employee_timeoff?employeeId=${employeeId}`} passHref>
                                        <Button className='basic-custom-button-color basic-custom-button-size'>Time off
                                        </Button>
                                    </Link>
                                </Col>
                                <Col>
                                    <Link href={`/components/projects/project_search?employeeId=${employeeId}`} passHref>
                                        <Button className='basic-custom-button-color basic-custom-button-size'>Projects
                                        </Button>
                                    </Link>
                                </Col>
                                <Col>
                                    <Link href={`employee_skills?employeeId=${employeeId}`} passHref>
                                        <Button className='basic-custom-button-color basic-custom-button-size'>Skills
                                        </Button>
                                    </Link>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    */}

                    <Row>
                        <Col className='m-2'>
                            <Row className="mb-3">
                                <label>First Name</label>
                                <Form.Control name="firstName" type="text" placeholder="Enter your first name here" value={form?.firstName || ""} onChange={handleChange} />
                            </Row>
                            <Row className="mb-3">
                                <label>Email</label>
                                <Form.Control name="accountEmail" type="email" placeholder="hello@example.com" value={form?.accountEmail || ""} onChange={handleChange} />
                            </Row>
                            <Row className="mb-3">
                                <label>Start Date</label>
                                <Form.Control name="startDate" type="date" value={form?.startDate ? new Date(form.startDate).toISOString().split("T")[0] : ""} onChange={handleChange} />
                            </Row>

                            <Row className="mb-3">
                                <label>Jobs</label>
                                <Form.Select aria-label="Default select example" name="jobId" value={form?.jobId || ""} onChange={handleChange}>
                                    <option value="">Select a job...</option>
                                    {jobs.map((job) => (
                                        <option key={job.jobId} value={job.jobId}>
                                            {job.jobName}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Row>
                        </Col>

                        <Col className='m-2'>
                            <Row className="mb-3">
                                <label>Last Name</label>
                                <Form.Control type="text" placeholder="Enter your last name here" name="lastName" value={form?.lastName} onChange={handleChange} />
                            </Row>

                            <Row className="mb-3">
                                <label>Experience Level</label>
                                <Form.Select aria-label="Default select example" name="experienceLevel" value={form?.experienceLevel || ""} onChange={handleChange}>
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
                                <Form.Select aria-label="Default select example" name="locationId" value={form?.locationId || ""} onChange={handleChange}>
                                    <option value="">Select an option...</option>
                                    {locations.map((location) => (
                                        <option key={location.id} value={location.id}>
                                            {location.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Row>
                        </Col>

                        <Row className="mt-5" align="right">
                            {/*<Link href="/components/select_field" passHref>*/}
                            <Button className='basic-custom-button-color' type="submit">
                                Update Employee
                            </Button>
                            {/*</Link>*/}
                        </Row>
                    </Row>
                </Container>
            </Form>
        </div>
    )
}

export default EmployeeDetails;