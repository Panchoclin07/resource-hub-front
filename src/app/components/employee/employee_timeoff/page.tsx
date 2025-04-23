"use client"
import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react'
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import { authFetch } from '../../utils/authFetch';


const TimeOffComponent = () => {

    type TimeOffReason = {
        reasonId: number;
        reasonName: string;
    };

    type TimeOff = {
        id: number;
        reason: string;
        startDate: Date;
        endDate: Date;
    }

    const searchParams = useSearchParams();
    const employeeId = searchParams.get("employeeId") ?? "";

    const [form, setForm] = useState({
        employeeId: employeeId,
        reasonId: '',
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
    });
    const [timeOffReasons, setTimeOffReasons] = useState<TimeOffReason[]>([]);
    const [employeeTimeOffs, setEmployeeTimeOffs] = useState<TimeOff[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const fetchData = useCallback(
        async () => {
            try {
                const [timeOffReasonsResponse, employeeTimeOffsResponse] = await Promise.all([
                    authFetch("http://localhost:8090/api/timeoffreason"),
                    authFetch(`http://localhost:8090/api/timeoff/employee/${employeeId}`),
                ]);

                const timeOffReasonsData = await timeOffReasonsResponse.json();
                const employeeTimeOffsData = await employeeTimeOffsResponse.json();

                console.log(timeOffReasonsData);
                console.log(employeeTimeOffsData);

                setTimeOffReasons(timeOffReasonsData);
                setEmployeeTimeOffs(employeeTimeOffsData);
            }
            catch (error) {
                console.error("Error fetching timeoff reasons or employee's timeoffs: ", error);
            }
        },
        [employeeId]
    );

    useEffect(() => {
        fetchData();
    }, [fetchData])



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Convert 'yyyy-MM-dd' string to Date -> ISO string
        const timeOffBO = {
            startDate: new Date(form.startDate).toISOString(),
            endDate: new Date(form.endDate).toISOString(),
        };

        // Build query params
        const queryParams = new URLSearchParams({
            employeeId: form.employeeId,
            reasonId: form.reasonId
        });

        try {
            const response = await authFetch(`http://localhost:8090/api/timeoff?${queryParams.toString()}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(timeOffBO)
            });

            if (response.ok) {
                alert("Timeoff was created successfully!");
                fetchData();
                setForm({
                    ...form,
                    reasonId: '',
                    startDate: new Date().toISOString().split("T")[0],
                    endDate: new Date().toISOString().split("T")[0]
                });
            } else {
                alert("Something went wrong!");
                console.info("Submitted values:", {
                    ...timeOffBO,
                    employeeId: form.employeeId,
                    reasonId: form.reasonId
                });
            }
        } catch (error) {
            console.error("Error submitting timeoff request:", error);
        }
    };

    const handleDelete = async (timeOffId: number) => {
        const confirmed = confirm("Are you sure you want to delete this timeoff?");
        if (!confirmed) return;

        try {
            const response = await authFetch(`http://localhost:8090/api/timeoff/${timeOffId}`, {
                method: "DELETE"
            });

            if (response.ok) {
                alert("Timeoff was deleted successfully!");
                fetchData();
            } else {
                alert("Failed to delete timeoff");
            }
        }
        catch (error) {
            console.error("Error deleting timeoff: ", error);
        }
    };

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Container className="p-4">
                    {/*
                    <Row className="p-3 m-3">
                        <Col >
                            <h1>Employee TimeOff</h1>
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

                    <Row className="mb-3">
                        <label>Reason</label>
                        <Form.Select aria-label="Default select example" name="reasonId" value={form?.reasonId || ""} onChange={handleChange}>
                            <option value="">Select a reason...</option>
                            {timeOffReasons.map((timeOffReason) => (
                                <option key={timeOffReason.reasonId} value={timeOffReason.reasonId}>
                                    {timeOffReason.reasonName}
                                </option>
                            ))}
                        </Form.Select>
                    </Row>
                    <Row>
                        <Col className="mb-3">
                            <label>Start Date</label>
                            <Form.Control name="startDate" type="date" value={form?.startDate ? new Date(form.startDate).toISOString().split("T")[0] : ""} onChange={handleChange} />
                        </Col>

                        <Col className="mb-3">
                            <label>End Date</label>
                            <Form.Control name="endDate" type="date" value={form?.endDate ? new Date(form.endDate).toISOString().split("T")[0] : ""} onChange={handleChange} />
                        </Col>
                    </Row>

                    <Row className="mt-5" align="right">
                        <Button className='basic-custom-button-color' type="submit"> Submit Timeoff
                        </Button>
                    </Row>
                    <Row className="mt-5">
                        <Table striped bordered hover responsive>
                            <thead className='table-header'>
                                <tr>
                                    <th className='text-center'>Reason</th>
                                    <th className='text-center'>Start Date</th>
                                    <th className='text-center'>End Date</th>
                                    <th className='text-center'>Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employeeTimeOffs.length > 0 ? (
                                    employeeTimeOffs.map(employeeTimeOff => (
                                        <tr key={employeeTimeOff.id}>
                                            <td className='text-center'>{employeeTimeOff.reason}</td>
                                            <td className='text-center'>{new Date(employeeTimeOff.startDate).toLocaleDateString()}</td>
                                            <td className='text-center'>{new Date(employeeTimeOff.endDate).toLocaleDateString()}</td>
                                            <td className='text-center'><Button className='btn btn-danger' onClick={() => handleDelete(employeeTimeOff.id)}>  <Trash />  </Button></td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className='text-center'>No timeoffs found</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Row>

                </Container>
            </Form>
        </div >
    )
}

export default TimeOffComponent;