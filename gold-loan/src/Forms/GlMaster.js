import React, { useEffect, useState } from 'react';
import { Grid, Button, Typography, CircularProgress, Box, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import GlCustomer from "../Forms/GlCustomer";
import { useNavigate } from 'react-router-dom';

export default function GlMaster() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // Fetch customer data from the API
    const fetchCustomers = async () => {
        try {
            const response = await fetch('http://localhost:4000/customer/details/view');
            const data = await response.json();

            // Map data to add unique `id` if not present
            const itemsWithId = data.data.items.map((item, index) => ({
                ...item,
                customId: item._id,
                id: index + 1,
            }));

            setCustomers(itemsWithId);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching customer data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleGoldLoan = (customerId) => {
        navigate(`/gold-loan/${customerId}`);
    };

    // Define columns for the DataGrid
    const columns = [
        { field: 'id', headerName: 'SL No.', width: 100 },
        { field: 'firstName', headerName: 'First Name', width: 150 },
        { field: 'lastName', headerName: 'Last Name', width: 150 },
        { field: 'address', headerName: 'Address', flex: 1 },
        { field: 'primaryNumber', headerName: 'Mobile', width: 120 },
        { field: 'email', headerName: 'Email', width: 150 }, // Assuming you have an email field
        {
            field: 'goldLoan',
            headerName: 'Action',
            width: 150,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#FFD700',
                        color: '#000',
                        '&:hover': { backgroundColor: '#FFC107' },
                        width: '100%',
                    }}
                    onClick={() => handleGoldLoan(params.row.customId)}
                >
                    Gold Loan
                </Button>
            ),
        },
    ];

    // Filter customers based on the search term
    const filteredCustomers = customers.filter(customer => {
        return (
            customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.primaryNumber.includes(searchTerm) || // Assuming mobile is in primaryNumber
            (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) // Check for email
        );
    });

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box sx={{ padding: { xs: 1, sm: 2, md: 3 } }}>
            <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                {/* Typography for Customer List Heading */}
                <Typography
                    variant="h4"
                    sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, flexShrink: 0 }}
                >
                    Customer List
                </Typography>

                {/* Search Bar */}
                <Box sx={{ flexGrow: 1, mx: 2, textAlign: 'center' }}>
                    <TextField
                        variant="outlined"
                        placeholder="Search by Name, Address, Mobile, or Email"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        fullWidth
                        sx={{
                            maxWidth: '600px', // Limit the max width
                            width: '100%', // Ensure it takes up the available space
                        }}
                    />
                </Box>

                {/* Add Customer Button */}
                <Box sx={{ mt: { xs: 1, sm: 0 }, flexShrink: 0 }}>
                    <GlCustomer onCustomerAdded={fetchCustomers} />
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
                    rows={filteredCustomers}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection={false}
                    getRowId={(row) => row.id}
                    sx={{
                        '& .MuiDataGrid-cell': { fontSize: { xs: '0.8rem', sm: '1rem' } },
                        '& .MuiDataGrid-columnHeaders': { fontSize: { xs: '0.9rem', sm: '1rem' } },
                    }}
                />
            </Box>
        </Box>
    );
}
