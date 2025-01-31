import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, Skeleton } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { viewDashboardDetails } from '../../services/dashboard/dashboard.service';

// Professional color palette
const COLORS = ['#4E79A7', '#F28E2B', '#E15759']; // Blue, Orange, Red

export default function MainPage() {
    const [dashboardValues, setDashboardValues] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            const response = await viewDashboardDetails();
            if (!response?.isSuccess) {
                alert(response.result);
                return;
            }
            setDashboardValues(response.result.data);
        } catch (error) {
            console.error('Error fetching dashboard details:', error);
            alert('Failed to fetch dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const pieChartData = [
        { name: 'Group A', value: dashboardValues.groupAValue || 2 },
        { name: 'Group B', value: dashboardValues.groupBValue || 5.5 },
        { name: 'Group C', value: dashboardValues.groupCValue || 2 },
    ];

    return (
        <Box sx={{ padding: '24px', backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
            {/* Header Section */}
            <Typography variant="h4" sx={{ fontWeight: '600', mb: 4, color: '#2c3e50' }}>
                Dashboard Overview
            </Typography>

            {/* Key Metrics Section */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {[
                    { title: 'Customers', value: dashboardValues.userCount, color: COLORS[0] },
                    { title: 'Active Customers', value: dashboardValues.activeCustomer, color: COLORS[1] },
                    { title: 'Amount in Bank', value: dashboardValues.amountInBank, color: COLORS[2] },
                    { title: 'Cash in Hand', value: dashboardValues.cashInHand, color: COLORS[0] },
                ].map((metric, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Paper
                            sx={{
                                padding: '20px',
                                borderRadius: '8px',
                                backgroundColor: '#ffffff',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                                },
                            }}
                        >
                            <Typography variant="h6" sx={{ color: '#7f8c8d', mb: 1 }}>
                                {metric.title}
                            </Typography>
                            {loading ? (
                                <Skeleton variant="text" width={60} height={40} />
                            ) : (
                                <Typography variant="h3" sx={{ color: metric.color }}>
                                    {metric.value || '0'}
                                </Typography>
                            )}
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Charts Section */}
            <Grid container spacing={3}>
                {/* BarChart Section */}
                <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                            padding: '20px',
                            borderRadius: '8px',
                            backgroundColor: '#ffffff',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            height: '400px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <BarChart
                            xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]}
                            series={[
                                { data: [dashboardValues.closedGlFirstMonthPrice, 1, 6], color: COLORS[0] },
                                { data: [dashboardValues.closedGlSecondMonthPrice, 6, 3], color: COLORS[1] },
                                { data: [dashboardValues.glFirstMonthPrice, 5, 6], color: COLORS[2] },
                            ]}
                            width={500}
                            height={350}
                        />
                    </Paper>
                </Grid>

                {/* PieChart Section */}
                <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                            padding: '20px',
                            borderRadius: '8px',
                            backgroundColor: '#ffffff',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            height: '400px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={120}
                                    fill="#8884d8"
                                    label
                                    paddingAngle={5}
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}