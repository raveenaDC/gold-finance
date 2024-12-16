import React from 'react';
import { Grid, Paper, TableContainer } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';

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

export default function MainPage() {
    return (
        <Grid container spacing={2} sx={{ padding: '20px' }}>
            {/* BarChart Section */}
            <Grid item xs={12} sm={4}>
                <ChartContainer width={400} height={300}>
                    <BarChart
                        xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]}
                        series={[
                            { data: [4, 3, 5], color: '#689689' },
                            { data: [1, 6, 3], color: '#E87461' },
                            { data: [2, 5, 6], color: '#C7C5A0' }
                        ]}
                        width={400}
                        height={300}
                    />
                </ChartContainer>
            </Grid>

            {/* LineChart Section */}
            <Grid item xs={12} sm={3}>
                <ChartContainer width={300} height={300}>
                    <LineChart
                        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                        series={[{ data: [2, 5.5, 2, 8.5, 1.5, 5] }]}
                        width={300}
                        height={300}
                    />
                </ChartContainer>
            </Grid>

            {/* Additional BarChart Section */}
            <Grid item xs={12} sm={3}>
                <ChartContainer width={400} height={300}>
                    <BarChart
                        xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]}
                        series={[
                            { data: [4, 3, 5], color: '#689689' },
                            { data: [1, 6, 3], color: '#E87461' },
                            { data: [2, 5, 6], color: '#C7C5A0' }
                        ]}
                        width={400}
                        height={300}
                    />
                </ChartContainer>
            </Grid>
        </Grid>
    );
}
