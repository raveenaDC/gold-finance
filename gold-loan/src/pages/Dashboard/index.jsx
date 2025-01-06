import React, { useEffect, useState } from 'react';
import { Grid, Paper, TableContainer, Typography, Box, Skeleton } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { viewDashboardDetails } from '../../services/dashboard/dashboard.service';
import { getFromLS } from '../../utils/storage.utils';
import { STORAGE_KEYS } from '../../config/app.config';

const ChartContainer = ({ children, width, height }) => (
    <TableContainer
        component={Paper}
        sx={{
            boxShadow: 3,
            borderRadius: 2,
            padding: 0,
            backgroundColor: '#ffffff',
            width: width,
            height: height,
        }}
    >
        {children}
    </TableContainer>
);

const COLORS = ['#694D75', '#C7C5A0', '#D5BF40'];

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

    const boxStyle = {
        width: '100%',
        height: 100,
        boxShadow: 3,
        borderRadius: 2,
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    };

    return (
        <Grid container spacing={2} sx={{ padding: '20px' }}>
            {/* BarChart Section */}
            <Grid item xs={12} sm={3}>
                <Box
                    component={Paper}
                    sx={{
                        ...boxStyle,
                        backgroundColor: '#D5BF40',
                    }}
                >
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                            color: '#000000',
                            textAlign: 'center',
                        }}
                    >
                        Customers
                    </Typography>
                    {loading ? (
                        <Skeleton variant="text" width={60} height={40} />
                    ) : (
                        <Typography variant="h3" sx={{ color: '#000000' }}>
                            {dashboardValues.userCount || '0'}
                        </Typography>
                    )}
                </Box>
            </Grid>

            <Grid item xs={12} sm={3}>
                <Box
                    sx={{
                        ...boxStyle,
                        backgroundColor: '#694D75',
                    }}
                >
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                            color: '#ffffff',
                            textAlign: 'center',
                        }}
                    >
                        Active Customers
                    </Typography>
                    {loading ? (
                        <Skeleton variant="text" width={60} height={40} />
                    ) : (
                        <Typography variant="h3" sx={{ color: '#ffffff' }}>
                            {dashboardValues.activeCustomer || '0'}
                        </Typography>
                    )}
                </Box>
            </Grid>

            <Grid item xs={12} sm={3}>
                <Box
                    sx={{
                        ...boxStyle,
                        backgroundColor: '#689689',
                    }}
                >
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                            color: '#000000',
                            textAlign: 'center',
                        }}
                    >
                        Amount in Bank
                    </Typography>
                    {loading ? (
                        <Skeleton variant="text" width={60} height={40} />
                    ) : (
                        <Typography variant="h3" sx={{ color: '#000000' }}>
                            {dashboardValues.amountInBank || '0'}
                        </Typography>
                    )}
                </Box>
            </Grid>

            <Grid item xs={12} sm={3}>
                <Box
                    sx={{
                        ...boxStyle,
                        backgroundColor: '#E87461',
                    }}
                >
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                            color: '#000000',
                            textAlign: 'center',
                        }}
                    >
                        Cash in Hand
                    </Typography>
                    {loading ? (
                        <Skeleton variant="text" width={60} height={40} />
                    ) : (
                        <Typography variant="h3" sx={{ color: '#000000' }}>
                            {dashboardValues.cashInHand || '0'}
                        </Typography>
                    )}
                </Box>
            </Grid>

            <Grid item xs={12}>
                <Grid container spacing={2}>
                    {/* BarChart Section */}
                    <Grid item xs={12} sm={4}>
                        <ChartContainer width={400} height={300}>
                            <BarChart
                                xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]}
                                series={[
                                    { data: [dashboardValues.closedGlFirstMonthPrice, 1, 6], color: '#689689' },
                                    { data: [dashboardValues.closedGlSecondMonthPrice, 6, 3], color: '#E87461' },
                                    { data: [dashboardValues.glFirstMonthPrice, 5, 6], color: '#C7C5A0' },
                                ]}
                                width={400}
                                height={300}
                            />
                        </ChartContainer>
                    </Grid>

                    {/* PieChart Section */}
                    <Grid item xs={12} sm={4}>
                        <ChartContainer width={400} height={300}>
                            <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                    <Pie
                                        data={pieChartData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        label
                                        paddingAngle={5} // Adds space between the slices
                                    >
                                        {pieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </Grid>

                    {/* Additional BarChart Section */}
                    <Grid item xs={12} sm={4}>
                        <ChartContainer width={420} height={300}>
                            <BarChart
                                xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]}
                                series={[
                                    { data: [4, 3, 5], color: '#689689' },
                                    { data: [1, 6, 3], color: '#E87461' },
                                    { data: [2, 5, 6], color: '#C7C5A0' },
                                ]}
                                width={400}
                                height={300}
                            />
                        </ChartContainer>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
