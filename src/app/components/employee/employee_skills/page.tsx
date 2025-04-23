"use client"

import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react'
import { Button, Form, Row, Col, Container, Table } from "react-bootstrap";
import TrashIcon from '../../common/icons/trash';
import { authFetch } from '../../utils/authFetch';


const SkillsComponent = () => {

    const searchParams = useSearchParams();
    const employeeId = searchParams.get("employeeId") ?? "";

    type Skill = {
        id: number;
        name: string;
    };

    type Proficiency = {
        id: number;
        level: string;
    };

    type EmployeeSkillProficiency = {
        skillId: number;
        skillName: string;
        proficiencyId: number;
        proficiencyLevel: string;
    };


    const [form, setForm] = useState({
        employeeId: employeeId,
        skillId: '',
        proficiencyId: '',
    });
    const [skills, setSkills] = useState<Skill[]>([]);
    const [proficiencies, setProficiencies] = useState<Proficiency[]>([]);
    const [employeeSkills, setEmployeeSkills] = useState<EmployeeSkillProficiency[]>([]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const fetchData = useCallback(
        async () => {
            try {
                const [skillsResponse, proficienciesResponse, employeeSkillsResponse] = await Promise.all([
                    authFetch(`http://localhost:8090/api/skills`),
                    authFetch("http://localhost:8090/api/proficiencies"),
                    authFetch(`http://localhost:8090/api/employee-skill-proficiency/employee-skills?employeeId=${employeeId}`),
                ]);

                const skillsData = await skillsResponse.json();
                const proficieciesData = await proficienciesResponse.json();
                const employeeSkillsData = await employeeSkillsResponse.json();

                setSkills(skillsData);
                setProficiencies(proficieciesData);
                setEmployeeSkills(employeeSkillsData);

                console.log(skillsData, proficieciesData, employeeSkillsData);
            } catch (error) {
                console.error("Error fetching skills, proficiencies and/or the employee's skills", error);
            }
        },
        [employeeId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("employeeId", form.employeeId);
        formData.append("skillId", form.skillId);
        formData.append("proficiencyId", form.proficiencyId);

        try {
            const response = await authFetch(`http://localhost:8090/api/employee-skill-proficiency`, {
                method: "POST",
                body: formData
            });
            if (response.ok) {
                alert("Skill assigned correctly to employee!");
                fetchData();
                {/*setForm({ ...form, skillId: '', proficiencyId: '' });*/ }
            } else {
                alert("Something went wrong!");
            }
        } catch (error) {
            console.error("Error submitting form: ", error);
        }
    };

    const handleDelete = async (employeeId: string, skillId: number) => {
        const confirmed = confirm("Are you sure you want to remove this skill?");
        if (!confirmed) return;

        try {
            const response = await authFetch(`http://localhost:8090/api/employee-skill-proficiency/${employeeId}/${skillId}`, {
                method: "DELETE"
            });

            if (response.ok) {
                alert("Skill was removed successfully!");
                fetchData();
            } else {
                alert("Failed to remove the skill");
            }
        }
        catch (error) {
            console.error("Error removing the skill: ", error);
        }
    };

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
                                    <Link href={`/components/employee/employee_details?employeeId=${employeeId}`} passHref>
                                        <Button className='basic-custom-button-color basic-custom-button-size'>Details
                                        </Button>
                                    </Link>
                                </Col>
                                <Col>
                                    <Col>
                                        <Link href={`/components/projects/project_search?employeeId=${employeeId}`} passHref>
                                            <Button className='basic-custom-button-color basic-custom-button-size'>Projects
                                            </Button>
                                        </Link>
                                    </Col>
                                </Col>
                                <Col>
                                    <Link href={`employee_timeoff?employeeId=${employeeId}`} passHref>
                                        <Button className='basic-custom-button-color basic-custom-button-size'>Timeoff
                                        </Button>
                                    </Link>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    */}

                    <Row className="p-3 m-3">
                        <Col >
                            <label>Skill</label>
                            <Form.Select aria-label="Default select example" name="skillId" onChange={handleChange}>
                                <option value="">Select a skill...</option>
                                {skills.map((skill) => (
                                    <option key={skill.id} value={skill.id}>
                                        {skill.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>

                        <Col >
                            <label>Proficiency</label>
                            <Form.Select aria-label="Default select example" name="proficiencyId" onChange={handleChange}>
                                <option value="">Select a proficiency...</option>
                                {proficiencies.map((proficiency) => (
                                    <option key={proficiency.id} value={proficiency.id}>
                                        {proficiency.level}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>

                        <Col >
                            <Button className="mt-4 basic-custom-button-color basic-custom-button-size" type="submit">Add Skill</Button>
                        </Col>
                    </Row>

                    <Row className="p-3 m-3">
                        <h3>Skill-Proficiency Matrix</h3>
                        <Table bordered responsive>
                            <thead>
                                <tr>
                                    <th className='text-center'>Skill</th>
                                    {proficiencies.map((prof) => (
                                        <th key={prof.id} className='text-center'>{prof.level}</th>
                                    ))}
                                    <th className='text-center'>Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employeeSkills.map((employeeSkill, index) => (
                                    <tr key={index}>
                                        <td className='text-center'>{employeeSkill?.skillName}</td>
                                        {proficiencies.map((proficiency) => (
                                            <td key={proficiency.id} style={{ backgroundColor: employeeSkill.proficiencyId === proficiency.id ? "#d4edda" : "" }} className='text-center'>
                                                {employeeSkill?.proficiencyId === proficiency.id ? '✔️' : ''}
                                            </td>
                                        ))}
                                        <td className='text-center'>
                                            <Button className='btn btn-danger' onClick={() => handleDelete(employeeId, employeeSkill.skillId)}><TrashIcon /></Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </Table>
                    </Row>
                </Container>
            </Form>
        </div>
    )
}

export default SkillsComponent;