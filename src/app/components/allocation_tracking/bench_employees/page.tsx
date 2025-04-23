"use client";

import React, { useEffect, useState } from 'react';
import { Container, Row, Table } from 'react-bootstrap';
import { authFetch } from '../../utils/authFetch';

type BenchEmployee = {
    employeeId: string;
    firstName: string;
    lastName: string;
    accountEmail: string;
    startDate: string;
    experienceLevel: string;
    jobName: string;
    locationName: string;
};

type TimeOff = {
    id: number;
    employeeId: string;
    reason: string;
    startDate: string;
    endDate: string;
};

const BenchEmployeesWithoutTimeOff = () => {
    const [employees, setEmployees] = useState<BenchEmployee[]>([]);

    useEffect(() => {
        fetchFilteredBenchEmployees();
    }, []);

    const fetchFilteredBenchEmployees = async () => {
        try {
            const [benchRes, timeOffRes] = await Promise.all([
                authFetch("http://localhost:8090/api/projects/bench"),
                authFetch("http://localhost:8090/api/timeoff")
            ]);

            const benchEmployees: BenchEmployee[] = await benchRes.json();
            const timeOffs: TimeOff[] = await timeOffRes.json();

            const timeOffEmployeeIds = new Set(timeOffs.map(to => to.employeeId));

            const filtered = benchEmployees.filter(emp => !timeOffEmployeeIds.has(emp.employeeId));

            setEmployees(filtered);
        } catch (error) {
            console.error("Error fetching bench employee data:", error);
        }
    };

    return (
        <Container>
            <Row>
                {/*
                <Row>
                    <Col>
                        <Link href={"/components/allocation_tracking/active_employees"} passHref><Button variant='primary'>Active</Button></Link>
                    </Col>
                    <Col>
                        <Link href={"/components/allocation_tracking/unavailable_employees"} passHref><Button variant='primary'>Unavailable</Button></Link>
                    </Col>
                    <Col>
                        <Link href={"/components/allocation_tracking/tracking_report"} passHref><Button variant='primary'>Generate Report</Button></Link>
                    </Col>
                </Row>
                */}

                <Row>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th className='text-center'>ID</th>
                                <th className='text-center'>Name</th>
                                <th className='text-center'>Email</th>
                                <th className='text-center'>Experience</th>
                                <th className='text-center'>Job</th>
                                <th className='text-center'>Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.length > 0 ? (
                                employees.map(emp => (
                                    <tr key={emp.employeeId}>
                                        <td className='text-center'>{emp.employeeId}</td>
                                        <td className='text-center'>{emp.firstName} {emp.lastName}</td>
                                        <td className='text-center'>{emp.accountEmail}</td>
                                        <td className='text-center'>{emp.experienceLevel}</td>
                                        <td className='text-center'>{emp.jobName}</td>
                                        <td className='text-center'>{emp.locationName}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className='text-center'>No bench employees available</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Row>
            </Row>
        </Container >
    );
};

export default BenchEmployeesWithoutTimeOff;