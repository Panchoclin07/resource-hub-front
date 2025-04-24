"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button, Form, Row, Col, Container, Table } from "react-bootstrap";
import TrashIcon from '../../common/icons/trash';
import { authFetch } from '../../utils/authFetch';
import toast from 'react-hot-toast';
import ConfirmModal from '../../utils/confirm_modal/page';

type Props = {
    vacancyId: string;
    projectId: string;
};

const VacancySkills = ({ vacancyId, projectId }: Props) => {

    type Skill = {
        id: number;
        name: string;
    };

    type Proficiency = {
        id: number;
        level: string;
    };

    type VacancySkillProficiency = {
        skillId: number;
        skillName: string;
        proficiencyId: number;
        proficiencyLevel: string;
    };

    const [form, setForm] = useState({
        vacancyId: vacancyId,
        skillId: '',
        proficiencyId: '',
    });

    const [skills, setSkills] = useState<Skill[]>([]);
    const [proficiencies, setProficiencies] = useState<Proficiency[]>([]);
    const [vacancySkills, setVacancySkills] = useState<VacancySkillProficiency[]>([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedSkillToDelete, setSelectedSkillToDelete] = useState<{ vacancyId: string, skillId: number } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const fetchData = useCallback(async () => {
        try {
            const [skillsResponse, proficienciesResponse, vacancySkillsResponse] = await Promise.all([
                authFetch(`http://localhost:8090/api/skills`),
                authFetch(`http://localhost:8090/api/proficiencies`),
                authFetch(`http://localhost:8090/api/vacancies/vacancy-skills?vacancyId=${vacancyId}`),
            ]);

            const skillsData = await skillsResponse.json();
            const proficienciesData = await proficienciesResponse.json();
            const vacancySkillsData = await vacancySkillsResponse.json();

            setSkills(skillsData);
            setProficiencies(proficienciesData);
            setVacancySkills(vacancySkillsData);
        } catch (error) {
            console.error("Error fetching skills, proficiencies and/or the vacancy's skills", error);
        }
    }, [vacancyId]
    );

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("vacancyId", form.vacancyId);
        formData.append("skillId", form.skillId);
        formData.append("proficiencyId", form.proficiencyId);

        try {
            const response = await authFetch(`http://localhost:8090/api/vacancies/skills`, {
                method: "POST",
                body: formData
            });
            if (response.ok) {
                toast.success("Skill assigned correctly to vacancy!");
                fetchData();
            } else {
                toast.error("Something went wrong!");
                console.log(form.vacancyId, form.skillId, form.proficiencyId);
            }
        } catch (error) {
            console.error("Error submitting form: ", error);
        }
    };

    const handleDelete = (vacancyId: string, skillId: number) => {
        setSelectedSkillToDelete({ vacancyId, skillId });
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedSkillToDelete) return;

        const { vacancyId, skillId } = selectedSkillToDelete;

        try {
            const response = await authFetch(`http://localhost:8090/api/vacancies/${vacancyId}/${skillId}`, {
                method: "DELETE"
            });

            if (response.ok) {
                toast.success("Skill was removed successfully!");
                fetchData();
            } else {
                toast.error("Failed to remove the skill");
            }
        } catch (error) {
            console.error("Error removing the skill: ", error);
        } finally {
            setShowConfirmModal(false);
            setSelectedSkillToDelete(null);
        }
    };

    {/*const handleDelete = async (vacancyId: string, skillId: number) => {
        const confirmed = confirm("Are you sure you want to remove this skill?");
        if (!confirmed) return;

        try {
            const response = await authFetch(`http://localhost:8090/api/vacancies/${vacancyId}/${skillId}`, {
                method: "DELETE"
            });

            if (response.ok) {
                toast.success("Skill was removed successfully!");
                fetchData();
            } else {
                toast.error("Failed to remove the skill");
            }
        }
        catch (error) {
            console.error("Error removing the skill: ", error);
        }
    };
    */}

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Container className="p-4">
                    {/*
                    <Row className="p-3 m-3">
                        <Col>
                            <h1>Vacancy Skills</h1>
                        </Col>
                        <Col>
                            <Row>
                                <Col>
                                    <Link href={`/components/vacancies/vacancy_details?vacancyId=${vacancyId}&projectId=${projectId}`} passHref>
                                        <Button className='basic-custom-button-color basic-custom-button-size'>Vacancy Details</Button>
                                    </Link>
                                </Col>
                                {projectId && projectId !== "null" && (
                                    <Col>
                                        <Link href={`/components/employee / employee_search ? vacancyId = ${vacancyId}&projectId=${projectId}`} passHref>
                                            <Button variant='primary' style={{ cursor: "pointer" }}>Assign Employee</Button>
                                        </Link>
                                    </Col>
                                )}
                            </Row>
                        </Col>
                    </Row>
                    */}

                    <Row className="p-3 m-3">
                        <Col>
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

                        <Col>
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

                        <Col>
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
                                {vacancySkills.map((vacancySkill, index) => (
                                    <tr key={index}>
                                        <td className='text-center'>{vacancySkill?.skillName}</td>
                                        {proficiencies.map((proficiency) => (
                                            <td
                                                key={proficiency.id}
                                                style={{ backgroundColor: vacancySkill.proficiencyId === proficiency.id ? "#d4edda" : "" }}
                                                className='text-center'
                                            >
                                                {vacancySkill?.proficiencyId === proficiency.id ? '✔️' : ''}
                                            </td>
                                        ))}
                                        <td className='text-center'>
                                            <Button className='btn btn-danger' onClick={() => handleDelete(vacancyId, vacancySkill.skillId)}>
                                                <TrashIcon />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Row>
                </Container>
                <ConfirmModal
                    show={showConfirmModal}
                    onHide={() => setShowConfirmModal(false)}
                    onConfirm={confirmDelete}
                    message="Are you sure you want to remove this skill?"
                />
            </Form >
        </div >
    );
};

export default VacancySkills;