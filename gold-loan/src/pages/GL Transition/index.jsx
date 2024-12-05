import React, { useState, useEffect } from 'react';
import { Grid, TextField, Card, Avatar, Box, Typography } from '@mui/material';

export default function GoldLoanBill() {
    const [glNumber, setGlNumber] = useState(''); // GL Number state
    const [customerData, setCustomerData] = useState(null); // To store fetched customer details

    const handleGlNumberChange = (event) => {
        setGlNumber(event.target.value); // Update GL number state
    };

    // Fetch customer details when GL number changes
    useEffect(() => {
        if (glNumber) {
            // Replace this URL with the actual API endpoint
            const fetchCustomerData = async () => {
                try {
                    const response = await fetch(`https://api.example.com/customer/${glNumber}`);
                    const data = await response.json();
                    setCustomerData(data); // Set fetched customer data
                } catch (error) {
                    console.error('Error fetching customer data:', error);
                }
            };

            fetchCustomerData();
        }
    }, [glNumber]); // Re-run this effect when GL number changes

    return (
        <div>
            {/* Top Section */}
            <Grid container spacing={2} alignItems="flex-start" sx={{ mt: 1 }}>
                {/* Left Section: Form Fields */}
                <Grid item xs={12} md={8.5}>
                    <Grid container spacing={1}>
                        {/* GL Number with Search */}
                        <Grid item xs={12} sm={3}>
                            <TextField
                                label="GL Number"
                                fullWidth
                                size="small"
                                value={glNumber}
                                onChange={handleGlNumberChange} // Handle input change
                            />
                        </Grid>
                    </Grid>
                </Grid>

                {/* Right Section: Customer Data */}
                <Grid item xs={12} md={3}>
                    {/* Card Component */}
                    <Card
                        sx={{
                            width: { xs: '100%', sm: '365px' },
                            borderRadius: 2,
                            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
                            backgroundColor: '#ffffff',
                            display: 'flex',
                            flexDirection: 'row',
                            padding: 2,
                            gap: 2,
                            mt: -1,
                        }}
                    >
                        {/* Left Section: Avatar with Background */}
                        <Box
                            sx={{
                                width: '30%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#e8f5e9',
                                borderRadius: 2,
                            }}
                        >
                            <Avatar
                                alt="Profile"
                                sx={{
                                    width: 90,
                                    height: 100,
                                    border: '4px solid #ffffff',
                                    objectFit: 'cover',
                                }}
                            />
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            {/* Customer Details */}
            {customerData && (
                <div style={{ marginTop: '20px' }}>
                    <Typography variant="h6">Customer Details:</Typography>
                    <Typography>Customer ID: {customerData.id}</Typography>
                    <Typography>Name: {customerData.name}</Typography>
                    <Typography>Email: {customerData.email}</Typography>
                    <Typography>Phone: {customerData.phone}</Typography>
                    {/* Add more fields as necessary */}
                </div>
            )}
        </div>
    );
}
