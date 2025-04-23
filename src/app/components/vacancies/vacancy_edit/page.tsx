"use client";
import React from "react";
import { Tabs, Tab, Container } from "react-bootstrap";
import { useSearchParams } from "next/navigation";

import VacancyDetails from "../vacancy_details/page";
import VacancySkills from "../vacancy_skills/page";
import EmployeeSearch from "../../employee/employee_search/page";

const VacancyEdit = () => {
    const searchParams = useSearchParams();
    const vacancyId = searchParams.get("vacancyId") || "";
    const projectId = searchParams.get("projectId") || "";

    return (
        <Container className="my-4">
            <h1>Edit Vacancy</h1>
            <Tabs defaultActiveKey="details" id="vacancy-tabs" className="mb-3">
                <Tab eventKey="details" title="Vacancy Details">
                    <VacancyDetails vacancyId={vacancyId} projectId={projectId} />
                </Tab>
                <Tab eventKey="skills" title="Required Skills">
                    <VacancySkills vacancyId={vacancyId} projectId={projectId} />
                </Tab>
                <Tab eventKey="employees" title="Assign Employees">
                    <EmployeeSearch vacancyId={vacancyId} projectId={projectId} />
                </Tab>
            </Tabs>
        </Container>
    );
};

export default VacancyEdit;