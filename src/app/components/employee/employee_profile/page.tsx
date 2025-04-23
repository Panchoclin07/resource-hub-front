"use client";

import React, { useSearchParams } from "next/navigation";
import { Container, Tabs, Tab } from "react-bootstrap";
import EmployeeDetails from "../employee_details/page";
import TimeOffComponent from "../employee_timeoff/page";
import SkillsComponent from "../employee_skills/page";
import ProjectSearch from "../../projects/project_search/page";

const EmployeeProfile = () => {
    const searchParams = useSearchParams();
    const employeeId = searchParams.get("employeeId");

    return (
        <Container className="my-5">
            <h1>Employee Profile</h1>
            <Tabs defaultActiveKey="details" className="mb-3">
                <Tab eventKey="details" title="Details">
                    <EmployeeDetails employeeId={employeeId} />
                </Tab>
                <Tab eventKey="timeoff" title="Time Off">
                    <TimeOffComponent employeeId={employeeId} />
                </Tab>
                <Tab eventKey="skills" title="Skills">
                    <SkillsComponent employeeId={employeeId} />
                </Tab>
                <Tab eventKey="projects" title="Projects">
                    <ProjectSearch employeeId={employeeId} />
                </Tab>
            </Tabs>
        </Container>
    );
};

export default EmployeeProfile;