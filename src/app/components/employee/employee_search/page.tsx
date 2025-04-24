"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import '../../../styles/EmployeeCard.css';
import Search from '../../common/icons/search';
import PersonPlusIcon from '../../common/icons/person_add';
import PenIcon from '../../common/icons/pen';
import DownloadIcon from '../../common/icons/download';
import { authFetch } from '../../utils/authFetch';
import toast from 'react-hot-toast';

type Props = {
    vacancyId: string;
    projectId: string;
};

const EmployeeSearch = ({ vacancyId, projectId }: Props) => {
    const validProjectId = projectId && projectId !== "null";
    const validVacancyId = vacancyId && vacancyId !== "null";
    const showAssign = validProjectId && validVacancyId;

    type Document = {
        id: number;
        employeeId: string;
        name: string;
        type: string;
        url: string;
    }

    type Employee = {
        employeeId: string;
        firstName: string;
        lastName: string;
        accountEmail: string;
        jobName: string;
        jobId: number;
        locationName: string;
        locationId: number;
        document?: Document | null;
    };

    type Skill = {
        id: number;
        name: string;
    };

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [searchId, setSearchId] = useState<string>("");
    const [selectedSkill, setSelectedSkill] = useState<string>("");
    const [firstNameFilter, setFirstNameFilter] = useState<string>("");

    useEffect(() => {
        fetchAllEmployees();
        fetchAllSkills();

    }, []);

    const fetchAllEmployees = async () => {
        try {
            const response = await authFetch("http://localhost:8090/api/employees");
            const data = await response.json();
            setEmployees(data);
            console.log(data);
        } catch (error) {
            console.error("Error fetching employees: ", error);
        }
    };

    const fetchAllSkills = async () => {
        try {
            const response = await authFetch("http://localhost:8090/api/skills");
            const data = await response.json();
            console.log(data);
            setSkills(data);
        }
        catch (error) {
            console.error("Error fetching skills: ", error);
        }
    };

    const handleSearch = async () => {
        if (searchId.trim() === "") {
            fetchAllEmployees();
            return;
        }

        try {
            const response = await authFetch(`http://localhost:8090/api/employees/${searchId}`);
            if (!response.ok) {
                throw new Error("Employee not found");
            }
            const data = await response.json();
            setEmployees([data]); // Put in array to keep table structure
        } catch (error) {
            console.error("Error searching for employee: ", error);
            setEmployees([]); // Clear list if not found
        }
    };

    const fetchEmployeesBySkill = async (skillId: number) => {
        try {
            const response = await authFetch(`http://localhost:8090/api/employee-skill-proficiency/employees-with-skill?skillId=${skillId}`);
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.error("Error fetching employees by skill: ", error);
            setEmployees([]);
        }
    };

    const assignEmployeeToVacancy = async (employeeId: string) => {
        if (!validProjectId || !validVacancyId) {
            toast.error("Project or Vacancy ID is missing or invalid.");
            return;
        }

        try {
            const response = await authFetch(
                `http://localhost:8090/api/projects/employees?employeeId=${employeeId}&projectId=${projectId}&vacancyId=${vacancyId}`,
                {
                    method: 'PUT',
                }
            );

            if (!response.ok) {
                throw new Error("Failed to assign employee");
            }

            toast.success(`Employee ${employeeId} successfully assigned to the vacancy!`);
        } catch (error) {
            console.error("Assignment error:", error);
            toast.error("An error occurred while assigning the employee.");
        }
    };

    const handleDownloadCV = async (employee: Employee) => {
        if (employee.document && employee.document.id) {
            const fileUrl = `http://localhost:8090/api/documents/download/${employee.document.id}`;
            const token = localStorage.getItem("access_token");

            try {
                const response = await fetch(fileUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to download CV");
                }

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;

                // Optional: set a default filename if your backend doesn’t include it
                a.download = `${employee.firstName}_${employee.lastName}_CV.pdf`;
                a.click();
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error("Error downloading CV:", error);
            }
        }
    };

    const filteredEmployees = employees.filter(employee => employee.firstName.toLowerCase().includes(firstNameFilter.toLowerCase()));

    return (
        <div>
            <div></div>
            <Container className='p-0'>
                {/*
                {showAssign && (
                    <Row>
                        <Col >
                            <h1>Assign Employee</h1>
                        </Col>
                        <Col>
                            <Link href={`/components/vacancies/vacancy_details?vacancyId=${vacancyId}&projectId=${projectId}`} passHref>
                                <Button className='basic-custom-button-color basic-custom-button-size'>Vacancy Details
                                </Button>
                            </Link>
                        </Col>
                        <Col>
                            <Link href={`/components/vacancies/vacancy_skills?vacancyId=${vacancyId}&projectId=${projectId}`} passHref>
                                <Button className='basic-custom-button-color basic-custom-button-size'> Vacancy Skills
                                </Button>
                            </Link>
                        </Col>
                    </Row>
                )}
                */}

                <Row className="my-3">
                    <Col xs={4}>
                        <Form.Control
                            type="text"
                            placeholder="Search by first name..."
                            value={firstNameFilter}
                            onChange={(e) => setFirstNameFilter(e.target.value)}
                        />
                    </Col>
                </Row>
                <Row className='my-4'>
                    <Col xs={4}>
                        <Form.Control
                            type="text"
                            placeholder="Search by Employee ID"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                        />
                    </Col>
                    <Col>
                        <Button variant="primary" className="pl-2 pr-2" onClick={handleSearch}>
                            <Search />
                        </Button>
                    </Col>
                    <Col >
                        <Col>
                            <Form.Select aria-label="Default select example" name="skillId" value={selectedSkill} onChange={(e) => {
                                const value = e.target.value;
                                console.log(value);
                                setSelectedSkill(value);
                                if (value === "") {
                                    fetchAllEmployees();
                                }
                                else {
                                    const skillId = parseInt(value);
                                    fetchEmployeesBySkill(skillId);
                                }
                            }}>
                                <option value="">Filter by Skills...</option>
                                {skills.map((skill) => (
                                    <option key={skill.id} value={skill.id}>
                                        {skill.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>
                    </Col>
                    {!showAssign &&
                        <Col>
                            <Link href="/components/employee/employee_registration" passHref>
                                <Button variant='primary' style={{ cursor: "pointer" }}><PersonPlusIcon /></Button>
                            </Link>
                        </Col>}
                </Row>

                <Row>
                    <Table striped bordered hover responsive>
                        <thead className='table-header'>
                            <tr>
                                <th className='text-center'>ID</th>
                                <th className='text-center'>First Name</th>
                                <th className='text-center'>Last Name</th>
                                <th className='text-center'>Email</th>
                                <th className='text-center'>Job</th>
                                <th className='text-center'>Location</th>
                                <th className='text-center'>CV</th>
                                {showAssign && <th className='text-center'>Assign</th>}
                                {!showAssign && <th className='text-center'>Edit</th>}
                            </tr>
                        </thead>

                        <tbody>
                            {employees.length > 0 ? (
                                filteredEmployees.map(employee => (
                                    <tr key={employee.employeeId}>
                                        <td className='text-center'>{employee.employeeId}</td>
                                        <td className='text-center'>{employee.firstName}</td>
                                        <td className='text-center'>{employee.lastName}</td>
                                        <td className='text-center'>{employee.accountEmail}</td>
                                        <td className='text-center'>{employee.jobName}</td>
                                        <td className='text-center'>{employee.locationName}</td>
                                        <td className='text-center'><Button variant='success' onClick={() => handleDownloadCV(employee)} disabled={!employee.document} title={employee.document ? "Download CV" : "No CV Available"}><DownloadIcon /></Button></td>
                                        {showAssign && (
                                            <td className='text-center'>
                                                <Button variant='success' onClick={() => assignEmployeeToVacancy(employee.employeeId)}>
                                                    <PersonPlusIcon />
                                                </Button>
                                            </td>
                                        )}
                                        {!showAssign && (
                                            <td className='text-center'>
                                                <Link href={`/components/employee/employee_profile?employeeId=${employee.employeeId}`} passHref>
                                                    <Button variant='dark'><PenIcon /></Button>
                                                </Link>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className='text-center'>No employees found</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Row>
            </Container>
        </div>
    )
}

export default EmployeeSearch;