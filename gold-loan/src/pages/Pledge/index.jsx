import React, { useState } from 'react';
import {
    Box, Button, TextField, MenuItem, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, IconButton, Grid, Autocomplete
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const PledgeMasterPage = () => {
    const [pledges, setPledges] = useState([]);
    const [formData, setFormData] = useState({
        pledgeId: '',
        pledgerName: '',
        dateOfPledge: '',
        goldWeight: '',
        glNumber: '',
        loanAmount: '',
        interestRate: '',
        loanDuration: '',
        maturityDate: '',
        itemDetails: '',
        otherCharges: '',
        repledgeNumber: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRowDoubleClick = (pledge) => {
        setFormData(pledge);
    };

    const handleDelete = (pledgeId) => {
        setPledges(pledges.filter((p) => p.pledgeId !== pledgeId));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.pledgeId) {
            setPledges([...pledges, { ...formData, pledgeId: `P${pledges.length + 1}` }]);
        } else {
            setPledges(pledges.map((p) => (p.pledgeId === formData.pledgeId ? formData : p)));
        }
        setFormData({
            pledgeId: '',
            bankName: '',
            dateOfPledge: '',
            goldWeight: '',
            glNumber: 'Select',
            loanAmount: '',
            interestRate: '',
            loanDuration: '',
            maturityDate: '',
            itemDetails: '',
            otherCharges: '',
            repledgeNumber: ''
        });
    };

    const textFieldStyle = {
        margin: '4px',
        width: '100%',
        '& .MuiInputBase-root': { fontSize: '12px' },
        '& .MuiInputLabel-root': { fontSize: '10px' }
    };

    const glNumberOptions = [
        { label: 'GL001', id: 1 },
        { label: 'GL002', id: 2 },
        { label: 'GL003', id: 3 }
        // Add more options as needed
    ];

    return (
        <Box sx={{ padding: '16px' }}>
            <Typography variant="h5" sx={{ color: '#B8860B', fontWeight: '600', textAlign: 'center', mb: 3 }}>
                Pledge Master
            </Typography>

            <Paper elevation={3} sx={{ padding: 2, mb: 3 }}>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2}> {/* Increased spacing for uniformity */}
                        <Grid item xs={12} sm={4} md={2} >
                            <Autocomplete
                                options={glNumberOptions}
                                getOptionLabel={(option) => option.label}
                                renderInput={(params) => (
                                    <TextField {...params} label="GL Number" name="glNumber" size="small" fullWidth />
                                )}
                                value={glNumberOptions.find(option => option.label === formData.glNumber) || null}  // Ensure correct value is shown
                                onChange={(e, newValue) => {
                                    setFormData({
                                        ...formData,
                                        glNumber: newValue ? newValue.label : ''
                                    });
                                }}
                            />
                        </Grid>

                        {['dateOfPledge', 'bankName', 'goldWeight', 'interestRate', 'loanAmount', 'itemDetails', 'otherCharges', 'repledgeNumber', 'loanDuration', 'maturityDate'].map((field, index) => (
                            <Grid item xs={12} sm={4} md={2} key={index}> {/* Updated breakpoints for better responsiveness */}
                                <TextField
                                    fullWidth
                                    label={field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleInputChange}
                                    size="small"
                                    required={['dateOfPledge', 'pledgerName', 'goldWeight', 'loanAmount', 'interestRate', 'loanDuration', 'maturityDate'].includes(field)}
                                    type={['dateOfPledge', 'maturityDate'].includes(field) ? 'date' : 'text'}
                                    InputLabelProps={['dateOfPledge', 'maturityDate'].includes(field) ? { shrink: true } : {}}
                                />
                            </Grid>
                        ))}
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0 }}> {/* Added margin for spacing */}
                            <Button type="submit" variant="contained" color="primary" sx={{ fontSize: '12px', padding: '6px 16px' }}>
                                Add/Update Pledge
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                {['SlNo', 'Gl No', 'Pledged Date', 'Bank Name', 'Gold (Wt)', 'Loan Amount', 'Interest', 'Item Details', 'Other Charges', 'Repledge No', 'Loan Dur', 'Maturity Date', 'Actions'].map((heading, index) => (
                                    <TableCell key={index} sx={{ fontWeight: 'bold', fontSize: '12px' }}>
                                        {heading}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pledges.map((pledge, index) => (
                                <TableRow key={index} onDoubleClick={() => handleRowDoubleClick(pledge)}>
                                    <TableCell>{pledge.pledgeId}</TableCell>
                                    <TableCell>{pledge.glNumber}</TableCell>
                                    <TableCell>{pledge.dateOfPledge}</TableCell>
                                    <TableCell>{pledge.bankName}</TableCell>
                                    <TableCell>{pledge.goldWeight}</TableCell>
                                    <TableCell>{pledge.loanAmount}</TableCell>
                                    <TableCell>{pledge.interestRate}</TableCell>
                                    <TableCell>{pledge.itemDetails}</TableCell>
                                    <TableCell>{pledge.otherCharges}</TableCell>
                                    <TableCell>{pledge.repledgeNumber}</TableCell>
                                    <TableCell>{pledge.loanDuration}</TableCell>
                                    <TableCell>{pledge.maturityDate}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleDelete(pledge.pledgeId)} size="small" color="error">
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Typography variant="h5"> Previous Pledge Records</Typography>

            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>GL NO</TableCell>
                            <TableCell>Repledge No</TableCell>
                            <TableCell>Date of RePledge</TableCell>
                            <TableCell>Bank Name</TableCell>
                            <TableCell>Items Details</TableCell>
                            <TableCell>Gold Wt</TableCell>
                            <TableCell>Interest paid </TableCell>
                            <TableCell>Amount paid </TableCell>
                            <TableCell>Loan Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pledges.map((pledge, index) => (
                            <TableRow key={index}>
                                <TableCell>N/A</TableCell>
                                <TableCell>N/A</TableCell>
                                <TableCell>N/A</TableCell>
                                <TableCell>N/A</TableCell>
                                <TableCell>N/A</TableCell>
                                <TableCell>N/A</TableCell>
                                <TableCell>N/A</TableCell>
                                <TableCell>N/A</TableCell>
                                <TableCell>N/A</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>


        </Box>
    );
};

export default PledgeMasterPage;
