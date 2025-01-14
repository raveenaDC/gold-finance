import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Button, Dialog, DialogContent, DialogTitle, Grid, TextField, Select, MenuItem, Typography, Box, IconButton } from '@mui/material';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,

    Paper,
} from '@mui/material';

import { viewAccountHeadName } from '../../services/accounts/account.service'

import SearchPaymentModal from '../../components/Payment Search';



const CashPaymentsModal = () => {
    const [open, setOpen] = useState(false);
    const [paymentType, setPaymentType] = useState('Payables');
    const [selectedAccount, setSelectedAccount] = useState({ accountName: '', chartId: '' }); // Store both category and id


    const [formData, setFormData] = useState({

        description: "",
        debit: "",
        amountDate: "",
        accountType: "1",
    })
    const amountDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format


    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [loading, setLoading] = useState(true);

    const [accountHeadName, setaccountHeadName] = useState([]); // Initialize as an array

    const handleAccountChange = (event) => {
        const selectedOption = accountHeadName.find(account => account.category === event.target.value);
        if (selectedOption) {
            setSelectedAccount({ accountName: selectedOption.category, chartId: selectedOption._id });
        }
    };

    const fetchAcountHeadName = async () => {
        try {
            const response = await viewAccountHeadName();
            console.log("here", response);

            if (!response?.isSuccess) {
                alert(response.result);
                return;
            }
            // setaccountHeadName(response.result.data.items); // Store the fetched data as an array
        } catch (error) {
            console.error('Error fetching account head names:', error);
            alert('Failed to fetch account head names. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchAcountHeadName();
    }, []);


    return (
        <div>
            <Typography variant="body1" onClick={handleOpen} sx={{ fontSize: '17px' }}>
                Payments
            </Typography>
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>Cash Payments
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                size="small"
                                label="Date"
                                type="date"
                                value={amountDate} // Use the variable instead of a string
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <TextField size='small' label="Vr No" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Select
                                size='small'
                                value={paymentType}
                                onChange={(e) => setPaymentType(e.target.value)}
                                sx={{
                                    marginLeft: '220px',  // Adjust as needed for alignment
                                    width: '200px',        // Correct usage of width as a style
                                }}
                            >
                                <MenuItem value="General">General</MenuItem>
                                <MenuItem value="Payables">Payables</MenuItem>
                            </Select>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6">Account Details</Typography>
                            <Box display="flex" justifyContent="space-between" mt={1}>
                                <Select
                                    size='small'
                                    value={selectedAccount.accountName}
                                    onChange={handleAccountChange}
                                    fullWidth
                                >
                                    {accountHeadName.map((account) => (
                                        <MenuItem key={account.chartId} value={account.category}>
                                            {account.category}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <TextField size='small' label="Description" value={formData.description} fullWidth style={{ marginLeft: 16 }} />
                                <TextField size='small' label="Amount" value={formData.debit} style={{ marginLeft: 16 }} />
                            </Box>
                        </Grid>


                        <Grid item xs={12} textAlign="center" mt={2}>
                            <Button variant="outlined" color="primary" style={{ marginLeft: 8 }}> <SearchPaymentModal /></Button>
                            <Button variant="contained" color="success" style={{ marginLeft: 8 }}>Save</Button>
                            <Button variant="contained" color="secondary" style={{ marginLeft: 8 }}>Exit</Button>
                        </Grid>

                        {/* <Grid item xs={12} textAlign="right">
                            <Typography variant="h5" color="textSecondary">Total: 0.00</Typography>
                        </Grid> */}
                    </Grid>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CashPaymentsModal;
