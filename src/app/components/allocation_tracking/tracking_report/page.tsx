"use client";

import React, { useEffect, useRef, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Button, Container, Row, Spinner } from "react-bootstrap";
import html2canvas from "html2canvas";
import { authFetch } from '../../utils/authFetch';


const COLORS = ["#28a745", "#ffc107", "#dc3545"]; // Green, Yellow, Red

type ChartEntry = {
    name: string;
    value: number;
};

const renderCustomizedLabel = ({ percent }: { percent: number }) => `${(percent * 100).toFixed(0)}%`

const EmployeeStatusChart = () => {
    const [data, setData] = useState<ChartEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchChartData();
    }, []);

    const fetchChartData = async () => {
        try {
            const [assignedRes, benchRes, timeoffRes] = await Promise.all([
                authFetch("http://localhost:8090/api/projects/assigned"),
                authFetch("http://localhost:8090/api/projects/bench"),
                authFetch("http://localhost:8090/api/timeoff"),
            ]);

            const [assignedData, benchData, timeoffData] = await Promise.all([
                assignedRes.json(),
                benchRes.json(),
                timeoffRes.json(),
            ]);

            const unavailableIds = new Set(timeoffData.map((t: { employeeId: string }) => t.employeeId));
            const activeCount = assignedData.filter((e: { employeeId: string }) => !unavailableIds.has(e.employeeId)).length;
            const benchCount = benchData.filter((e: { employeeId: string }) => !unavailableIds.has(e.employeeId)).length;
            const unavailableCount = unavailableIds.size;

            const chartData: ChartEntry[] = [
                { name: "Active", value: activeCount },
                { name: "Bench", value: benchCount },
                { name: "Unavailable", value: unavailableCount },
            ];

            setData(chartData);
        } catch (error) {
            console.error("Failed to fetch chart data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        if (chartRef.current) {
            const canvas = await html2canvas(chartRef.current);
            const link = document.createElement("a");
            link.download = "employee-status-chart.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
        }
    };

    return (
        <Container className="my-5">
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
                        <Link href={"/components/allocation_tracking/unavailable_employees"} passHref><Button variant='primary'>Unavailable</Button></Link>
                    </Col>
                </Row>
                */}

                <Row className='mt-5'>
                    <h3 className="mb-4 text-center">Employee Availability Report</h3>
                    {loading ? (
                        <div className="text-center">
                            <Spinner animation="border" />
                        </div>
                    ) : (
                        <>
                            <div ref={chartRef}>
                                <ResponsiveContainer width="100%" height={400}>
                                    <PieChart>
                                        <Pie
                                            dataKey="value"
                                            isAnimationActive={true}
                                            data={data}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={150}
                                            label={renderCustomizedLabel}
                                        >
                                            {data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="text-center mt-3">
                                <Button variant="primary" onClick={handleDownload}>
                                    Download Chart as PNG
                                </Button>
                            </div>
                        </>
                    )}
                </Row>
            </Row>
        </Container>
    );
};

export default EmployeeStatusChart;