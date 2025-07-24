import React, { useState, useEffect } from 'react';
import {
    Box, Grid, Paper, Typography, TextField, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Button, Autocomplete
} from '@mui/material';

import { getPledgeNumber, getPledgeDetails, savePledgeTransaction } from '../../services/pledge/pledge.service';
import { use } from 'react';
import SearchModal from '../../components/Pledge details';

export default function PledgeTransaction() {
    const [pledgeNumberOptions, setPledgeNumberOptions] = useState(null);
    const [formData, setFormData] = useState({
        paidAmount: '',
        paidPrincipal: '',
        paidInterest: '',
        // paidOtherCharges: '',
        // remarks: '',
        pledgeNumber: null,
        // pledgeId: null,
    });
    const [pledgeId, setPledgeId] = useState(null);
    const [paidOtherCharges, setPaidOtherCharges] = useState(null);
    const [itemDetails, setItemDetails] = useState([]);  // Avoid setting [null]
    const [pledges, setPledges] = useState([]); // Avoid setting [null]



    // const pledges = [
    //     {

    //         bankName: 'Bank A',
    //         principalAmount: '50000',
    //         interestRate: '5%',
    //         otherCharges: '500',
    //         dueDate: '2025-12-31',
    //         loanDuration: '12 months',
    //         itemDetails: 'Gold Necklace'
    //     }
    // ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const fetchPledgeNumber = async () => {
        try {
            const response = await getPledgeNumber();
            console.log("PLEDGENUMBER", response.result.data);
            setPledgeNumberOptions(response.result.data);

        } catch (error) {
            console.error("Error in updateCustomerRating:", error);
            return { isSuccess: false, result: null }; // Ensure consistent structure for error cases

        }
    };
    const fetchPledgeDetails = async (pledgeId) => {
        try {
            console.log("PLEDGEIDDETAILS", pledgeId);

            const response = await getPledgeDetails(pledgeId);
            console.log("PLEDGEDETAILS", response?.result?.data);

            // Convert object to array
            setPledges(response?.result?.data ? [response.result.data] : []);
            setItemDetails(response.result.data.itemDetails);


        } catch (error) {
            console.error("Error in fetchPledgeDetails:", error);
            setPledges([]); // Prevent errors if API fails
        }
    };

    useEffect(() => {
        if (pledgeId) {
            fetchPledgeDetails(pledgeId);
        }
    }, [pledgeId]);


    useEffect(() => {
        fetchPledgeNumber();

    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            savePledgeTransaction(paidOtherCharges, pledgeId, formData.paidAmount, formData.paidPrincipal, formData.paidInterest).then(response => console.log("checking...", response))  // Log actual response data
                .catch(error => console.error('Error:', error));
        }
        catch (error) {
            console.error("Error in updateCustomerRating:", error);

        }
    };

    return (
        <Box sx={{ padding: '16px' }}>
            <Grid container spacing={2}>
                {/* Left Section */}
                <Grid item xs={12} md={7}>
                    <Paper elevation={3} sx={{ padding: 2, mb: 3 }}>
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                            <Typography variant="body2" fontWeight="bold">Pledge No:</Typography>
                            <Typography
                                sx={{
                                    color: '#B8860B', fontSize: '18px', marginBottom: '20px',
                                    fontWeight: 600, textAlign: 'center'
                                }}
                            >
                                PLEDGE TRANSACTION
                            </Typography>

                            <TextField
                                type="date"
                                size="small"
                                label="PLEDGE DATE"
                                value={new Date().toISOString().split('T')[0]} // Formats today's date as "YYYY-MM-DD"
                                sx={{
                                    '& .MuiInputLabel-root': { fontSize: '14px', fontWeight: 'bold' },
                                    '& .MuiInputBase-root': { fontSize: '14px' }
                                }}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ readOnly: true }}
                            />
                        </Box>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={4}>
                                <Autocomplete
                                    options={pledgeNumberOptions}
                                    getOptionLabel={(option) => option.bankPledgeNumber}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Pledge Number"
                                            name="pledgeNumber"
                                            size="small"
                                            fullWidth
                                            sx={{
                                                '& .MuiInputLabel-root': { fontSize: '14px', fontWeight: 'bold' },
                                                '& .MuiInputBase-root': { fontSize: '14px' },
                                            }}
                                        />
                                    )}
                                    value={formData.pledgeNumber ? pledgeNumberOptions.find(option => option.bankPledgeNumber === formData.pledgeNumber) : null}
                                    onChange={(e, newValue) => {
                                        setFormData({
                                            ...formData,
                                            pledgeNumber: newValue ? newValue.bankPledgeNumber : '',
                                            // pledgeId: newValue ? newValue._id : '', // Save the corresponding ID
                                        });
                                        setPledgeId(newValue ? newValue._id : '');
                                    }}
                                    fullWidth
                                />

                            </Grid>

                            {pledges.length > 0 && pledges.map((pledge) => (
                                ['bankName', 'principleAmount', 'interestRate', 'otherCharges', 'dueDate'].map((field) => (
                                    <Grid item xs={12} sm={6} md={4} key={`${pledge._id}-${field}`}>
                                        <TextField
                                            fullWidth
                                            label={field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                                            name={field}
                                            value={
                                                field === 'dueDate' && pledge[field]
                                                    ? pledge[field].split('T')[0]  // Convert "YYYY-MM-DDTHH:mm:ss.sssZ" -> "YYYY-MM-DD"
                                                    : (pledge[field] || '')        // Handle empty values
                                            }
                                            size="small"
                                            type={field === 'dueDate' ? 'date' : 'text'}
                                            InputLabelProps={field === 'dueDate' ? { shrink: true } : {}}
                                            sx={{
                                                '& .MuiInputLabel-root': { fontSize: '14px', fontWeight: 'bold' },
                                                '& .MuiInputBase-root': { fontSize: '14px' }
                                            }}
                                        />
                                    </Grid>
                                ))
                            ))}



                            <Grid item xs={12} sm={8} md={8}>
                                <TextField
                                    fullWidth
                                    label="Remarks"
                                    name="remarks"
                                    value={formData.remarks}
                                    onChange={handleInputChange}
                                    size="small"
                                    multiline
                                    rows={2}
                                    sx={{
                                        '& .MuiInputLabel-root': { fontSize: '14px', fontWeight: 'bold' },
                                        '& .MuiInputBase-root': { fontSize: '14px' }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Paper elevation={3} sx={{ padding: 2, mb: 3 }}>
                                    <Box component="form" onSubmit={handleSubmit}>
                                        Billing
                                        <Grid container spacing={2} sx={{ mt: .2 }}>
                                            {['paidAmount', 'paidPrincipal', 'paidInterest',].map((field) => (
                                                <Grid item xs={12} sm={6} md={6} key={field}>
                                                    <TextField
                                                        fullWidth
                                                        label={field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                                                        name={field}
                                                        value={formData[field]}
                                                        onChange={handleInputChange}
                                                        size="small"
                                                        sx={{
                                                            '& .MuiInputLabel-root': { fontSize: '14px', fontWeight: 'bold' },
                                                            '& .MuiInputBase-root': { fontSize: '14px' }
                                                        }}
                                                    />
                                                </Grid>
                                            ))}

                                            <Grid item xs={12} sm={6} md={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Other Charges"
                                                    name="paidOtherCharges"
                                                    value={paidOtherCharges}
                                                    onChange={(e) => setPaidOtherCharges(e.target.value)}
                                                    size="small"
                                                    sx={{
                                                        '& .MuiInputLabel-root': { fontSize: '14px', fontWeight: 'bold' },
                                                        '& .MuiInputBase-root': { fontSize: '14px' }
                                                    }}
                                                />
                                            </Grid>

                                        </Grid>
                                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>

                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <SearchModal />
                                                <Button type="submit" variant="contained" sx={{ bgcolor: '#B8860B', color: '#FFF', '&:hover': { bgcolor: '#FFD700' } }}>
                                                    Submit
                                                </Button>
                                            </Box>
                                        </Grid>


                                    </Box>

                                </Paper>
                                {/* <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>

                                </Grid> */}

                            </Grid>
                        </Grid>

                    </Paper>


                </Grid>

                {/* Right Section */}
                <Grid item xs={12} md={5}>
                    <TableContainer component={Paper} sx={{
                        mt: 2,
                        '&::-webkit-scrollbar': { width: '4px', height: '4px' },
                        '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '2px' },
                        '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#555' },
                        '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1' },
                    }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontSize: '0.675rem' }}>Item Details</TableCell>
                                    <TableCell sx={{ fontSize: '0.675rem' }}>No</TableCell>
                                    <TableCell sx={{ fontSize: '0.675rem' }}>Gross Wt</TableCell>
                                    <TableCell sx={{ fontSize: '0.675rem' }}>Stone Wt</TableCell>
                                    <TableCell sx={{ fontSize: '0.675rem' }}>Dep Wt</TableCell>
                                    <TableCell sx={{ fontSize: '0.675rem' }}>Net Wt</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {itemDetails.map((pledge) => (
                                    <TableRow key={pledge.pledgeId}>
                                        <TableCell sx={{ fontSize: '0.675rem' }}>{pledge.goldItem}</TableCell>
                                        <TableCell sx={{ fontSize: '0.675rem' }}>{pledge.quantity}</TableCell>
                                        <TableCell sx={{ fontSize: '0.675rem' }}>{pledge.grossWeight}</TableCell>
                                        <TableCell sx={{ fontSize: '0.675rem' }}>{pledge.stoneWeight}</TableCell>
                                        <TableCell sx={{ fontSize: '0.675rem' }}>{pledge.depreciation}</TableCell>
                                        <TableCell sx={{ fontSize: '0.675rem' }}>{pledge.netWeight}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                </Grid>
            </Grid>
        </Box>
    );
}
