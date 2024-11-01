import React, { useEffect, useState } from 'react';
import { Grid, Button, Typography, CircularProgress, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import GlCustomer from "../Forms/GlCustomer";
import AddGoldLoan from "./AddGoldLoan";

export default function GlMaster() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch customer data from the API
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await fetch('https://api.example.com/customers'); // Replace with your actual API endpoint
                const data = await response.json();
                setCustomers(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching customer data:", error);
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    // Define columns for the DataGrid
    const columns = [
        { field: 'id', headerName: 'SL No.', flex: 0.2 },
        { field: 'firstName', headerName: 'First Name', flex: 0.5 },
        { field: 'lastName', headerName: 'Last Name', flex: 0.5 },
        { field: 'address', headerName: 'Address', flex: 1 },
        { field: 'primaryNumber', headerName: 'Mobile', flex: 0.5 },
        { field: 'aadhar', headerName: 'Aadhar', flex: 0.5 },
        {
            field: 'goldLoan',
            headerName: 'Action',
            flex: 0.4,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#FFD700',
                        color: '#000',
                        '&:hover': { backgroundColor: '#FFC107' },
                    }}
                    onClick={() => handleGoldLoan(params.row.id)}
                >
                    Gold Loan
                </Button>
            ),
        },
    ];

    // Action handler for Gold Loan button
    const handleGoldLoan = (customerId) => {
        console.log("Gold Loan requested for Customer ID:", customerId);
        // Implement redirection or action here
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box sx={{ padding: { xs: 1, sm: 2, md: 3 } }}>
            <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}
            >
                <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                    Customer List
                </Typography>
                <Box sx={{ mt: { xs: 1, sm: 0 } }}>
                    <GlCustomer />
                </Box>
            </Grid>

            <Box
                sx={{
                    height: 400,
                    width: '100%',
                    '& .MuiDataGrid-root': {
                        backgroundColor: 'white',
                    },
                }}
            >
                <DataGrid
                    rows={customers}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection={false}
                    sx={{
                        '& .MuiDataGrid-cell': { fontSize: { xs: '0.8rem', sm: '1rem' } },
                        '& .MuiDataGrid-columnHeaders': { fontSize: { xs: '0.9rem', sm: '1rem' } },
                    }}
                />
            </Box>
        </Box>
    );
}
