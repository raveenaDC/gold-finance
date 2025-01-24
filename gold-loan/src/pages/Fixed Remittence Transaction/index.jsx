import React, { useState } from 'react';
import {
    Grid,
    Box,
    Typography,
    TextField,
    MenuItem,
    Button,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from '@mui/material';
import AddNomineeDetails from '../../components/NomineeSearch';
import AddCustomerDetails from '../../components/Customer search'; // Ensure correct import

export default function Index() {
    const depositPlans = [
        'Monthly Plan',
        'Quarterly Plan',
        'Half-Yearly Plan',
        'Annual Plan',
    ]; // Example plans

    const [formData, setFormData] = useState({
        voucherNo: '',
        interestFrom: '',
        depositAmount: '',
        depositPlan: '',
        interestRate: '',
        maturityDate: '',
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        console.log('Form Data:', formData);
        // Add API submission logic or other handling here
    };

    return (
        <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12} md={8}>
                <Box
                    sx={{
                        border: '1px solid #ddd',
                        borderRadius: 2,
                        p: 2,
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#ffffff',
                    }}
                >
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body2" fontWeight="bold">
                                FIXED NO:
                            </Typography>
                            <Typography variant="body2">12345</Typography>
                        </Box>

                        <Typography
                            component="h5"
                            sx={{
                                color: '#B8860B',
                                fontSize: '18px',
                                fontWeight: 600,
                                textAlign: 'center',
                                mb: 2,
                            }}
                        >
                            FIXED MASTER
                        </Typography>

                        <Box display="flex" alignItems="center" gap={1}>
                            <TextField
                                type="date"
                                size="small"
                                label=" Date"
                                sx={{
                                    '& .MuiInputLabel-root': {
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                    },
                                    '& .MuiInputBase-root': {
                                        fontSize: '14px',
                                    },
                                }}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ readOnly: true }}
                            />
                        </Box>
                    </Box>

                    <Grid container spacing={2} alignItems="center">

                    </Grid>

                    <Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
                        <Grid item xs={6} md={3}>
                            <Button variant="outlined" size="small" fullWidth><AddCustomerDetails /></Button>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Button variant="outlined" size="small" fullWidth><AddNomineeDetails /></Button>
                        </Grid>

                        {[
                            { label: 'Voucher No', name: 'voucherNo' },
                            { label: 'Interest From', name: 'interestFrom' },
                            { label: 'Deposit Amount', name: 'depositAmount' },
                        ].map((field, index) => (
                            <Grid item xs={6} md={3} key={index}>
                                <TextField
                                    name={field.name}
                                    size="small"
                                    label={field.label.toUpperCase()}
                                    fullWidth
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    sx={{
                                        '& .MuiInputLabel-root': {
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                        },
                                        '& .MuiInputBase-root': {
                                            fontSize: '14px',
                                        },
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                        ))}
                        <Grid item xs={6} md={3}>
                            <TextField
                                select
                                name="depositPlan"
                                size="small"
                                label="DEPOSIT PLAN"
                                fullWidth
                                value={formData.depositPlan}
                                onChange={handleChange}
                                sx={{
                                    '& .MuiInputLabel-root': {
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                    },
                                    '& .MuiInputBase-root': {
                                        fontSize: '14px',
                                    },
                                }}
                                InputLabelProps={{ shrink: true }}
                            >
                                {depositPlans.map((plan, index) => (
                                    <MenuItem key={index} value={plan}>
                                        {plan}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <TextField
                                name="interestRate"
                                size="small"
                                label="INTEREST RATE"
                                fullWidth
                                value={formData.interestRate}
                                onChange={handleChange}
                                sx={{
                                    '& .MuiInputLabel-root': {
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                    },
                                    '& .MuiInputBase-root': {
                                        fontSize: '14px',
                                    },
                                }}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <TextField
                                type="date"
                                name="maturityDate"
                                size="small"
                                label="MATURITY DATE"
                                fullWidth
                                value={formData.maturityDate}
                                onChange={handleChange}
                                sx={{
                                    '& .MuiInputLabel-root': {
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                    },
                                    '& .MuiInputBase-root': {
                                        fontSize: '14px',
                                    },
                                }}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                    </Grid>

                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button
                            variant="contained"
                            sx={{ backgroundColor: '#D5BF40', color: 'white' }}
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Grid>

            <Grid item xs={12} md={4}>
                {/* {customerData && Object.keys(customerData).length > 0 ? (
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
                        <Box
                            sx={{
                                minWidth: 98,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#e8f5e9',
                                borderRadius: 2,
                            }}
                        >
                            <Avatar
                                alt="Profile"
                                src={customerData?.image?.path ? `http://localhost:4000${customerData.image.path}` : '/default.jpg'}
                                sx={{
                                    width: 90,
                                    height: 100,
                                    border: '4px solid #ffffff',
                                    objectFit: 'cover',
                                }}
                            />
                        </Box>
                        <Box>
                            <Typography variant="body1" fontWeight="bold" sx={{ color: '#004d40' }}>
                                {customerData.firstName || 'N/A'} {customerData.lastName || 'N/A'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {customerData.nearBy || 'N/A'},{customerData.city || 'N/A'}
                            </Typography>
                            <Rating
                                name="profile-rating"
                                value={customerData?.rating || 0}
                                onChange={handleRatingChange}
                                precision={0.5}
                            />
                            <Box sx={{ mt: 2 }}>
                                <Box sx={{ display: 'table', width: '100%' }}>
                                    <Box sx={{ display: 'table-row' }}>
                                        <Typography component="div" sx={{ fontSize: 11.5, display: 'table-cell', fontWeight: 'bold' }}>
                                            Address
                                        </Typography>
                                        <Typography component="div" sx={{ fontSize: 11.5, display: 'table-cell', paddingLeft: 1 }}>
                                            <strong>:</strong> {customerData.address || 'N/A'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'table-row' }}>
                                        <Typography component="div" sx={{ fontSize: 11.5, display: 'table-cell', fontWeight: 'bold' }}>
                                            Email
                                        </Typography>
                                        <Typography component="div" sx={{ fontSize: 11.5, display: 'table-cell', paddingLeft: 1 }}>
                                            <strong>:</strong> {customerData.email || 'No Email'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'table-row' }}>
                                        <Typography component="div" sx={{ fontSize: 11.5, display: 'table-cell', fontWeight: 'bold' }}>
                                            Phone
                                        </Typography>
                                        <Typography component="div" sx={{ fontSize: 11.5, display: 'table-cell', paddingLeft: 1 }}>
                                            <strong>:</strong> {customerData.primaryNumber || 'No Phone'}, {customerData.secondaryNumber || 'No Phone'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>



                            {/* Profile completion */}
                {/* <Box sx={{ mt: .5 }}>
                                <Typography
                                    variant="body2"
                                    sx={{ mt: 0, cursor: 'pointer', fontSize: 11.5 }}
                                >
                                    <strong> Profile Completion</strong>: {calculateProfileCompletion(customerData)}%
                                </Typography>


                                <LinearProgress
                                    variant="determinate"
                                    value={calculateProfileCompletion(customerData)}
                                    sx={{
                                        height: 5,
                                        borderRadius: 10,
                                        cursor: 'pointer',
                                        backgroundColor: '#e0f2f1', // Light teal background
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: '#689689', // Your chosen color for the filled part
                                        },
                                    }}
                                    onClick={() => handleShowMissingDetails(customerData)}
                                />

                            </Box>
                        </Box>
                    </Card>
                ) : (
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                        Select a GL number to view customer details.
                    </Typography>
                )} */}

                <TableContainer component={Paper} sx={{
                    mt: 2,
                    '&::-webkit-scrollbar': {
                        width: '4px', // Thin scrollbar width
                        height: '4px', // Thin scrollbar height
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#888', // Scrollbar thumb color
                        borderRadius: '2px', // Rounded corners
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: '#555', // Thumb color on hover
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: '#f1f1f1', // Track color
                    },
                }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>FD NO</TableCell>
                                <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>FR Date</TableCell>
                                <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>Amount</TableCell>
                                <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>Interest Rate</TableCell>
                                <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>Maturity Date  </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            <TableRow >
                                <TableCell sx={{ fontSize: '0.675rem', }}>N/A</TableCell>
                                <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>N/A</TableCell>
                                <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>N/A</TableCell>
                                <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>N/A</TableCell>
                                <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>N/A</TableCell>
                            </TableRow>

                        </TableBody>
                    </Table>
                </TableContainer>


            </Grid>
        </Grid>
    );
}
