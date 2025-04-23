"use client";
import React from "react";
import { Tabs, Tab, Container } from "react-bootstrap";
import { useSearchParams } from "next/navigation";

import ProjectDetails from "../project_details/page";
import ProjectEmployees from "../project_employees/page";
import VacancySearch from "../../vacancies/vacancy_search/page";

const ProjectEdit = () => {
    const searchParams = useSearchParams();
    const projectId = searchParams.get("projectId");

    return (
        <Container className="my-4">
            <h1>Edit Project</h1>
            <Tabs defaultActiveKey="details" id="project-tabs" className="mb-3">
                <Tab eventKey="details" title="Details">
                    <ProjectDetails projectId={projectId || ""} />
                </Tab>
                <Tab eventKey="employees" title="Employees">
                    <ProjectEmployees projectId={projectId || ""} />
                </Tab>
                <Tab eventKey="vacancies" title="Vacancies">
                    <VacancySearch projectId={projectId || ""} />
                </Tab>
            </Tabs>
        </Container>
    );
};

export default ProjectEdit;