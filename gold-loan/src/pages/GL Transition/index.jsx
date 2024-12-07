import React, { useState, useEffect } from 'react';
import { Grid, TextField, Card, Avatar, Box, Typography, Autocomplete, Button, Rating } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { incrementBillNumber } from '../../Redux/billNumberSlice';

import { getCustomerDetails, updateCustomerRating } from '../../services/customer/customer.service';

export default function GoldLoanBill() {
    const dispatch = useDispatch();
    const billNumber = useSelector((state) => state.billNumber.billNumber); // Access Redux state

    const paymentModes = [
        'Cash',
        'Cheque',
        'UPI',
        'Google Pay',
        'Credit Card',
        'Debit Card',
    ];

    const [rating, setRating] = useState(0); // State to store the rating value
    const [glNumber, setGlNumber] = useState(''); // GL Number state
    const [customerId, setCustomerId] = useState(''); // Customer ID linked to GL Number
    const [customerData, setCustomerData] = useState(null); // Fetched customer details
    const [glOptions, setGlOptions] = useState([]); // GL number dropdown options
    const [selectedDate, setSelectedDate] = useState(''); // Date picker value
    const [loading, setLoading] = useState(false);


    // Handle GL number change
    const handleGlNumberChange = (event, newValue) => {
        if (newValue) {
            setGlNumber(newValue.glNo); // Set selected GL number
            setCustomerId(newValue.customerId); // Set customer ID linked to GL number
            console.log("nothing", newValue.customerId);
        } else {
            setGlNumber('');
        }
    };

    // Fetch customer data based on GL Number
    const fetchGoldNoData = async () => {
        try {
            const response = await fetch(
                `http://localhost:4000/customer/gold/loan/number/view?search=${glNumber}`
            );
            const data = await response.json();
            setGlOptions(data.data.loanDetails || []); // Populate dropdown options
        } catch (error) {
            console.error('Error fetching customer data:', error);
        }
    };

    const fetchCustomerData = async () => {
        try {
            const response = await getCustomerDetails(customerId);
            if (response.isSuccess && response.userDetails) {
                setCustomerData(response.userDetails);
                setRating(response.userDetails.rating); // Sync initial rating
            }
            console.log(response);
        } catch (error) {
            console.error('Error fetching customer details:', error);
        }
    };

    const handleRatingChange = async (event, newValue) => {
        try {
            setRating(newValue); // Optimistically update the UI with the new rating

            const response = await updateCustomerRating(customerId, newValue);

            if (response.isSuccess) {
                // Update customer data locally after API success
                setCustomerData((prevData) => ({ ...prevData, rating: newValue }));
            }
        } catch (error) {
            setLoading(false); // Reset loading state
        }
    };


    useEffect(() => {
        fetchGoldNoData();
        fetchCustomerData();
    }, [glNumber, customerId]);

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        dispatch(incrementBillNumber());
    };

    // Handle date change
    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', mt: 2 }}>
            {/* Top Section */}
            <Grid container spacing={2} alignItems="flex-start">
                {/* Left Section */}
                <Grid item xs={12} md={8}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={8}>
                            <Typography variant="subtitle2">BILL NO: {billNumber}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <label>
                                Date:
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    style={{
                                        marginLeft: '10px',
                                        padding: '5px',
                                        fontSize: '0.875rem',
                                    }}
                                />
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            {/* GL Number Autocomplete */}
                            <Autocomplete
                                options={glOptions}
                                getOptionLabel={(option) => option.glNo || 'Select'}
                                onChange={handleGlNumberChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Select Gold No"
                                    />
                                )}
                                sx={{
                                    '& .MuiAutocomplete-inputRoot': {
                                        fontSize: '0.75rem',
                                        height: '36px',
                                    },
                                    '& .MuiInputBase-input': {
                                        padding: '8px',
                                    },
                                    width: '50%',
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Autocomplete
                                options={paymentModes}
                                renderInput={(params) => <TextField {...params} size="small" placeholder="Payment Mode" />}

                                sx={{
                                    '& .MuiAutocomplete-inputRoot': {
                                        fontSize: '0.75rem',
                                        height: '36px',
                                    },
                                    '& .MuiInputBase-input': {
                                        padding: '8px',
                                    },
                                    width: '100%',
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>

                {/* Right Section */}
                <Grid item xs={12} md={4}>
                    <Card

                        sx={{
                            width: '100%',
                            borderRadius: 2,
                            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
                            backgroundColor: '#ffffff',
                            display: 'flex',
                            flexDirection: 'row',
                            padding: 2,
                            gap: 2,
                        }}
                    >
                        {/* Avatar */}
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
                                    height: 90,
                                    backgroundColor: '#f5f5f5',
                                }}
                            />
                        </Box>
                        {/* Customer ID */}
                        <Box>
                            <Typography variant="body2">Customer ID:</Typography>
                            <Typography variant="h6">{customerId || 'N/A'}</Typography>
                            {/* Rating */}
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Rating
                                    name="profile-rating"
                                    // value={customerData.rating}
                                    onChange={handleRatingChange}
                                    precision={0.5}
                                />
                            </Box>

                        </Box>
                    </Card>
                </Grid>
            </Grid>

            {/* Customer Details Section */}
            {customerData ? (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h6">Customer Details:</Typography>
                    <Typography variant="body2">Name: {customerData.fir}</Typography>
                    <Typography variant="body2">Email: {customerData.email}</Typography>
                    <Typography variant="body2">Phone: {customerData.primaryNumber}</Typography>
                </Box>
            ) : (
                <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mt: 2 }}
                >
                    Select a GL number to view customer details.
                </Typography>
            )}

            {/* Submit Button */}
            <Grid container justifyContent="center" sx={{ mt: 3 }}>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}
