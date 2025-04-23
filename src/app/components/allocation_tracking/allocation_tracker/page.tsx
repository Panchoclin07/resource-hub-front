"use client";
import React, { useEffect } from "react";
import { Tabs, Tab, Container } from "react-bootstrap";

import ActiveEmployeesWithoutTimeOff from "../active_employees/page";
import BenchEmployeesWithoutTimeOff from "../bench_employees/page";
import EmployeesWithTimeOff from "../unavailable_employees/page";
import EmployeeStatusChart from "../tracking_report/page";
import { getAccessToken } from "@/src/auth/authUtils";

const AllocationTracker = () => {

    return (
        <Container className="my-4">
            <h1>Allocation Tracking</h1>
            <Tabs defaultActiveKey="active" id="vacancy-tabs" className="mb-3">
                <Tab eventKey="active" title="Active Resources">
                    <ActiveEmployeesWithoutTimeOff />
                </Tab>
                <Tab eventKey="bench" title="Benched Resources">
                    <BenchEmployeesWithoutTimeOff />
                </Tab>
                <Tab eventKey="unavailable" title="Unavailable Resources">
                    <EmployeesWithTimeOff />
                </Tab>
                <Tab eventKey="report" title="Report">
                    <EmployeeStatusChart />
                </Tab>
            </Tabs>
        </Container>
    );
};

export default AllocationTracker;