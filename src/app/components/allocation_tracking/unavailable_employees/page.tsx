"use client";

import React, { useEffect, useState } from 'react';
import { Container, Row, Table } from 'react-bootstrap';
import { authFetch } from '../../utils/authFetch';


type TimeOff = {
    id: number;
    employeeId: string;
    reason: string;
    startDate: string;
    endDate: string;
};

const EmployeesWithTimeOff = () => {
    const [timeOffList, setTimeOffList] = useState<TimeOff[]>([]);

    useEffect(() => {
        fetchTimeOffEmployees();
    }, []);

    const fetchTimeOffEmployees = async () => {
        try {
            const response = await authFetch("http://localhost:8090/api/timeoff");
            const data: TimeOff[] = await response.json();
            setTimeOffList(data);
        } catch (error) {
            console.error("Error fetching time off data:", error);
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
                        <Link href={"/components/allocation_tracking/bench_employees"} passHref><Button variant='primary'>Bench</Button></Link>
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
                                <th className='text-center'>Employee ID</th>
                                <th className='text-center'>Reason</th>
                                <th className='text-center'>Start Date</th>
                                <th className='text-center'>End Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {timeOffList.length > 0 ? (
                                timeOffList.map((item) => (
                                    <tr key={item.id}>
                                        <td className='text-center'>{item.employeeId}</td>
                                        <td className='text-center'>{item.reason}</td>
                                        <td className='text-center'>{new Date(item.startDate).toLocaleDateString()}</td>
                                        <td className='text-center'>{new Date(item.endDate).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className='text-center'>No employees currently on time off</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Row>
            </Row>
        </Container>
    );
};

export default EmployeesWithTimeOff;