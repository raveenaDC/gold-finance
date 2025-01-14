import React, { useState } from 'react';
import {
    Box, Button, TextField, MenuItem, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, IconButton, Grid, Autocomplete
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';
import BankDetailsModal from '../../components/BankSchemes';

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

    const glNumberOptions = [
        { label: 'GL001', id: 1 },
        { label: 'GL002', id: 2 },
        { label: 'GL003', id: 3 }
    ];

    const headers = ['Pledged Date', 'Pledge No', 'Bank Name', 'Principle Amount', 'Interest Rate', 'Other Charges', 'Maturity Date', 'Item Details', 'GL No', 'Remarks', 'Actions'];

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
        const newPledge = { ...formData, pledgeId: formData.pledgeId || uuidv4() };
        if (!formData.pledgeId) {
            setPledges([...pledges, newPledge]);
        } else {
            setPledges(pledges.map((p) => (p.pledgeId === formData.pledgeId ? newPledge : p)));
        }
        resetForm();
    };

    const resetForm = () => {
        setFormData({
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
    };

    const textFieldStyle = {
        margin: '4px',
        width: '100%',
        '& .MuiInputBase-root': { fontSize: '12px' },
        '& .MuiInputLabel-root': { fontSize: '10px' }
    };

    return (
        <Box sx={{ padding: '16px' }}>
            {/* <Typography variant="h5" sx={{ color: '#B8860B', fontWeight: '600', textAlign: 'center', mb: 3 }}>
                Pledge Master
            </Typography> */}
            <Grid container spacing={2}>
                {/* Left Side: Form */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={3} sx={{ padding: 2, mb: 3 }}>
                        <Box component="form" onSubmit={handleSubmit}>
                            <h5 style={{
                                color: '#B8860B',
                                fontSize: '18px',
                                marginTop: '10px',
                                fontWeight: '600',
                                textAlign: 'center', // Centers the text
                            }}>
                                PLEDGE MASTER
                            </h5>
                            <Grid container spacing={2}>


                                {['dateOfPledge', 'pledgeNumber', 'bankName', 'principalAmount', 'interestRate', 'otherCharges', 'maturityDate', 'item Details'].map((field, index) => (
                                    <Grid item xs={12} sm={6} md={3} key={index}>
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
                                            sx={{
                                                '& .MuiInputLabel-root': {
                                                    fontSize: '14px', // Increased label font size
                                                    fontWeight: 'bold', // Made label bold
                                                    marginBottom: '0px',
                                                },
                                                '& .MuiInputBase-root': {
                                                    fontSize: '14px',
                                                    paddingTop: '0px',
                                                    paddingBottom: '0px',
                                                }
                                            }}
                                        />
                                    </Grid>
                                ))}
                                <Grid item xs={12} sm={6} md={3}>
                                    <Autocomplete
                                        options={glNumberOptions}
                                        getOptionLabel={(option) => option.label}
                                        renderInput={(params) => (
                                            <TextField {...params} label="GL Number" name="glNumber" size="small" fullWidth sx={{
                                                '& .MuiInputLabel-root': {
                                                    fontSize: '14px', // Increased label font size
                                                    fontWeight: 'bold', // Made label bold
                                                    marginBottom: '0px',
                                                },
                                                '& .MuiInputBase-root': {
                                                    fontSize: '14px',
                                                    paddingTop: '0px',
                                                    paddingBottom: '0px',
                                                }
                                            }} />
                                        )}
                                        value={glNumberOptions.find(option => option.label === formData.glNumber) || null}
                                        onChange={(e, newValue) => {
                                            setFormData({
                                                ...formData,
                                                glNumber: newValue ? newValue.label : ''
                                            });
                                        }}

                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0 }}>
                                    <Button type="submit" variant="contained" color="primary" sx={{ fontSize: '12px', padding: '6px 16px' }}>
                                        {formData.pledgeId ? 'Update Pledge' : 'Add Pledge'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                        <TableContainer
                            component={Paper}
                            sx={{

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
                            }}

                        >
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        {headers.map((heading, index) => (
                                            <TableCell key={index} sx={{ fontSize: '0.675rem', lineHeight: 1 }}>
                                                {heading}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {pledges.map((pledge, index) => (
                                        <TableRow key={pledge.pledgeId} onDoubleClick={() => handleRowDoubleClick(pledge)}>
                                            {/* <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>{index + 1}</TableCell> */}
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>{pledge.glNumber}</TableCell>
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>{pledge.dateOfPledge}</TableCell>
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>{pledge.bankName}</TableCell>
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>{pledge.goldWeight}</TableCell>
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>{pledge.loanAmount}</TableCell>
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>{pledge.interestRate}</TableCell>
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>{pledge.itemDetails}</TableCell>
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>{pledge.otherCharges}</TableCell>
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>{pledge.repledgeNumber}</TableCell>
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>{pledge.loanDuration}</TableCell>
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>{pledge.maturityDate}</TableCell>
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
                </Grid>

                {/* Right Side: Table Summary */}
                <Grid item xs={12} md={4}>
                    <BankDetailsModal />
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
                                    <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>Bank Name</TableCell>
                                    <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>Interest Rate</TableCell>
                                    <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>Other Charges</TableCell>
                                    <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>Duration</TableCell>
                                    <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>Remark</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pledges.map((pledge, index) => (
                                    <TableRow key={pledge.pledgeId}>
                                        <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>{pledge.bankName}</TableCell>
                                        <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>{pledge.interestRate}</TableCell>
                                        <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>{pledge.otherCharges}</TableCell>
                                        <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>{pledge.loanDuration}</TableCell>
                                        <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>{pledge.itemDetails}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Box >
    );
};

export default PledgeMasterPage;
